import requests from "../requests"
import { RegisterRole } from "../Models"

const login = async (username: string, password: string) => {
    const response = await requests.post("/auth/login", new URLSearchParams({ username: username, password: password }), {
        headers: {
            ContentType: "application/x-www-form-urlencoded",
        },
        withCredentials: true,
    })
    return response
}

const logout = async () => {
    const response = await requests.post("/auth/logout", {}, { withCredentials: true })
    return response
}

const register = async (
    email: string,
    username: string,
    password: string,
    name: string,
    surname: string,
    role: RegisterRole,
    image: any | undefined
) => {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("name", name)
    formData.append("surname", surname)
    formData.append("role", role)
    if (image) {
        formData.append("image", image)
    }

    const response = await requests.post("/auth/register", formData, {
        headers: {
            ContentType: "multipart/form-data",
        },
    })
    return response
}

const confirmEmail = async (token: string) => {
    const response = await requests.post(`/auth/confirm-registration/${token}`)
    return response
}

export { login, logout, register, confirmEmail }
