import { Navbar, ViewProblemBox } from "../components"
import { useLocation, useNavigate } from "react-router-dom"


const OrganiserProblemPage = () => {
    const location = useLocation()
    const problem = location.state.problem
    const navigate = useNavigate()


    const goToEditProblemPage = () => {
        navigate(`/organiser/edit-problem/${problem.id}`);
    }

    const goToOrganiserPage = () => {
        navigate(`/organiser/home`);
    }

    return (
        <div>
            <Navbar/>
            <div className="mt-[30px] mx-[10px]">
                <ViewProblemBox problem={problem}/>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
                <button onClick={goToEditProblemPage} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">Edit Problem</button>
                <button onClick={goToOrganiserPage} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg">Back to homepage</button>
            </div>
        </div>

    )
}

export default OrganiserProblemPage
