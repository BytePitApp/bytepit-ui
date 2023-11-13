import { Navigate } from "react-router-dom"

type ProtectedRouteProps = {
    auth: boolean
    redirectPath?: string
    children: React.ReactNode
}

const ProtectedRoute = ({ auth, redirectPath = "/", children }: ProtectedRouteProps) => {
    if (!auth) {
        return <Navigate to={redirectPath} replace />
    }

    return children
}

export default ProtectedRoute
