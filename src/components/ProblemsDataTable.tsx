import { useRef, useState } from "react"
import { Problem } from "../Models"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { OverlayPanel } from "primereact/overlaypanel"
import { Avatar } from "primereact/avatar"
import { useNavigate } from "react-router-dom"
import "../pages/AdminHomePage.css"

interface Props {
    problems: Problem[]
    loading: boolean
    paginatorLeftFunction: () => any
}

const ProblemsDataTable = ({ problems, loading, paginatorLeftFunction }: Props) => {
    const navigate = useNavigate()
    const [overlayText, setOverlayText] = useState<string>("")
    const opRef = useRef<OverlayPanel>(null)

    const paginatorLeft = () => {
        return (
            <Button
                icon="pi pi-refresh"
                text={true}
                onClick={paginatorLeftFunction}
            />
        )
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            <p>No problems found.</p>
        )
    }

    const runtimeLimitBodyTemplate = (rowData: Problem) => {
        const hours = Math.floor(rowData.runtime_limit / 3600)
        const minutes = Math.floor((rowData.runtime_limit % 3600) / 60)
        const remainingSeconds = Math.floor(rowData.runtime_limit % 60)
        return (
            <div>{`
                ${hours > 0 ? hours + "h " : "0h "}
                ${minutes > 0 ? minutes + "min " : "0min "}
                ${remainingSeconds > 0 ? remainingSeconds + "s" : "0s"}
            `}</div>
        )
    }

    const organiserBodyTemplate = (rowData: Problem): React.ReactNode => {
        return (
            <div className="flex items-center gap-1 px-2 py-1">
                {rowData.organiser_image ?
                    <Avatar
                        className="transition-transform ease-in-out duration-200 cursor-pointer hover:scale-105"
                        image={`data:image/jpeg;base64,${rowData.organiser_image}`}
                        size="normal"
                    />
                :
                    <Avatar
                        className="bg-secondary text-white transition-transform ease-in-out duration-200 cursor-pointer hover:scale-105"
                        icon="pi pi-user"
                        size="normal"
                    />
                }
                <p>{rowData.organiser_username}</p>
            </div>
        )
    }

    const booleanBodyTemplate = (bool: boolean) => {
        return (
            <i className={bool
                ? "text-2xl align-middle pi true-icon pi-check-circle text-green-500"
                : "text-2xl align-middle pi false-icon pi-times-circle text-red-400"
            }></i>
        )
    }

    const createdOnBodyTemplate = (rowData: Problem): React.ReactNode => {
        const dateTimeOptions: any = { hour12: false, year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }
        return (
            <p>{rowData.created_on_date?.toLocaleString("en-US", dateTimeOptions)}</p>
        )
    }

    const editProblemBodyTemplate = (rowData: Problem): React.ReactNode => {
        return (
            <Button
                label="Edit"
                className="shadow-darkgray drop-shadow-xl hover:scale-105 h-10
                transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                onClick={() => navigate(`/admin/edit-problem/${rowData.id}`)}
            />
        )
    }

    const textBodyTemplate = (text: string): React.ReactNode => {
        return (
            <div onMouseEnter={(e) => {setOverlayText(text); opRef.current?.show(e, null)}}
                onMouseLeave={(e) => opRef.current?.toggle(e)}>
                <p className="line-clamp-2" onMouseEnter={(e) => {setOverlayText(text); opRef.current?.show(e, null)}}>
                    {text}
                </p>
            </div>
        )
    }

    return (
        <>
            <OverlayPanel 
                className="max-w-[40%] bg-graymedium shadow-lg shadow-black/50"
                ref={opRef}>
                {overlayText}
            </OverlayPanel>
            <DataTable
                className="text-[2vh]"
                value={problems}
                paginator
                rows={5}
                size={"small"}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginatorLeft={paginatorLeft()}
                paginatorRight={<div></div>}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filterDisplay="menu"
                showGridlines={true}
                tableStyle={{ minWidth: "50rem" }}
                stripedRows
                emptyMessage={renderProgressSpinner()}
                header={
                    <p className="px-2 text-2xl text-center text-primary">Problems</p>
                }
                paginatorClassName="rounded-b-xl"
                pt={{
                    root: { className: "border-graydark border-2 rounded-xl" },
                    header: { className: "rounded-t-[0.6rem]" },
                    rowGroupHeader: { className: "text-xs" },
                }}
                cellClassName={() => "p-1"}>
                <Column
                    sortable
                    field="name"
                    header="Title"
                    body={(rowData: Problem) => textBodyTemplate(rowData.name)}
                    headerClassName="text-sm"
                />
                <Column 
                    sortable 
                    field="description" 
                    header="Description"
                    body={(rowData: Problem) => textBodyTemplate(rowData.description)}
                    headerClassName="text-sm"
                />
                <Column
                    sortable
                    field="num_of_points"
                    header="Num of points"
                    bodyClassName="text-center"
                    headerClassName="text-sm"
                />
                <Column
                    sortable
                    field="runtime_limit"
                    header="Runtime limit"
                    bodyClassName="text-center whitespace-nowrap"
                    headerClassName="text-sm"
                    body={runtimeLimitBodyTemplate}
                />
                <Column
                    field="organiser_username"
                    body={organiserBodyTemplate}
                    header="Organiser"
                    headerClassName="text-sm"
                />
                <Column 
                    sortable={true}
                    field="is_hidden"
                    header="Hidden"
                    dataType="boolean"
                    bodyClassName="text-center"
                    headerClassName="text-sm"
                    body={(rowData: Problem) => booleanBodyTemplate(rowData.is_hidden)}
                />
                <Column
                    sortable={true}
                    field="is_private"
                    header="Private"
                    dataType="boolean"
                    bodyClassName="text-center"
                    headerClassName="text-sm"
                    body={(rowData: Problem) => booleanBodyTemplate(rowData.is_private)}
                />
                <Column
                    sortable
                    field="created_on"
                    header="Created on"
                    headerClassName="text-sm"
                    bodyClassName="whitespace-nowrap text-center"
                    body={createdOnBodyTemplate}
                />
                <Column
                    header="Edit"
                    body={editProblemBodyTemplate}
                    bodyClassName="px-4"
                    headerClassName="centered-column-header text-sm"
                />
            </DataTable>
        </>
    )
}

export default ProblemsDataTable