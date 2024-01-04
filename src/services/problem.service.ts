import requests from "../requests"

const getAllProblems = async () => {
    const response = await requests.get("/problems")
    return response
}

export { getAllProblems }
