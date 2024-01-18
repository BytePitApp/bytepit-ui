import { DataTable } from "primereact/datatable"
import { Competition } from "../Models"
import { Column } from "primereact/column"
import { FaGamepad, FaPlayCircle, FaTrophy } from "react-icons/fa"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Calendar } from "primereact/calendar"
import {
    createVirtualCompetition,
    getAllCompetitions,
    getAllCompetitionsForOrganiser,
    getRandomCompetition,
} from "../services/competition.service"
import { Nullable } from "primereact/ts-helpers"
import { useCallback, useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"

const isCompetitionActive = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()
    return start < now && end > now
}

const ContestantHomeCompetitionTable: React.FC = () => {
    const [searchDate, setSearchDate] = useState<Nullable<Date>>(new Date())
    const [loading, setLoading] = useState(true)
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [shownCompetitions, setShownCompetitions] = useState<Competition[]>([])
    const navigate = useNavigate()
    const { auth } = useAuth()

    const fetchAllCompetitions = useCallback(async () => {
        setLoading(true)
        try {
            const res = await getAllCompetitions()
            const competitionsData = res.data.map((item: Competition) => {
                return {
                    ...item,
                    start_time_date: new Date(item.start_time),
                    end_time_date: new Date(item.end_time),
                }
            })
            setCompetitions(competitionsData)
            setShownCompetitions(
                competitionsData.filter((item: Competition) => isCompetitionActive(item.start_time, item.end_time))
            )
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchAllCompetitions()
    }, [])

    const handleDateChange = (date: Nullable<Date>) => {
        setLoading(true)
        if (date) {
            setSearchDate(date)
            const competitionsOnDate = competitions.filter((item) => {
                const startDateZero = new Date(item.start_time)
                startDateZero.setHours(0, 0, 0, 0)
                const endDateZero = new Date(item.end_time)
                endDateZero.setHours(0, 0, 0, 0)
                if (startDateZero <= date && endDateZero >= date) {
                    return { item }
                }
            })

            setShownCompetitions(competitionsOnDate)
        }
        setLoading(false)
    }

    const handleActiveCompetitions = () => {
        setLoading(true)
        const date = new Date()
        setSearchDate(date)
        const activeCompetitions = competitions.filter((item) => isCompetitionActive(item.start_time, item.end_time))
        setShownCompetitions(activeCompetitions)
        setLoading(false)
    }

    const handleCreateVirtualCompetition = async (parentCompetitionId: string) => {
        setLoading(true)
        try {
            const organiserCompetitions = await getAllCompetitionsForOrganiser(auth?.id)
            const alreadyRunning = organiserCompetitions.data.find(
                (item: Competition) =>
                    item.parent_id === parentCompetitionId && isCompetitionActive(item.start_time, item.end_time)
            )
            if (alreadyRunning) {
                navigate(`/contestant/virtual-competition/${alreadyRunning.id}`)
            } else {
                const response = await createVirtualCompetition(parentCompetitionId)
                navigate(`/contestant/virtual-competition/${response.data}`)
            }
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }

    const handleRandomVirtualCompetition = async () => {
        setLoading(true)
        try {
            const randomCompetitionResponse = await getRandomCompetition()
            const organiserCompetitions = await getAllCompetitionsForOrganiser(auth?.id)
            const alreadyRunning = organiserCompetitions.data.find(
                (item: Competition) =>
                    item.parent_id === randomCompetitionResponse.data.id &&
                    isCompetitionActive(item.start_time, item.end_time)
            )
            if (alreadyRunning) {
                navigate(`/contestant/virtual-competition/${alreadyRunning.id}`)
            } else {
                const response = await createVirtualCompetition(randomCompetitionResponse.data.id)
                navigate(`/contestant/virtual-competition/${response.data}`)
            }
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
        setLoading(false)
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between p-2 text-primary">
                <div className="flex flex-col md:flex-row gap-5 items-center text-center">
                    <p className="max-md:hidden text-2xl flex items-center">Available competitions</p>
                    <Button
                        label="Start a virtual competition"
                        icon={<FaTrophy className="text-sm lg:text-2xl" />}
                        className="shadow-darkgray drop-shadow-xl hover:scale-105 flex gap-2 text-sm 
                            transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                        onClick={handleRandomVirtualCompetition}
                    />
                    <Button
                        label="Playground"
                        icon={<FaGamepad className="text-sm lg:text-2xl" />}
                        className="shadow-darkgray drop-shadow-xl hover:scale-105 flex gap-2 text-sm 
                        transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                        onClick={() => navigate("/contestant/playground")}
                    />
                </div>
                <div className="flex gap-4">
                    <Button
                        label="Active competitions"
                        className="shadow-darkgray drop-shadow-xl hover:scale-105
                        transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                        onClick={handleActiveCompetitions}
                    />
                    <Calendar
                        panelClassName="shadow-darkgray shadow-xl rounded-xl"
                        value={searchDate}
                        onChange={(e) => {
                            e.value?.setHours(0, 0, 0, 0)
                            handleDateChange(e.value)
                        }}
                    />
                </div>
            </div>
        )
    }

    const renderProgressSpinner = () => {
        return loading ? (
            <div className="flex justify-center items-center h-56">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            </div>
        ) : (
            "No competitions found."
        )
    }

    const availableForBodyTemplate = (rowData: Competition): React.ReactNode => {
        const dateTimeOptions: any = {
            hour12: false,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
        const units = ["minute", "hour", "day", "year"]
        const unitValues = [60, 60, 24, 365]
        let duration = (rowData.end_time_date!!.getTime() - rowData.start_time_date!!.getTime()) / 1000
        let durationText = ""
        if (duration <= unitValues[0]) {
            durationText = `${Math.floor(duration)} s`
        } else {
            let unitIndex = 0
            while (duration >= unitValues[unitIndex] && unitIndex <= units.length - 1) {
                duration /= unitValues[unitIndex]
                unitIndex++
            }
            durationText = `${Math.floor(duration)} ${units[unitIndex - 1]}(s)`
        }
        const endDateString = rowData.end_time_date!!.toLocaleString("en-US", dateTimeOptions)
        const startDateString = rowData.start_time_date!!.toLocaleString("en-US", dateTimeOptions)
        return (
            <div className="min-w-[12rem]">
                <p className="font-semibold text-base">{durationText}</p>
                <p className="text-sm">
                    {rowData?.end_time_date && rowData?.end_time_date < new Date() ? "expired" : "expires"}:{" "}
                    {endDateString}
                </p>
                <p className="text-sm">starts: {startDateString}</p>
            </div>
        )
    }

    const startBodyTemplate = (rowData: Competition): React.ReactNode => {
        const finished = rowData.end_time_date!! <= new Date()
        return (
            <div className="flex justify-center items-center">
                <Link to={`/contestant/competition/${rowData.id}`}>
                    <Button
                        label={finished ? "Results" : "Join"}
                        disabled={rowData.start_time_date!! >= new Date()}
                        icon={
                            finished ? null : (
                                <FaPlayCircle className="mr-1 transition-colors duration-150 ease-in-out" />
                            )
                        }
                        className="py-2 px-3 text-lg text-primary hover:text-graymedium bg-graymedium hover:bg-primary transition-colors ease-in-out duration-150"
                    />
                </Link>
            </div>
        )
    }

    const createVirtualCompetitionBodyTemplate = (rowData: Competition): React.ReactNode => {
        const showVirtualButton = rowData.end_time_date!! <= new Date()
        return (
            <div className="flex justify-center items-center">
                {rowData.parent_id !== null ? (
                    <p className="self-center font-semibold">Already virtual</p>
                ) : (
                    <Button
                        label="Virtual"
                        disabled={!showVirtualButton}
                        onClick={() => handleCreateVirtualCompetition(rowData.id)}
                        icon={<FaTrophy className="mr-1 transition-colors duration-150 ease-in-out" />}
                        className="py-2 px-3 text-lg text-primary hover:text-graymedium bg-graymedium hover:bg-primary transition-colors ease-in-out duration-150"
                    />
                )}
            </div>
        )
    }
    return (
        <div className="grow p-[5%] flex flex-col gap-y-20">
            <DataTable
                value={shownCompetitions}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                size={"small"}
                emptyMessage={renderProgressSpinner}
                stripedRows
                showGridlines={true}
                sortField="endTime"
                sortOrder={1}
                header={renderHeader}
                showHeaders={false}
                scrollable
                loading={loading}
                scrollHeight="100%"
                rowClassName={(rowData: Competition) => {
                    const endedClass = rowData.end_time_date && rowData.end_time_date < new Date() ? "bg-gray-100" : ""
                    const parentClass = rowData.parent_id ? (rowData.parent_id !== null ? "bg-purple-100" : "") : ""
                    return `${endedClass} ${parentClass}`
                }}
                paginatorClassName="rounded-b-xl"
                pt={{
                    root: { className: "border-graydark border-2 rounded-xl shadow-xl shadow-darkgray" },
                    header: { className: "rounded-t-xl" },
                }}
                className="text-[1.5vh]"
            >
                <Column field="name" body={(rowData: Competition) => rowData.name} />
                <Column field="description" bodyClassName="overflow-y-auto max-sm:min-w-[50vw]" />
                <Column body={availableForBodyTemplate} />
                <Column
                    bodyClassName="text-center text-md font-semibold"
                    body={(rowData: any) => {
                        return (
                            <>
                                <p className="text-lg">{rowData.problems.length}</p> problem
                                {rowData.problems.length > 1 && "s"}
                            </>
                        )
                    }}
                />
                <Column body={startBodyTemplate} />
                <Column body={createVirtualCompetitionBodyTemplate} />
            </DataTable>
        </div>
    )
}

export default ContestantHomeCompetitionTable
