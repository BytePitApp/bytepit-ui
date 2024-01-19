import requests from "../requests"

const getCurrentUser = async () => {
    return await requests.get("/auth/current")
}

const getUserById = async (id?: string) => {
    return await requests.get(`/auth/${id}`)
}

const getUserByUsername = async (username?: string) => {
    return await requests.get(`/auth/${username}`)
}

const getCurrentUsersStatistics = async (id?: string) => {
    return await requests.get(`/problems/user-statistics/${id}`)
}

export { getCurrentUser, getCurrentUsersStatistics, getUserById, getUserByUsername }
