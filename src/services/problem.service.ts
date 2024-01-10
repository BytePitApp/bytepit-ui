import requests from "../requests"
import { CreateSubmission } from "../Models"

const getAllProblems = async () => {
    const response = await requests.get("/problems")
    return response
}

const getProblem = async (id: string) => {
    const response = await requests.get(`/problems/${id}`)
    return response
}

const createSubmission = async (submission: CreateSubmission) => {
    const formData = new FormData()
    formData.append("problem_id", submission.problemId)
    formData.append("source_code", submission.sourceCode)
    formData.append("language", submission.language)
    if (submission.competitionId) {
        formData.append("competition_id", submission.competitionId)
    }
    const response = await requests.post("/problems/create-submission", formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })
    return response
}

export { getAllProblems, createSubmission, getProblem }
