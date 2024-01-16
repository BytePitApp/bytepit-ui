import { useCallback, useEffect, useState } from "react"
import { AdminViewEnum, Competition, Problem, User } from "../Models"
import { changeUserRole, confirmOrganiser, getAllUsers } from "../services/admin.service"
import { getAllProblems } from "../services/problem.service"
import { getAllCompetitions } from "../services/competition.service"
import UsersDataTable from "./UsersDataTable"
import CompetitionDataTable from "./CompetitionDataTable"
import ProblemsDataTable from "./ProblemsDataTable"
import AdminDashboardViewSelect from "./AdminDashboardViewSelect"

const AdminDashboard: React.FC = () => {
    const [selectedView, setSelectedView] = useState<AdminViewEnum>(AdminViewEnum.USERS)
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [problems, setProblems] = useState<Problem[]>([])

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getAllUsers()
            setUsers(response.data)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }, [])

    const fetchProblems = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getAllProblems()
            const problemsData = response.data.map((item: Problem) => {
                const organiser = users.find((user) => user.id === item.organiser_id)
                return {
                    ...item,
                    organiser_username: organiser?.username,
                    organiser_image: organiser?.image || undefined,
                    created_on_date: new Date(item.created_on),
                }
            })
            setProblems(problemsData)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }, [users])

    const fetchCompetitions = useCallback(async () => {
        setLoading(true)
        try {
            console.log(users)
            const response = await getAllCompetitions()
            const competitionsData = response.data.map((item: Competition) => {
                const organiser = users.find((user) => user.id === item.organiser_id)
                return {
                    ...item,
                    organiser_username: organiser?.username,
                    organiser_image: organiser?.image || undefined,
                    start_time_date: new Date(item.start_time),
                    end_time_date: new Date(item.end_time),
                }
            })
            setCompetitions(competitionsData)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }, [users])

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        if (users.length === 0) return
        fetchCompetitions()
        fetchProblems()
    }, [users])

    const updateOrganiser = useCallback(async (username: string) => {
        setLoading(true)
        try {
            await confirmOrganiser(username)
            const response = await getAllUsers()
            setUsers(response.data)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }, [])

    const changeUserRoleHandler = useCallback(async (username: string, newRole: string) => {
        try {
            await changeUserRole(username, newRole)
            fetchUsers()
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    return (
        <div className="p-[5%]">
            <AdminDashboardViewSelect selectedView={selectedView} setSelectedView={setSelectedView} />
            {selectedView === AdminViewEnum.USERS && (
                <UsersDataTable
                    changeUserRoleHandler={changeUserRoleHandler}
                    updateOrganiser={updateOrganiser}
                    loading={loading}
                    users={users}
                    paginatorLeftFunction={fetchUsers}
                />
            )}
            {selectedView === AdminViewEnum.COMPETITIONS && (
                <CompetitionDataTable
                    competitions={competitions}
                    loading={loading}
                    paginatorLeftFunction={fetchCompetitions}
                />
            )}
            {selectedView === AdminViewEnum.PROBLEMS && (
                <ProblemsDataTable problems={problems} loading={loading} paginatorLeftFunction={fetchProblems} />
            )}
        </div>
    )
}

export default AdminDashboard
