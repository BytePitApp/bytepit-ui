import { AdminDashboard, Navbar } from "../components"
import "./AdminHomePage.css"

const AdminHomePage = () => {
    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <AdminDashboard />
        </div>
    )
}

export default AdminHomePage
