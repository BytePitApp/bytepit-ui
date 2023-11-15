import { Navigate, Outlet } from "react-router-dom"
import { Role } from "../Models"
import { ProgressSpinner } from "primereact/progressspinner"
import useAuth from "../hooks/useAuth"

type ProtectedRouteProps = {
    allowedRoles: Role[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { auth, loading } = useAuth()

    if (loading) {
        return <ProgressSpinner />
    }

    if (!auth) {
        return <Navigate to="/login" />
    }

    if (!allowedRoles.includes(auth.role)) {
        return <Navigate to={`${auth.role}/home`} />
    }

    return <Outlet />
}

export default ProtectedRoute
