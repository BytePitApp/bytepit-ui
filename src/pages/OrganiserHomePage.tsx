import { useState, useEffect, useCallback } from "react"
import { Navbar } from "../components"
import { DataTable } from "primereact/datatable"
import { getOrganisersProblems } from "../services/organiser.service"
import { useParams } from "react-router-dom"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Column } from "primereact/column"
import { getCurrentUser } from "../services/users.service"

const OrganiserHomePage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [problems, setProblems] = useState<any>([])
    const [user, setUser] = useState<any>(null)

    const fetchUser = useCallback(async () => {
        try {
            const response = await getCurrentUser()
            setUser(response.data)
            return response.data
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchProblems = useCallback(async () => {
        try {
            const user = await fetchUser()
            setLoading(true)
            const response = await getOrganisersProblems(user?.id) // Access the user's id
            setProblems(response.data)
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
            <DataTable
                className="mt-[5%] mx-[5%] text-[2vh]"
                value={problems}
                paginator
                rows={10}
                size={"small"}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
                filterDisplay="menu"
                showGridlines={true}
                stripedRows
                sortField="name"
                sortOrder={1}
                emptyMessage={progressSpinner}
                header={header}
                paginatorClassName="rounded-b-[0.6rem] border-graydark"
                pt={{
                    root: { className: "border-graydark border-2 rounded-t-xl rounded-b-xl" },
                    header: { className: "rounded-t-[0.6rem]" },
                    rowGroupHeader: { className: "text-xs" },
                    // +: { className: "p-0" },
                }}
                cellClassName={(data) => "p-1"}
            >
                <Column field="name" sortable header="Name" headerClassName="text-sm"></Column>
                <Column field="num_of_points" sortable header="Points" headerClassName="text-sm"></Column>
                <Column field="description" header="Description" headerClassName="text-sm"></Column>
                <Column field="is_private" sortable header="Private" headerClassName="text-sm"></Column>
            </DataTable>
        </div>
    )
}

export default OrganiserHomePage