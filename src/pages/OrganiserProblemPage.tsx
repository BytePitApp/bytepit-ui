import { useState, useEffect, useCallback } from "react"
import { Navbar } from "../components"
import { DataTable } from "primereact/datatable"
import { getOrganisersProblems } from "../services/organiser.service"
import { useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Column } from "primereact/column"
import { getCurrentUser } from "../services/users.service"
import { Problem } from "../Models"
import useAuth from "../hooks/useAuth"
import { ProblemList } from "../components"


const OrganiserProblemPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [problems, setProblems] = useState<any>([])
    const { auth } = useAuth()


    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getOrganisersProblems(auth?.id) // Access the user's id
            const problems : Problem[] = response.data
            setProblems(problems)
            setLoading(false)
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchProblems()
    }, [])

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between px-2">
                <h2 className="text-2xl text-primary">Problems List</h2>
            </div>
        )
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No users found."
        )
    }
    
    const header = renderHeader()
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchProblems} />
    const paginatorRight = <Button type="button" className="hidden" />
    const progressSpinner = renderProgressSpinner()

    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <div className="mt-[30px]">
                <ProblemList problems={problems} />
            </div>
            
            
        </div>
    )
}

export default OrganiserProblemPage