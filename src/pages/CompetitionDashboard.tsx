import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ProgressSpinner } from "primereact/progressspinner"
import { getCompetitionResults } from "../services/competition.service"
import { Column } from "primereact/column"
import { classNames } from "primereact/utils"
import ProblemResult from "../Models/ProblemResult"
import CompetitionResult from "../Models/CompetitionResult"
import { CompetitionDashboardProps } from "../Models/CompetitionDashboardProps"
import ParsedCompetitionResult from "../Models/ParsedCompetitionResult"
import { Dialog } from "primereact/dialog"
import React from "react"
import useAuth from "../hooks/useAuth"

const CompetitionDashboard: React.FC<CompetitionDashboardProps> = ({ competition }) => {
    const { auth } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [competitionResults, setCompetitionResults] = useState<CompetitionResult[]>()
    const [parsedCompetitionResults, setParsedCompetitionResults] = useState<ParsedCompetitionResult[]>([])
    const [numOfProblemResults, setNumOfProblemResults] = useState<number>(0)
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false)
    const [selectedProblemResult, setSelectedProblemResult] = useState<ProblemResult | null>(null)
    const { id } = useParams<{ id: string }>()

    const parseCompetitionResults = useCallback(async () => {
        const parsedCompetitionResults: ParsedCompetitionResult[] = []

        competitionResults?.forEach((competitionResult: CompetitionResult) => {
            const parsedResult: ParsedCompetitionResult = {
                user_id: competitionResult.user_id,
                username: competitionResult.username,
                total_points: competitionResult.total_points,
            }

            competitionResult.problem_results.forEach((problemResult: ProblemResult, index: number) => {
                const numOfPointsKey = `num_of_points${index + 1}`
                const problemResultIdKey = `problem_result_id${index + 1}`
                parsedResult[numOfPointsKey] = problemResult.num_of_points
                parsedResult[problemResultIdKey] = problemResult.id
            })

            parsedCompetitionResults.push(parsedResult)
        })

        setParsedCompetitionResults(parsedCompetitionResults)
    }, [competitionResults])

    useEffect(() => {
        parseCompetitionResults()
        console.log(parsedCompetitionResults)
    }, [parseCompetitionResults])

    const getCompetitionResultsData = useCallback(async () => {
        try {
            const competitionResults = await getCompetitionResults(id ?? "")
            setCompetitionResults(competitionResults.data)
            setLoading(false)
            setNumOfProblemResults(competitionResults.data[0].problem_results.length)
            parseCompetitionResults()
        } catch (err: any) {
            console.log(err)
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [id])

    useEffect(() => {
        getCompetitionResultsData()
    }, [getCompetitionResultsData])

    const findProblemResultById = (problemResultId: string): ProblemResult | null => {
        const foundResult = competitionResults
            ?.flatMap((result) => result.problem_results)
            .find((problemResult) => problemResult.id === problemResultId)
        return foundResult || null
    }

    const openDialog = (problemResultId: string) => {
        const foundProblemResult = findProblemResultById(problemResultId)
        setSelectedProblemResult(foundProblemResult)
        setVisibleDialog(true)
    }

    const closeDialog = () => {
        setVisibleDialog(false)
        setSelectedProblemResult(null)
    }

    const dialogFooter = (
        <div>
            <Button label="Close" icon="pi pi-times" onClick={closeDialog} />
        </div>
    )

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No users found."
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between px-2">
                <h2 className="text-xl text-primary">Competition Results</h2>
            </div>
        )
    }

    const renderProblemResultColumns = () => {
        const columns: React.ReactNode[] = []
        for (let i = 1; i <= numOfProblemResults; i++) {
            columns.push(
                <Column
                    className="bg-purple-100 text-[2vh]"
                    key={`problem_result_id${i}`}
                    field={`problem_result_id${i}`}
                    header={`${i}. Problem`}
                    style={{ maxWidth: "2rem", textAlign: "center" }}
                    headerClassName="centered-column-header bg-purple-200 text-[2vh]"
                    body={(rowData) => (
                        <Button
                            className="p-button-rounded p-button-text"
                            size="small"
                            label="Solution"
                            icon="pi pi-external-link"
                            onClick={() => openDialog(rowData[`problem_result_id${i}`])}
                        />
                    )}
                />,
                <Column
                    className="bg-purple-100"
                    key={`num_of_points${i}`}
                    field={`num_of_points${i}`}
                    header="Points"
                    headerClassName="centered-column-header bg-purple-200 text-[2vh]"
                    style={{ maxWidth: "1.4rem", textAlign: "center" }}
                />
            )
        }
        return columns
    }

    const renderRowNumberColumn = () => {
        const hasTrophies = competition?.trophies && competition.trophies.length == 3
        return (
            <Column
                className={"bg-graydark"}
                key="row_number"
                header="#"
                body={(rowData, { rowIndex }) =>
                    hasTrophies && rowIndex < 3 ? (
                        <img
                            src={`data:image/png;base64,${(competition?.trophies as any[])[rowIndex]?.icon?.toString("base64")}`}
                            alt={`Trophy ${rowIndex + 1}`}
                            style={{ maxWidth: "1.5rem", display: "block", margin: "auto" }}
                        />
                    ) : (
                        rowIndex + 1 + "."
                    )
                }
                style={{ maxWidth: "1.5rem", textAlign: "center" }}
                headerClassName={"centered-column-header bg-graydark"}
            />
        )
    }

    const usernameBodyTemplate = (rowData: any) => {
        return rowData.user_id === auth?.id ? (
            <div className="font-medium text-blue-900 w-full flex justify-between">
                <div className="w-fit hover:scale-[102%] hover:text-blue-800 transition-all ease-in-out duration-150">
                    <a href={`/profiles/contestant/${rowData.user_id}`}>
                        {rowData.username}
                    </a>
                </div>
                <div className="bg-red-400 w-9 rounded-2xl text-center text-gray-700 text-sm flex justify-center items-center select-none">You</div>
            </div>
        ) : (
            <div className="font-medium text-blue-900 hover:scale-[102%] hover:text-blue-800 transition-all ease-in-out duration-150 max-w-fit">
                <a href={`/profiles/contestant/${rowData.user_id}`}>
                    {rowData.username}
                </a>
            </div>
        )
    }

    const header = renderHeader()
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={getCompetitionResultsData} />
    const paginatorRight = <Button type="button" className="hidden" />
    const progressSpinner = renderProgressSpinner()
    const problemResultColumns = renderProblemResultColumns()
    const rowNumberColumn = renderRowNumberColumn()

    return (
        <>
            {loading ? (
                progressSpinner
            ) : parsedCompetitionResults.length === 0 ? (
                <div className="font-medium text-lg">Nobody participated on this competition</div>
            ) : (
                <div className="w-[100%]">
                    <DataTable
                        className="mt-[2%] text-[2vh] max-h-[80vh] overflow-auto"
                        value={parsedCompetitionResults}
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
                        loading={loading}
                        stripedRows
                        sortField="name"
                        sortOrder={1}
                        header={header}
                        paginatorClassName="rounded-b-[0.6rem] border-graydark"
                        pt={{
                            root: { className: "border-graydark border-2 rounded-t-xl rounded-b-xl" },
                            header: { className: "rounded-t-[0.6rem]" },
                            rowGroupHeader: { className: "text-xs" },
                        }}
                        cellClassName={(data) => "p-1"}>
                        {rowNumberColumn}
                        <Column
                            className="pl-3 bg-graymedium text-[2vh]"
                            header="User"
                            headerClassName="pl-3 bg-graydark"
                            style={{ maxWidth: "2.7rem" }}
                            body={usernameBodyTemplate}
                        />
                        {problemResultColumns}
                        <Column
                            className="bg-green-100 text-[2vh]"
                            field="total_points"
                            header="Total points"
                            style={{ maxWidth: "2rem", textAlign: "center" }}
                            headerClassName="centered-column-header bg-green-200"
                        />
                    </DataTable>
                </div>
            )}
            <Dialog
                className="min-w-fit max-h-[70%]"
                visible={visibleDialog}
                modal
                header={`Problem Result:`}
                footer={dialogFooter}
                style={{ width: "50rem" }}
                onHide={closeDialog}>
                {selectedProblemResult && (
                    <div className="flex w-full">
                        <div className="flex flex-col gap-3 w-[50%] h-max">
                            {
                                <p className="font-semibold">
                                    Correct:{" "}
                                    <i
                                        className={classNames("pi", {
                                            "true-icon pi-check-circle text-green-500": selectedProblemResult.is_correct,
                                            "false-icon pi-times-circle text-red-400": !selectedProblemResult.is_correct,
                                        })}></i>
                                </p>
                            }
                            <p className="font-semibold">
                                Points: <a className="font-normal">{selectedProblemResult.num_of_points}</a>
                            </p>
                            <p className="font-semibold">
                                Average runtime: <a className="font-normal">{selectedProblemResult.average_runtime}ms</a>
                            </p>
                            <p className="font-semibold">
                                Language:{" "}
                                <a className="font-normal">
                                    {selectedProblemResult.language.toString()[0].toUpperCase() +
                                        selectedProblemResult.language.toString().slice(1)}
                                </a>
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-[50%]">
                            <p className="font-semibold">Source code: </p>
                            <textarea
                                className="resize-none h-full w-[90%] rounded-md border-graydark border-2 p-2"
                                readOnly
                                value={selectedProblemResult.source_code}></textarea>
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    )
}

export default CompetitionDashboard
