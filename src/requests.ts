import axios from "axios"

let url = process.env.API_URL || "http://localhost:8000/api"

const instance = axios.create({
    baseURL: url,
})

instance.defaults.withCredentials = true

export default instance
