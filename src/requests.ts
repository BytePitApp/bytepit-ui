import axios from "axios"

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "http://bytepit.com" : "http://localhost:8000"

export default axios