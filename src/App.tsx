import React, { useState } from "react"
import { Routes, Route, Link, Outlet, useParams } from "react-router-dom"
import { AdminHomePage, ContestantHomePage, LoginPage, OrganiserHomePage, RegisterPage } from "./pages"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
    // TODO
    const [auth, setAuth] = useState(false)

    return (
        <>
            <Navigation />
            {auth ? (
                <div className="bg-blue-500 cursor-pointer p-2 w-fit" onClick={() => setAuth(!auth)}>
                    Logout
                </div>
            ) : (
                <div className="bg-blue-500 cursor-pointer p-2 w-fit" onClick={() => setAuth(!auth)}>
                    Login
                </div>
            )}
            <Routes>
                <Route index path="/" element={<div>Landing page</div>} />
                <Route
                    path="admin/home"
                    element={
                        <ProtectedRoute auth={auth}>
                            <AdminHomePage></AdminHomePage>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="organiser/home"
                    element={
                        <ProtectedRoute auth={auth}>
                            <OrganiserHomePage></OrganiserHomePage>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="contestant/home"
                    element={
                        <ProtectedRoute auth={auth}>
                            <ContestantHomePage></ContestantHomePage>
                        </ProtectedRoute>
                    }
                />
                <Route path="login" element={<LoginPage></LoginPage>} />
                <Route path="register" element={<RegisterPage></RegisterPage>} />
                {/* This is just an example */}
                <Route
                    path="profiles"
                    element={
                        <ProtectedRoute auth={auth}>
                            <div>
                                <div>Profiles</div>
                                <div>
                                    <Outlet />
                                </div>
                            </div>
                        </ProtectedRoute>
                    }>
                    <Route path="contestant/:id" element={<Profile />} />
                </Route>
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </>
    )
}

const Navigation = () => {
    return (
        <nav>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/">Home</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/admin/home">Admin Home</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/organiser/home">Organiser Home</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/contestant/home">Contestant Home</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/login">Login</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/profiles">Profile</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/profiles/contestant/1">Profile 1</Link>
            </div>
            <div className="p-2 bg-red-400 m-2">
                <Link to="/register">Register</Link>
            </div>
        </nav>
    )
}

const Profile = () => {
    let params = useParams()

    return <div>Profile {params.id}</div>
}

export default App
