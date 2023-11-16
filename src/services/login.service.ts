import requests from "../requests"
import { RegisterRole, Role } from "../Models"

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

const register = async (email: string, username: string, password: string, name: string, surname: string, role: RegisterRole) => {
    const response = await requests.post(
        "/auth/register",
        new URLSearchParams({
            email: email,
            username: username,
            password: password,
            name: name,
            surname: surname,
            role: role,
            // image: "",
        }),
        {
            headers: {
                ContentType: "application/x-www-form-urlencoded",
            },
        }
    )
    return response
}

const confirmEmail = async (token: string) => {
    const response = await requests.post(`/auth/confirm-registration/${token}`) 
    return response
}

export { login, logout, register, confirmEmail }
