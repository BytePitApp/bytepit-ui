import { useState, useRef, FormEvent, useCallback, useEffect } from "react"
import { Navbar } from "../components"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toast, ToastMessage } from "primereact/toast"
import { getCompetition, modifyCompetition } from "../services/competition.service"
import { getAllProblems } from "../services/problem.service"
import { useNavigate, useParams } from "react-router-dom"
import { ModifyCompetition, Problem } from "../Models"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { Nullable } from "primereact/ts-helpers"
import useAuth from "../hooks/useAuth"

const EditCompetitionPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [showOption, setShowOption] = useState("your")
    const [dateTime, setDateTime] = useState<Nullable<(Date | null)[]>>(null)
    const [showProblems, setShowProblems] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [problems, setProblems] = useState<any>([])
    const [formDataModified, setFormDataModified] = useState<ModifyCompetition>({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        problems: [],
        firstPlaceTrophyImage: undefined,
        secondPlaceTrophyImage: undefined,
        thirdPlaceTrophyImage: undefined,
    })
    const [formData, setFormData] = useState<ModifyCompetition>({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        problems: [],
        firstPlaceTrophyImage: undefined,
        secondPlaceTrophyImage: undefined,
        thirdPlaceTrophyImage: undefined,
    })
    const { auth } = useAuth()

    const toast = useRef<Toast>(null)
    const calendarRef = useRef<Calendar>(null)

    const sendToast = (message: ToastMessage) => {
        toast.current?.show(message)
    }

    const addProblem = (id: string) => {
        setFormDataModified({
            ...formDataModified,
            problems: [...formDataModified.problems, id],
        })
    }

    const removeProblem = (id: string) => {
        setFormDataModified({
            ...formDataModified,
            problems: formDataModified.problems.filter((problem) => problem !== id),
        })
    }

    const setProblemsToShow = (opt: string) => {
        setShowOption(opt)
        setCurrentPage(1)
    }

    const summarizeDescription = (description: string): string => {
        if (description.length > 70) {
            return description.slice(0, 70) + "..."
        }
        return description
    }

    const handleValueChange = (e: any) => {
        const { name, value } = e.target
        setFormDataModified({
            ...formDataModified,
            [name]: value,
        })
    }

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllProblems()
            setProblems(response.data)
            setLoading(false)
        } catch (err: any) {
            console.log(err)
        }
    }, [])

    const fetchCompetition = useCallback(async (competitionId: string) => {
        try {
            setLoading(true)
            const res = await getCompetition(competitionId)
            setFormDataModified({
                name: res.data.name,
                description: res.data.description,
                startTime: res.data.start_time,
                endTime: res.data.end_time,
                problems: res.data.problems.map((problem: any) => problem.id),
                firstPlaceTrophyImage: undefined,
                secondPlaceTrophyImage: undefined,
                thirdPlaceTrophyImage: undefined,
            })
            setFormData({
                name: res.data.name,
                description: res.data.description,
                startTime: res.data.start_time,
                endTime: res.data.end_time,
                problems: res.data.problems.map((problem: any) => problem.id),
                firstPlaceTrophyImage: res.data.trophies[0]?.icon || undefined,
                secondPlaceTrophyImage: res.data.trophies[1]?.icon || undefined,
                thirdPlaceTrophyImage: res.data.trophies[2]?.icon || undefined,
            })
            setDateTime([new Date(res.data.start_time), new Date(res.data.end_time)])
            setLoading(false)
        } catch (err: any) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        if (id) {
            fetchCompetition(id)
        }
        fetchProblems()
    }, [])

    const handleDateTimeChange = (inputDates: Nullable<(Date | null)[]>) => {
        setDateTime(inputDates)
        if (!inputDates) {
            return
        }
        setFormDataModified({
            ...formDataModified,
            startTime: !inputDates[0] ? "" : formatDate(inputDates[0]!),
            endTime: !inputDates[1] ? "" : formatDate(inputDates[1]!),
        })
    }

    const formatDate = (inputedDate: Date): string => {
        const time = inputedDate.toLocaleTimeString("en-US", { hour12: false }).split(":")
        const date = inputedDate.toLocaleDateString("en-US", { hour12: false }).split("/")
        return `${date[2]}-${date[1].padStart(2, "0")}-${date[0].padStart(2, "0")} ${time[0]}:${time[1]}:00`
    }

    const incrementPage = () => {
        if (showOption === "your") {
            if (problems.filter((p: Problem) => p.organiser_id === auth?.id).length / 10 < currentPage) {
                return
            }
        } else {
            if (problems.filter((p: Problem) => p.organiser_id !== auth?.id).length / 10 < currentPage) {
                return
            }
        }
        setCurrentPage(currentPage + 1)
    }

    const decrementPage = () => {
        if (currentPage === 1) {
            return
        }
        setCurrentPage(currentPage - 1)
    }

    const submitForm = async (e: FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)
            await modifyCompetition(id!, formDataModified, formData)
            sendToast({
                severity: "success",
                summary: "Success!",
                detail: "Competition created successfully!",
                life: 10000,
            })
            setLoading(false)
            navigate("/organiser/home", { replace: true })
        } catch (err: any) {
            if (Array.isArray(err.response.data.detail)) {
                for (const error of err.response.data.detail) {
                    sendToast({
                        severity: "error",
                        summary: "Error!",
                        detail: error,
                    })
                }
            } else {
                sendToast({
                    severity: "error",
                    summary: "Error!",
                    detail: err.response.data.detail,
                })
            }
        }
    }

    const footerTemplate = () => {
        return (
            <div className="flex justify-around items-center">
                <Button
                    label="Clear"
                    icon="pi pi-times-circle"
                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                    onClick={() => {
                        calendarRef.current?.hide()
                        setDateTime(null)
                    }}
                />
                <Button
                    label="Close"
                    icon="pi pi-home"
                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                    onClick={() => calendarRef.current?.hide()}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen justify-center">
            {loading && (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            )}
            <Navbar />
            <div className="absolute right-0 py-10 px-6 z-50">
                <Toast ref={toast} />
            </div>
            <div className="bg-form bg-cover grow flex flex-row justify-center items-center">
                <form
                    onSubmit={submitForm}
                    className="mx-[5%] rounded-xl px-[5%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4">
                    <div className="flex flex-col gap-[3vh] h-[85vh] py-10 overflow-auto scrollbar-hide items-center">
                        <span className="text-[4vh] text-center font-semibold text-primary">Modify Competition</span>
                        <span className="text-[2vh] text-center text-slate-950 mb-0">
                            Please fill in the form fields that you wish to change.
                        </span>
                        <span className="p-float-label mb-4">
                            <InputText
                                name="name"
                                value={formDataModified.name}
                                onChange={handleValueChange}
                                className="w-[20rem] lg:w-[24rem] text-[2vh] rounded-[1vh]"
                            />
                            <label htmlFor="in">Name</label>
                        </span>
                        <span className="p-float-label mb-4">
                            <InputTextarea
                                id="description"
                                className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
                                autoResize
                                name="description"
                                value={formDataModified.description}
                                rows={5}
                                cols={30}
                                onChange={handleValueChange}
                            />
                            <label htmlFor="description">Description</label>
                        </span>
                        {formData.firstPlaceTrophyImage && (
                            <img
                                src={`data:image/jpeg;base64,${formData.firstPlaceTrophyImage}`}
                                alt="First Place Trophy"
                                className="bg-center bg-cover w-[20rem] lg:w-[24rem] rounded-[1vh]"
                            />
                        )}
                        <div className="relative pointer-events-none">
                            <label
                                htmlFor="firstPlaceTrophyImage"
                                className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center">
                                First Place Trophy Image...
                            </label>
                            <input
                                id="firstPlaceTrophyImage"
                                className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                type="file"
                                onChange={(e: any) =>
                                    setFormDataModified({
                                        ...formDataModified,
                                        firstPlaceTrophyImage: e.target.files[0],
                                    })
                                }
                            />
                        </div>
                        {formData.secondPlaceTrophyImage && (
                            <img
                                src={`data:image/jpeg;base64,${formData.secondPlaceTrophyImage}`}
                                alt="Second Place Trophy"
                                className="bg-center bg-cover w-[20rem] lg:w-[24rem] rounded-[1vh]"
                            />
                        )}
                        <div className="relative pointer-events-none">
                            <label
                                htmlFor="secondPlaceTrophyImage"
                                className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center">
                                Second Place Trophy Image...
                            </label>
                            <input
                                id="secondPlaceTrophyImage"
                                className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                type="file"
                                onChange={(e: any) =>
                                    setFormDataModified({
                                        ...formDataModified,
                                        secondPlaceTrophyImage: e.target.files[0],
                                    })
                                }
                            />
                        </div>
                        {formData.thirdPlaceTrophyImage && (
                            <img
                                src={`data:image/jpeg;base64,${formData.thirdPlaceTrophyImage}`}
                                alt="Third Place Trophy"
                                className="bg-center bg-cover w-[20rem] lg:w-[24rem] rounded-[1vh]"
                            />
                        )}
                        <div className="relative pointer-events-none">
                            <label
                                htmlFor="thirdPlaceTrophyImage"
                                className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center">
                                Third Place Trophy Image...
                            </label>
                            <input
                                id="thirdPlaceTrophyImage"
                                className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                type="file"
                                onChange={(e: any) =>
                                    setFormDataModified({
                                        ...formDataModified,
                                        thirdPlaceTrophyImage: e.target.files[0],
                                    })
                                }
                            />
                        </div>
                        <Calendar
                            id="calendar-24h"
                            className="w-[20rem] lg:w-[24rem]"
                            panelStyle={{
                                backgroundColor: "#f8f9fa",
                                border: "1px",
                                borderColor: "primary",
                                borderRadius: "0.5rem",
                                borderStyle: "solid",
                            }}
                            pt={{
                                input: {
                                    root: { className: "hover:border-[#554acf]" },
                                },
                                dropdownButton: {
                                    root: { className: "bg-primary border-[#554acf]" },
                                },
                            }}
                            value={dateTime}
                            onChange={(e) => handleDateTimeChange(e.value)}
                            selectionMode="range"
                            showTime
                            showIcon
                            hourFormat="24"
                            readOnlyInput
                            ref={calendarRef}
                            placeholder="Duration"
                            footerTemplate={footerTemplate}
                        />
                        <div className="lg:w-[50rem] flex flex-col items-center">
                            <Button
                                label={showProblems ? "Hide Problems" : "Show Problems"}
                                className="bg-primary hover:bg-primarylight text-white font-semibold w-fit"
                                type="button"
                                onClick={() => setShowProblems(!showProblems)}
                            />
                            {showProblems && (
                                <div className="grid grid-cols-2 my-4 w-full">
                                    <div
                                        className={`${
                                            showOption === "your" ? "bg-secondarylight" : "bg-secondarydark"
                                        } hover:bg-secondary flex justify-center items-center text-white p-2 rounded-tl-lg cursor-pointer font-semibold text-md`}
                                        onClick={() => setProblemsToShow("your")}>
                                        Your Problems
                                    </div>
                                    <div
                                        className={`${
                                            showOption === "other" ? "bg-secondarylight" : "bg-secondarydark"
                                        } hover:bg-secondary flex justify-center items-center text-white p-2 rounded-tr-lg cursor-pointer font-semibold text-md`}
                                        onClick={() => setProblemsToShow("other")}>
                                        Other Problems
                                    </div>
                                    <div className="col-span-2 border-b-2 border-x-2 border-secondary bg-gray-300 rounded-b-lg">
                                        <div>
                                            {showOption === "your" ? (
                                                <>
                                                    {problems.find((p: Problem) => p.organiser_id === auth?.id) ? (
                                                        <div>
                                                            {problems
                                                                .filter((p: Problem) => p.organiser_id === auth?.id)
                                                                .slice((currentPage - 1) * 10, currentPage * 10)
                                                                .map((problem: Problem) => {
                                                                    return (
                                                                        <div
                                                                            key={problem.id}
                                                                            className="bg-graydark m-2 border border-gray-400 rounded-lg py-2 px-4">
                                                                            <div className="flex justify-between">
                                                                                <div className="flex flex-col">
                                                                                    <span>{problem.name}</span>
                                                                                    <span className="text-xs">
                                                                                        {summarizeDescription(problem.description)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex justify-center items-center gap-4">
                                                                                    <span className="text-sm">
                                                                                        {problem.num_of_points} points
                                                                                    </span>
                                                                                    {formDataModified.problems.includes(problem.id) ? (
                                                                                        <div
                                                                                            className="bg-secondarylight pi pi-times text-white p-1 rounded-xl cursor-pointer"
                                                                                            onClick={() => removeProblem(problem.id)}></div>
                                                                                    ) : (
                                                                                        <div
                                                                                            className="bg-primarylight pi pi-plus text-white p-1 rounded-xl cursor-pointer"
                                                                                            onClick={() => addProblem(problem.id)}></div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            <div className="flex p-2 justify-center items-center gap-8">
                                                                <div
                                                                    className="pi pi-chevron-left bg-primarylight text-white p-2 rounded-2xl cursor-pointer"
                                                                    onClick={decrementPage}></div>
                                                                <div className="text-xl w-14 flex justify-center items-center select-none">
                                                                    {currentPage}
                                                                </div>
                                                                <div
                                                                    className="pi pi-chevron-right bg-primarylight text-white p-2 rounded-2xl cursor-pointer"
                                                                    onClick={incrementPage}></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center items-center">No problems found</div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {problems.find((p: Problem) => p.organiser_id !== auth?.id) ? (
                                                        <div>
                                                            {problems
                                                                .filter((p: Problem) => p.organiser_id !== auth?.id)
                                                                .slice((currentPage - 1) * 10, currentPage * 10)
                                                                .map((problem: Problem) => {
                                                                    return (
                                                                        <div
                                                                            key={problem.id}
                                                                            className="bg-graydark m-2 border border-gray-400 rounded-lg py-2 px-4">
                                                                            <div className="flex justify-between">
                                                                                <div className="flex flex-col">
                                                                                    <span>{problem.name}</span>
                                                                                    <span className="text-xs">
                                                                                        {summarizeDescription(problem.description)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex justify-center items-center gap-4">
                                                                                    <span className="text-sm">
                                                                                        {problem.num_of_points} points
                                                                                    </span>
                                                                                    {formDataModified.problems.includes(problem.id) ? (
                                                                                        <div
                                                                                            className="bg-secondarylight pi pi-times text-white p-1 rounded-xl cursor-pointer"
                                                                                            onClick={() => removeProblem(problem.id)}></div>
                                                                                    ) : (
                                                                                        <div
                                                                                            className="bg-primarylight pi pi-plus text-white p-1 rounded-xl cursor-pointer"
                                                                                            onClick={() => addProblem(problem.id)}></div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            <div className="flex p-2 justify-center items-center gap-8">
                                                                <div
                                                                    className="pi pi-chevron-left bg-primarylight text-white p-2 rounded-2xl cursor-pointer"
                                                                    onClick={decrementPage}></div>
                                                                <div className="text-xl w-14 flex justify-center items-center select-none">
                                                                    {currentPage}
                                                                </div>
                                                                <div
                                                                    className="pi pi-chevron-right bg-primarylight text-white p-2 rounded-2xl cursor-pointer"
                                                                    onClick={incrementPage}></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center items-center">No problems found</div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showProblems && formDataModified.problems.length > 0 && (
                                <div className="bg-gray-300 rounded-lg border-secondary border-2 my-4 w-full">
                                    <div className="py-2 text-xl p-2 justify-center items-center flex bg-secondary text-white font-semibold">
                                        Selected Problems
                                    </div>
                                    {formDataModified.problems.map((problemId: string) => {
                                        const problem = problems.find((p: Problem) => p.id === problemId)
                                        return (
                                            <div key={problem.id} className="bg-graydark m-2 border border-gray-400 rounded-lg py-2 px-4">
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col">
                                                        <span>{problem?.name}</span>
                                                        <span className="text-xs">{summarizeDescription(problem?.description)}</span>
                                                    </div>
                                                    <div className="flex justify-center items-center gap-4">
                                                        <span className="text-sm">{problem?.num_of_points} points</span>
                                                        <div
                                                            className="bg-secondarylight pi pi-times text-white p-1 rounded-xl cursor-pointer"
                                                            onClick={() => removeProblem(problemId)}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            <div className="flex justify-between items-center w-full px-2">
                                <Button
                                    label="Back"
                                    icon="pi pi-arrow-left"
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    type="button"
                                    onClick={() => navigate("/organiser/home", { replace: true })}
                                />
                                <Button
                                    label="Submit"
                                    icon="pi pi-check"
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    type="submit"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCompetitionPage
