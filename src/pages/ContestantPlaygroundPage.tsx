import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getAvailableProblems } from "../services/problem.service"
import { FaPlayCircle } from "react-icons/fa"
import { Problem } from "../Models"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { ProgressSpinner } from "primereact/progressspinner"
import { OverlayPanel } from "primereact/overlaypanel"
import { Column } from "primereact/column"
import { Navbar } from "../components"

const ContestantPlaygroundPage = () => {
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
                onMouseLeave={(e) => opRef.current?.toggle(e)}>
                <p
                    className="line-clamp-2"
                    onMouseEnter={(e) => {
                        setOverlayText(text)
                        opRef.current?.show(e, null)
                    }}>
                    {text}
                </p>
            </div>
        )
    }

    const goBodyTemplate = (rowData: Problem): React.ReactNode => {
        return (
            <div className="flex justify-center items-center my-4">
                <Button
                    label="Go"
                    onClick={() => navigate(`/contestant/playground/problem/${rowData.id}`)}
                    icon={<FaPlayCircle className="mr-1 transition-colors duration-150 ease-in-out" />}
                    className="py-2 px-3 text-lg text-primary hover:text-graymedium bg-graymedium hover:bg-primary transition-colors ease-in-out duration-150"
                />
            </div>
        )
    }

    return (
        <div className="bg-form bg-cover min-h-screen">
            <Navbar />
            <div className="grow p-[5%] flex flex-col gap-y-20">
                <OverlayPanel className="max-w-[40%] bg-graymedium shadow-lg shadow-black/50" ref={opRef}>
                    {overlayText}
                </OverlayPanel>
                <DataTable
                    className="text-sm"
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
                        field="example_input"
                        header="Example input"
                        body={(rowData: Problem) => textBodyTemplate(rowData.example_input)}
                        headerClassName="text-sm"
                    />
                    <Column
                        sortable
                        field="example_output"
                        header="Example output"
                        body={(rowData: Problem) => textBodyTemplate(rowData.example_output)}
                        headerClassName="text-sm"
                    />
                    <Column
                        sortable
                        field="num_of_points"
                        header="Num of points"
                        bodyClassName="text-center text-xl font-semibold"
                        headerClassName="text-sm"
                    />
                    <Column
                        header="Try It Out"
                        body={goBodyTemplate}
                        bodyClassName="px-4 max-w-[4rem] w-fit"
                        headerClassName="centered-column-header text-sm"
                    />
                </DataTable>
            </div>
        </div>
    )
}

export default ContestantPlaygroundPage
