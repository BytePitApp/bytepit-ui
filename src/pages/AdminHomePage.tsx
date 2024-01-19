import { AdminDashboard, Navbar } from "../components"
import "./AdminHomePage.css"

const AdminHomePage: React.FC = () => {
    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <AdminDashboard />
        </div>
    )
}

export default AdminHomePage
