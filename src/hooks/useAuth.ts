import { useContext } from "react"
import AuthContext, { AuthContextType } from "../context/AuthContext"

const useAuth = (): AuthContextType => {
    return useContext(AuthContext)
}

export default useAuth
