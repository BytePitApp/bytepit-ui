import { UserInfo, Navbar, ProblemsTable, CompetitionsTable } from "../components"
import { useParams } from "react-router-dom"

const OrganiserProfilePage = () => {
    const { id } = useParams<{ id: string }>()

    return (
        <div className="bg-form bg-cover min-h-screen pb-4">
            <Navbar />
            <div className="m-10 bg-graymedium px-[5%] rounded-xl flex flex-col py-8 border-b-4 border-graydark">
                <UserInfo userId={id} />
                <ProblemsTable userId={id} />
                <CompetitionsTable userId={id} />
            </div>
        </div>
    )
}

export default OrganiserProfilePage
