import requests from "../requests"

const getCurrentUser = async () => {
    return await requests.get("/auth/current")
}

export { getCurrentUser }
