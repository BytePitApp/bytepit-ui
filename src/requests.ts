import axios from "axios"

let url = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"

const instance = axios.create({
    baseURL: url,
})

instance.defaults.withCredentials = true

export default instance
