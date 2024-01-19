import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useEffect, useState } from "react"
import { getAllCompetitionsForOrganiser } from "../services/competition.service"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"

interface CompetitionsTableProps {
    userId?: string
}

const CompetitionsTable = ({ userId }: CompetitionsTableProps) => {
    const [loading, setLoading] = useState(true)
    const [competitions, setCompetitions] = useState<any>([])
    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                setLoading(true)
                const response = await getAllCompetitionsForOrganiser(userId)
                setCompetitions(response.data)
                setLoading(false)
            } catch (err: any) {
                console.error(err)
            }
        }

        fetchCompetitions()
    }, [])

    const descriptionBodyTemplate = (rowData: any) => {
        const description = rowData.description
        return description.length > 160 ? description.substring(0, 160) + "..." : description
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            <p>No competitions found for this organiser.</p>
        )
    }

    const paginatorLeft = () => {
        return <Button icon="pi pi-refresh" text={true} />
    }

    const formatDateWithLeadingZeros = (date: Date) => {
        var options = { timeZone: "UTC" }
        var month = new Intl.DateTimeFormat("en-US", { month: "2-digit", ...options }).format(date)
        var day = new Intl.DateTimeFormat("en-US", { day: "2-digit", ...options }).format(date)
        var year = new Intl.DateTimeFormat("en-US", { year: "numeric", ...options }).format(date)
        var hours = new Intl.DateTimeFormat("en-US", { hour: "2-digit", hour12: false, ...options }).format(date)
        var minutes = new Intl.DateTimeFormat("en-US", { minute: "2-digit", ...options }).format(date)
        minutes.length === 1 ? (minutes = "0" + minutes) : (minutes = minutes)

        return `${month}/${day}/${year} ${hours}:${minutes}`
    }

    return (
        <DataTable
            className="text-[1.5vh]"
            style={{ borderRadius: "20px", backgroundColor: "white" }}
            value={competitions}
            paginator
            removableSort
            rows={5}
            size={"small"}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            paginatorLeft={paginatorLeft()}
            paginatorRight={<div></div>}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            filterDisplay="menu"
            showGridlines={true}
            stripedRows
            emptyMessage={renderProgressSpinner()}
            header={<h2 className="px-2 text-2xl text-primary">Competition List</h2>}
            paginatorClassName="border-graydark rounded-b-[1.1rem]"
            pt={{
                root: { className: "border-graydark border-2 rounded-t-xl rounded-b-xl" },
                header: { className: "rounded-t-[1.1rem]" },
                rowGroupHeader: { className: "text-xs" },
            }}
            cellClassName={() => "p-1"}
        >
            <Column field="name" header="Name" sortable></Column>
            <Column
                field="description"
                header="Description"
                className="min-w-[10rem]"
                body={descriptionBodyTemplate}
            ></Column>
            <Column
                field="start_time"
                header="Start Time"
                sortable
                className="text-center w-36 max-w-[9rem]"
                body={(rowData) => formatDateWithLeadingZeros(new Date(rowData.start_time))}
            ></Column>
            <Column
                field="end_time"
                header="End Time"
                sortable
                className="text-center w-36 max-w-[9rem]"
                body={(rowData) => formatDateWithLeadingZeros(new Date(rowData.end_time))}
            ></Column>
        </DataTable>
    )
}

export default CompetitionsTable
