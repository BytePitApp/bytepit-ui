import { useCallback, useEffect, useRef, useState } from "react"
import { Problem } from "../Models"
import { OverlayPanel } from "primereact/overlaypanel"
import { useNavigate } from "react-router-dom"
import { getAvailableProblems } from "../services/problem.service"
import { ProgressSpinner } from "primereact/progressspinner"
import { Button } from "primereact/button"
import { FaPlayCircle } from "react-icons/fa"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

const PlaygroundProblemList: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [problems, setProblems] = useState<Problem[]>([])
    const [overlayText, setOverlayText] = useState<string>("")
    const opRef = useRef<OverlayPanel>(null)
    const navigate = useNavigate()

    const getProblems = useCallback(async () => {
        try {
            const problems = await getAvailableProblems()
            setProblems(problems.data)
            setLoading(false)
        } catch (err: any) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        getProblems()
    }, [getProblems])

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No active competitions found."
        )
    }

    const textBodyTemplate = (text: string): React.ReactNode => {
        return (
            <div
                onMouseEnter={(e) => {
                    setOverlayText(text)
                    opRef.current?.show(e, null)
                }}
                onMouseLeave={(e) => opRef.current?.toggle(e)}
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

    const goBodyTemplate = (rowData: Problem): React.ReactNode => {
        return (
            <div className="flex justify-center items-center">
                <Button
                    label="Go"
                    onClick={() => navigate(`/contestant/playground/problem/${rowData.id}`)}
                    icon={<FaPlayCircle className="mr-1 transition-colors duration-150 ease-in-out" />}
                    className="py-1 px-4 text-lg text-primary hover:text-graymedium bg-graymedium hover:bg-primary transition-colors ease-in-out duration-150"
                />
            </div>
        )
    }
    return (
        <div className="grow p-[5%] flex flex-col gap-y-20">
            <OverlayPanel className="max-w-[40%] bg-graymedium shadow-lg shadow-black/50" ref={opRef}>
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
                rowsPerPageOptions={[5, 10, 25, 50]}
                filterDisplay="menu"
                showGridlines={true}
                tableStyle={{ minWidth: "50rem" }}
                stripedRows
                emptyMessage={renderProgressSpinner()}
                header={<p className="px-2 text-2xl text-primary">Problems</p>}
                paginatorClassName="rounded-b-xl"
                pt={{
                    root: { className: "border-graydark border-2 rounded-xl" },
                    header: { className: "rounded-t-[0.6rem]" },
                    rowGroupHeader: { className: "text-xs" },
                }}
                cellClassName={() => "p-1"}
            >
                <Column
                    sortable
                    field="name"
                    header="Title"
                    body={(rowData: Problem) => textBodyTemplate(rowData.name)}
                    headerClassName="text-sm"
                    bodyClassName="w-[25%]"
                />
                <Column
                    field="description"
                    header="Description"
                    body={(rowData: Problem) => textBodyTemplate(rowData.description)}
                    headerClassName="text-sm"
                    bodyClassName="w-[55%]"
                />

                <Column
                    sortable
                    field="num_of_points"
                    header="Points"
                    bodyClassName="w-[10%] text-center text-xl font-semibold"
                    headerClassName="text-sm"
                />
                <Column
                    header="Try It Out"
                    body={goBodyTemplate}
                    bodyClassName="px-4 w-[10%] max-w-[4vw] w-fit"
                    headerClassName="centered-column-header text-sm"
                />
            </DataTable>
        </div>
    )
}

export default PlaygroundProblemList
