import axios from "axios"

const url = process.env.NODE_ENV === "production" ? "https://bytepit.cloud/api" : "http://localhost:8000/api"

const instance = axios.create({
    baseURL: url,
})

instance.defaults.withCredentials = true

export default instance
