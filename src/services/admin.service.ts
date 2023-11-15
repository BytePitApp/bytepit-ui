import requests from "../requests"

const getAllUsers = async () => {
    const response = await requests.get("/admin/list-users")
    return response
}

const confirmOrganiser = async (username: string) => {
    const response = await requests.post(`/admin/confirm-organiser/${username}`)
    return response
}

const changeUserRole = async (username: string, newRole: string) => {
    const response = await requests.post(`/admin/change-role/${username}/${newRole}`)
    return response
}

export { getAllUsers, confirmOrganiser, changeUserRole }
