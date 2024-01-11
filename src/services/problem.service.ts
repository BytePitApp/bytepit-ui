import requests from "../requests"
import { CreateSubmission, CreateProblem, ModifyProblem } from "../Models"

const getAllProblems = async () => {
    const response = await requests.get("/problems")
    return response
}

const getProblem = async (id: string) => {
    const response = await requests.get(`/problems/${id}`)
    return response
}

const createProblem = async (problem: CreateProblem) => {
    const formData = new FormData()

    formData.append("name", problem.name)
    formData.append("num_of_points", problem.points.toString())
    formData.append("description", problem.description)
    formData.append("runtime_limit", problem.runtimeLimit.toString())
    formData.append("example_input", problem.exampleInput)
    formData.append("example_output", problem.exampleOutput)
    formData.append("is_private", problem.isPrivate.toString())
    problem.testFiles?.forEach((file) => {
        formData.append("test_files", file)
    })
    formData.append("is_hidden", problem.isHidden.toString())

    const response = await requests.post("/problems", formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })
    return response
}

const modifyProblem = async (problem_id: string, problem: ModifyProblem) => {
    const formData = new FormData()

    formData.append("name", problem.name?.toString() || "")
    formData.append("description", problem.description?.toString() || "")
    formData.append("num_of_points", problem.points?.toString() || "")
    formData.append("runtime_limit", problem.runtimeLimit?.toString() || "")
    formData.append("example_input", problem.exampleInput?.toString() || "")
    formData.append("example_output", problem.exampleOutput?.toString() || "")
    formData.append("is_private", problem.isPrivate?.toString() || "")
    problem.testFiles?.forEach((file) => {
        formData.append("test_files", file)
    })
    formData.append("is_hidden", problem.isHidden?.toString() || "")

    const response = await requests.patch(`/problems/${problem_id}`, formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })

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

const getProblemsForOrganiser = async (id: string | undefined) => {
    const response = await requests.get(`/problems/problems-by-organiser/${id}`)
    return response
}

export { 
    getAllProblems, 
    createSubmission,
    getProblem, 
    createProblem, 
    modifyProblem, 
    getProblemsForOrganiser,
}
