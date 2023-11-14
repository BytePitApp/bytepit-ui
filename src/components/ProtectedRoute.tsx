import { Navigate, Outlet } from "react-router-dom"
import { Role } from "../Models"
import { useEffect, useState } from "react"
import axios from "axios"
import { ProgressSpinner } from "primereact/progressspinner"

type ProtectedRouteProps = {
    allowedRoles: Role[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        axios
            .get("http://localhost:8000/user/current", {
                headers: {
                    accept: "application/json",
                },
                withCredentials: true,
            })
            .then((res) => {
                setUser(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setLoading(false)
            })
    }, [])

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center">
                    <ProgressSpinner />
                </div>
            ) : error ? (
                <Navigate to="/login" />
            ) : user ? (
                allowedRoles.includes(user.role) ? (
                    <Outlet />
                ) : (
                    <Navigate to={`/${user.role}/home`} />
                )
            ) : (
                <Navigate to="/login" />
            )}
        </>
    )
}

export default ProtectedRoute
