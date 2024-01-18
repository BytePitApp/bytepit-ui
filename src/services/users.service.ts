import requests from "../requests"

const getCurrentUser = async () => {
    return await requests.get("/auth/current")
}

const getUser = async (id: string) => {
    return await requests.get(`/auth/${id}`)
}

export { getCurrentUser, getUser }
