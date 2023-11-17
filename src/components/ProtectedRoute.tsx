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
        return (
            <div className="z-50 absolute top-1.5 left-[50%]">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        )
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
