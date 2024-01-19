import { Routes, Route } from "react-router-dom"
import {
    AdminHomePage,
    ContestantHomePage,
    LandingPage,
    EmailConfirmPage,
    LoginPage,
    OrganiserHomePage,
    RegisterPage,
    CreateCompetitionPage,
    CreateProblemPage,
    EditProblemPage,
    ContestantViewCompetitionPage,
    ContestantProblemPlaygroundPage,
    ContestantPlaygroundPage,
} from "./pages"
import ProtectedRoute from "./components/ProtectedRoute"

import "./global.css"

// primereact has to be added last, otherwise it won't work
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primeicons/primeicons.css"
import "primereact/resources/primereact.css"
import "./App.css"
import { Role } from "./Models"
import { AuthProvider } from "./context/AuthContext"
import EditCompetitionPage from "./pages/EditCompetitionPage"

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]}></ProtectedRoute>}>
                    <Route path="admin/home" element={<AdminHomePage></AdminHomePage>} />
                    <Route path="admin/edit-competition/:id" element={<EditCompetitionPage></EditCompetitionPage>} />
                    <Route path="admin/edit-problem/:id" element={<EditProblemPage></EditProblemPage>} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={[Role.CONTESTANT]}></ProtectedRoute>}>
                    <Route path="contestant/home" element={<ContestantHomePage></ContestantHomePage>} />
                    <Route
                        path="contestant/competition/:id"
                        element={<ContestantViewCompetitionPage></ContestantViewCompetitionPage>}
                    />
                    <Route
                        path="contestant/playground"
                        element={<ContestantPlaygroundPage></ContestantPlaygroundPage>}
                    />
                    <Route
                        path="contestant/playground/problem/:id"
                        element={<ContestantProblemPlaygroundPage></ContestantProblemPlaygroundPage>}
                    />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={[Role.ORGANISER]}></ProtectedRoute>}>
                    <Route path="organiser/home" element={<OrganiserHomePage></OrganiserHomePage>} />
                    <Route path="organiser/create-problem" element={<CreateProblemPage></CreateProblemPage>} />
                    <Route path="organiser/edit-problem/:id" element={<EditProblemPage></EditProblemPage>} />
                    <Route
                        path="organiser/create-competition"
                        element={<CreateCompetitionPage></CreateCompetitionPage>}
                    />
                    <Route
                        path="organiser/edit-competition/:id"
                        element={<EditCompetitionPage></EditCompetitionPage>}
                    />
                </Route>
                <Route path="login" element={<LoginPage></LoginPage>} />
                <Route path="register" element={<RegisterPage></RegisterPage>} />
                <Route path="confirm-email/:id" element={<EmailConfirmPage></EmailConfirmPage>} />
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </AuthProvider>
    )
}

export default App
