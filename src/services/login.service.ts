import requests from "../requests"
import { Role } from "../Models"

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

const register = async (email: string, username: string, password: string, name: string, surname: string, role: Role) => {
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

export { login, logout, register }
