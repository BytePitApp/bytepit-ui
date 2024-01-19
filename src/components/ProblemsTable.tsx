import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useEffect, useState } from "react"
import { getProblemsForOrganiser } from "../services/problem.service"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"

interface ProblemsTableProps {
    userId?: string
}

const ProblemsTable = ({ userId }: ProblemsTableProps) => {
    const [loading, setLoading] = useState(true)
    const [problems, setProblems] = useState<any>([])

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true)
                const response = await getProblemsForOrganiser(userId)
                setProblems(response.data)
                setLoading(false)
            } catch (err: any) {
                console.error(err)
            }
        }

        fetchProblems()
    }, [])

    const descriptionBodyTemplate = (rowData: any) => {
        const description = rowData.description
        return description.length > 160 ? description.substring(0, 160) + "..." : description
    }

    const paginatorLeft = () => {
        return <Button icon="pi pi-refresh" text={true} />
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            <p>No problems found for this organiser.</p>
        )
    }

    return (
        <DataTable
            className="text-[1.5vh] mb-8"
            style={{ borderRadius: "20px", backgroundColor: "white" }}
            value={problems}
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
            header={<h2 className="px-2 text-2xl text-primary">Problems List</h2>}
            paginatorClassName="border-graydark rounded-b-[1.1rem]"
            pt={{
                root: { className: "border-graydark border-2 rounded-t-xl rounded-b-xl" },
                header: { className: "rounded-t-[1.1rem]" },
                rowGroupHeader: { className: "text-xs" },
            }}
            cellClassName={() => "p-1"}
        >
            <Column
                field="name"
                header="Name"
                sortable
                className="min-w-[10rem]"
                headerClassName="header-cell"
            ></Column>
            <Column
                field="description"
                header="Description"
                className="min-w-[40rem]"
                body={descriptionBodyTemplate}
                headerClassName="header-cell"
            ></Column>
            <Column
                field="num_of_points"
                header="Points"
                sortable
                className="text-center font-bold"
                headerClassName="header-cell"
            ></Column>
        </DataTable>
    )
}

export default ProblemsTable
