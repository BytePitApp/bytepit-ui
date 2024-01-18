import { UserInfo, Navbar, ProblemsTable, CompetitionsTable } from "../components"
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"
import { Competition, Problem, User } from "../Models"
import { getProblemsForOrganiser } from "../services/problem.service"
import { useCallback } from "react"
import { getAllCompetitionsForOrganiser } from "../services/competition.service"
import { ProgressSpinner } from "primereact/progressspinner"
import { getUserById } from "../services/users.service"
import { useParams } from "react-router-dom"

const OrganiserProfilePage = () => {
    const [loading, setLoading] = useState(true)
    const [problems, setProblems] = useState<Problem[]>([])
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [user, setUser] = useState<User>()
    const { id } = useParams<{ id: string }>()
    const { auth } = useAuth()

    const fetchProblems = useCallback(async (): Promise<void> => {
        try {
            setLoading(true)
            const response = await getProblemsForOrganiser(id)
            const problems: Problem[] = response.data
            setProblems(problems)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchCompetitions = useCallback(async (): Promise<void> => {
        try {
            setLoading(true)
            const response = await getAllCompetitionsForOrganiser(id)
            const competitions: Competition[] = response.data
            setCompetitions(competitions)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchProblems()
        fetchCompetitions()
    }, [])

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getUserById(id)
            setUser(response.data)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [auth])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return (
        <div className="bg-form bg-cover min-h-screen pb-4">
            {loading && (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            )}
            <Navbar />
            <div className="m-10 bg-graymedium px-[5%] rounded-xl flex flex-col py-8 border-b-4 border-graydark">
                <UserInfo auth={auth} user={user} />
                <ProblemsTable />
                <CompetitionsTable />
            </div>
        </div>
    )
}

export default OrganiserProfilePage
