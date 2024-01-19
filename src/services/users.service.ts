import requests from "../requests"

const getCurrentUser = async () => {
    return await requests.get("/auth/current")
}

const getUserById = async (id: string | undefined) => {
    return await requests.get(`/auth/${id}`)
}

const getCurrentUsersStatistics = async (id: string | undefined) => {
    return await requests.get(`/problems/user-statistics/${id}`)
}

export { getCurrentUser, getCurrentUsersStatistics, getUserById }
