import { Navbar } from "../components"
import { useCallback, useEffect, useState } from "react"
import { Button } from "primereact/button"
import { getAllUsers, confirmOrganiser, changeUserRole } from "../services/admin.service"
import { Competition, Problem, User, AdminViewEnum } from "../Models"
import { getAllProblems } from "../services/problem.service"
import { getAllCompetitions } from "../services/competition.service"
import { ProblemsDataTable, CompetitionDataTable, UsersDataTable } from "../components"
import "./AdminHomePage.css"

const AdminHomePage = () => {
    const [selectedView, setSelectedView] = useState<AdminViewEnum>(AdminViewEnum.USERS)
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [problems, setProblems] = useState<Problem[]>([])

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllUsers()
            setUsers(response.data)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllProblems()
            setProblems(response.data.map((item: Problem) => {
                const organiser = users.find(user => user.id === item.organiser_id)
                return {
                    ...item,
                    organiser_username: organiser?.username,
                    organiser_image: organiser?.image || undefined,
                    created_on_date: new Date(item.created_on),
                }
            }))
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchCompetitions = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllCompetitions()
            setCompetitions(response.data.map((item: Competition) => {
                const organiser = users.find(user => user.id === item.organiser_id)
                return {
                    ...item,
                    organiser_username: organiser?.username,
                    organiser_image: organiser?.image || undefined,
                    start_time_date: new Date(item.start_time),
                    end_time_date: new Date(item.end_time),
                }
            }))
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            
            const usersResponse = await getAllUsers()
            setUsers(usersResponse.data)

            const competitionsResponse = await getAllCompetitions()
            setCompetitions(competitionsResponse.data.map((item: Competition) => {
                const organiser = usersResponse.data.find((user: User) => user.id === item.organiser_id)
                return {
                    ...item,
                    organiser_username: organiser?.username,
                    organiser_image: organiser?.image || undefined,
                    start_time_date: new Date(item.start_time),
                    end_time_date: new Date(item.end_time),
                }
            }))

            const problemsResponse = await getAllProblems()
            setProblems(problemsResponse.data.map((item: Problem) => {
                const organiser = usersResponse.data.find((user: User) => user.id === item.organiser_id)
                return {
                    ...item,
                    organiser_username: organiser?.username,
                    organiser_image: organiser?.image || undefined,
                    created_on_date: new Date(item.created_on),
                }
            }))

            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [])

    const updateOrganiser = useCallback(async (username: string) => {
        try {
            await confirmOrganiser(username)
            const response = await getAllUsers()
            setUsers(response.data)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
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
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <div className="p-[5%]">
                <div className="grid grid-flow-row lg:grid-flow-col gap-4 lg:gap-20 transition-colors ease-in-out duration-300 mb-4 lg:mb-10">
                    <Button
                        className={`border-2 border-primary hover:bg-primarylight 
                            ${selectedView === AdminViewEnum.USERS
                                ? "bg-primary"
                                : "bg-transparent text-primary hover:text-white"}`}
                        label="Users"
                        onClick={() => setSelectedView(AdminViewEnum.USERS)}
                    />
                    <Button
                        className={`border-2 border-primary hover:bg-primarylight
                            ${selectedView === AdminViewEnum.COMPETITIONS
                                ? "bg-primary"
                                : "bg-transparent text-primary hover:text-white"}`}
                        label="Competitions"
                        onClick={() => setSelectedView(AdminViewEnum.COMPETITIONS)}
                    />
                    <Button
                        className={`border-2 border-primary hover:bg-primarylight
                            ${selectedView === AdminViewEnum.PROBLEMS
                                ? "bg-primary"
                                : "bg-transparent text-primary hover:text-white"}`}
                        label="Problems"
                        onClick={() => setSelectedView(AdminViewEnum.PROBLEMS)}
                    />
                </div>
                {selectedView === AdminViewEnum.USERS &&
                    <UsersDataTable
                        users={users}
                        loading={loading}
                        paginatorLeftFunction={fetchUsers}
                        changeUserRoleHandler={changeUserRoleHandler}
                        updateOrganiser={updateOrganiser}
                    />
                }
                {selectedView === AdminViewEnum.COMPETITIONS &&
                    <CompetitionDataTable 
                        competitions={competitions}
                        loading={loading}
                        paginatorLeftFunction={fetchCompetitions}
                    />
                }
                {selectedView === AdminViewEnum.PROBLEMS &&
                    <ProblemsDataTable 
                        problems={problems}
                        loading={loading}
                        paginatorLeftFunction={fetchProblems}
                    />
                }
            </div>
        </div>
    )
}

export default AdminHomePage
