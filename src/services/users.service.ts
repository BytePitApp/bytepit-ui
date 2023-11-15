import requests from "../requests"

const getCurrentUser = async () => {
    return await requests.get("/users/current")
}

export { getCurrentUser }
