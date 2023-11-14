import { Navbar } from "./components"
import { Form } from "./components/Form"
import { FormComponentSpecification, FormTypes } from "./Models/Form"
import { useState } from "react"
import { Footer } from "./components"
import { Routes, Route, Link, Outlet, useParams } from "react-router-dom"
import { AdminHomePage, ContestantHomePage, LoginPage, OrganiserHomePage, RegisterPage } from "./pages"
import ProtectedRoute from "./components/ProtectedRoute"

import "./global.css"

// primereact has to be added last, otherwise it won't work
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"
import "./App.css"
import { Role } from "./Models"

function App() {
    return (
        <Routes>
            <Route index path="/" element={<div>Landing page</div>} />
            <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]}></ProtectedRoute>}>
                <Route path="admin/home" element={<AdminHomePage></AdminHomePage>} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={[Role.CONTESTANT]}></ProtectedRoute>}>
                <Route path="contestant/home" element={<ContestantHomePage></ContestantHomePage>} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={[Role.ORGANISER]}></ProtectedRoute>}>
                <Route path="organiser/home" element={<OrganiserHomePage></OrganiserHomePage>} />
            </Route>
            <Route path="login" element={<LoginPage></LoginPage>} />
            <Route path="register" element={<RegisterPage></RegisterPage>} />
            <Route path="*" element={<div>404</div>} />
        </Routes>
    )
}

export default App
