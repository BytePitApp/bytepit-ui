import { useRef, useState } from "react"
import { Competition } from "../Models"
import { Button } from "primereact/button"
import { OverlayPanel } from "primereact/overlaypanel"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { ProgressSpinner } from "primereact/progressspinner"
import { Avatar } from "primereact/avatar"
import { useNavigate } from "react-router-dom"
import "../pages/AdminHomePage.css"
import { ProfileLink } from "../components"

interface Props {
    competitions: Competition[]
    loading: boolean
    paginatorLeftFunction: () => any
}

const CompetitionDataTable = ({ competitions, loading, paginatorLeftFunction }: Props) => {
    const navigate = useNavigate()
    const opRef = useRef<OverlayPanel>(null)
    const [overlayText, setOverlayText] = useState<string>("")

    const paginatorLeft = () => {
        return <Button icon="pi pi-refresh" text={true} onClick={paginatorLeftFunction} />
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            <p>No competitions found</p>
        )
    }

    const dateTimeBodyTemplate = (date: Date): React.ReactNode => {
        return date.toLocaleString("en-US", {
            hour12: false,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const textBodyTemplate = (text: string): React.ReactNode => {
        return (
            <div
                onMouseEnter={(e) => {
                    setOverlayText(text)
                    opRef.current?.show(e, null)
                }}
                onMouseLeave={() => opRef.current?.hide()}
            >
                <p
                    className="line-clamp-2"
                    onMouseEnter={(e) => {
                        setOverlayText(text)
                        opRef.current?.show(e, null)
                    }}
                >
                    {text}
                </p>
            </div>
        )
    }

    const organiserBodyTemplate = (rowData: Competition): React.ReactNode => {
        return (
            <div className="flex items-center gap-1 px-2">
                {rowData?.organiser_image ? (
                    <Avatar
                        className="transition-transform ease-in-out duration-200 cursor-pointer hover:scale-105"
                        image={`data:image/jpeg;base64,${rowData.organiser_image}`}
                        size="normal"
                    />
                ) : (
                    <Avatar
                        className="bg-secondary text-white transition-transform ease-in-out duration-200 cursor-pointer hover:scale-105"
                        icon="pi pi-user"
                        size="normal"
                    />
                )}
                <ProfileLink
                    profileUrl={`/profiles/organiser/${rowData.organiser_username}`}
                    username={rowData.organiser_username as string}
                />
            </div>
        )
    }

    const editBodyTemplate = (rowData: Competition): React.ReactNode => {
        return (
            <Button
                label="Edit"
                className="shadow-darkgray drop-shadow-xl hover:scale-105 py-1
                transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                onClick={() => navigate(`/admin/edit-competition/${rowData.id}`)}
            />
        )
    }

    return (
        <>
            <OverlayPanel
                className="text-sm lg:text-base max-w-[70%] xl:max-w-[40%] bg-graymedium shadow-lg shadow-black/50"
                ref={opRef}
            >
                {overlayText}
            </OverlayPanel>
            <DataTable
                className="text-[1.5vh]"
                value={competitions}
                paginator
                rows={5}
                size={"small"}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginatorLeft={paginatorLeft()}
                paginatorRight={<div></div>}
                rowsPerPageOptions={[5, 10, 25, 50]}
                filterDisplay="menu"
                tableStyle={{ minWidth: "50rem" }}
                showGridlines={true}
                stripedRows
                emptyMessage={renderProgressSpinner()}
                header={<p className="px-2 text-2xl  text-primary">Competitions</p>}
                paginatorClassName="rounded-b-xl"
                pt={{
                    root: { className: "border-graydark border-2 rounded-xl" },
                    header: { className: "rounded-t-[0.6rem]" },
                    rowGroupHeader: { className: "text-xs" },
                }}
                cellClassName={() => "p-1"}
            >
                <Column
                    field="name"
                    header="Title"
                    sortable
                    body={(rowData: Competition) => textBodyTemplate(rowData.name)}
                />
                <Column
                    field="description"
                    sortable
                    header="Description"
                    body={(rowData: Competition) => textBodyTemplate(rowData.description)}
                />
                <Column
                    sortable
                    field="start_time"
                    header="Start time"
                    bodyClassName="text-center whitespace-nowrap"
                    body={(rowData: Competition) => dateTimeBodyTemplate(rowData.start_time_date!!)}
                />
                <Column
                    sortable
                    field="end_time"
                    header="End time"
                    bodyClassName="text-center whitespace-nowrap"
                    body={(rowData: Competition) => dateTimeBodyTemplate(rowData.end_time_date!!)}
                />
                <Column sortable field="organiser_username" body={organiserBodyTemplate} header="Organiser" />
                <Column
                    sortable
                    field="problems.length"
                    header="Problems"
                    bodyClassName="text-center"
                    body={(rowData: Competition) => rowData.problems.length}
                />

                <Column body={editBodyTemplate} bodyClassName="px-4" headerClassName="centered-column-header text-sm" />
            </DataTable>
        </>
    )
}

export default CompetitionDataTable
