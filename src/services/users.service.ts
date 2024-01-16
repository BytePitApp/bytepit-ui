import requests from "../requests"

const getCurrentUser = async () => {
    return await requests.get("/auth/current")
}

const getCurrentUsersStatistics = async (id: string | undefined) => {
    return await requests.get(`/problems/user-statistics/${id}`)
}

export { getCurrentUser, getCurrentUsersStatistics }
