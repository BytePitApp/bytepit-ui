import { useRef, useState, useEffect, useCallback, FormEvent } from "react"
import { createCompetition } from "../services/competition.service"
import { getAllProblems } from "../services/problem.service"
import useAuth from "../hooks/useAuth"
import { Navbar } from "../components"
import { Toast } from "primereact/toast"
import { ProgressSpinner } from "primereact/progressspinner"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Nullable } from "primereact/ts-helpers"
import { InputTextarea } from "primereact/inputtextarea"
import "./Organiser.css"

const CreateCompetitionPage = () => {
    const [loading, setLoading] = useState(false)
    const [firsPlaceTrophyImage, setFirstPlaceTrophyImage] = useState(undefined)
    const [secondPlaceTrophyImage, setSecondPlaceTrophyImage] = useState(undefined)
    const [thirdPlaceTrophyImage, setThirdPlaceTrophyImage] = useState(undefined)
    const [formData, setFormData] = useState<{
        name: string
        description: string
        startTime: string
        endTime: string
        problems: string[]
    }>({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        problems: [],
    })
    const [problems, setProblems] = useState<any>([])
    const [dateTime, setDateTime] = useState<Nullable<(Date | null)[]>>(null)
    const [showProblems, setShowProblems] = useState(false)
    const [showOption, setShowOption] = useState("your")
    const [currentPage, setCurrentPage] = useState(1)
    const calendarRef = useRef<Calendar>(null)
    const toast = useRef<Toast>(null)
    const firstPlaceTrophyImageRef = useRef<HTMLInputElement>(null)
    const secondPlaceTrophyImageRef = useRef<HTMLInputElement>(null)
    const thirdPlaceTrophyImageRef = useRef<HTMLInputElement>(null)
    const { auth } = useAuth()

    const handleValueChange = (e: any) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const sendToast = (toastMessage: any) => {
        toast.current?.show(toastMessage)
    }

    const closeCalendar = () => {
        calendarRef.current?.hide()
    }

    const clearCalendar = () => {
        calendarRef.current?.hide()
        setDateTime(null)
    }

    const incrementPage = () => {
        if (showOption === "your") {
            if (problems.filter((p: ProblemProps) => p.organiser_id === auth?.id).length / 10 < currentPage) {
                return
            }
        } else {
            if (problems.filter((p: ProblemProps) => p.organiser_id !== auth?.id).length / 10 < currentPage) {
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

    const setProblemsToShow = (opt: string) => {
        setShowOption(opt)
        setCurrentPage(1)
    }

    const navigateToHome = () => {
        window.location.href = "/organiser/home"
    }

    const formatDates = (inputedDates: Nullable<(Date | null)[]>): string[] => {
        setDateTime(inputedDates)
        if (!inputedDates) {
            return []
        }
        const formattedDates = []
        for (let i = 0; i < inputedDates.length; i++) {
            if (inputedDates[i]) {
                formattedDates.push(formatDate(inputedDates[i] as Date))
                if (i === 0) {
                    setFormData({
                        ...formData,
                        startTime: formatDate(inputedDates[i] as Date),
                    })
                } else {
                    setFormData({
                        ...formData,
                        endTime: formatDate(inputedDates[i] as Date),
                    })
                }
            }
        }
        return formattedDates
    }

    const addProblem = (id: string) => {
        setFormData({
            ...formData,
            problems: [...formData.problems, id],
        })
    }

    const removeProblem = (id: string) => {
        setFormData({
            ...formData,
            problems: formData.problems.filter((problem) => problem !== id),
        })
    }

    const summarizeDescription = (description: string): string => {
        if (description.length > 70) {
            return description.slice(0, 70) + "..."
        }
        return description
    }

    const formatDate = (inputedDate: Date): string => {
        const localNow = inputedDate.toLocaleString("en-US", { hour12: false })
        const localYears = localNow.split(", ")[0].split("/")[2]
        const localMonths = localNow.split(", ")[0].split("/")[0]
        const localDays = localNow.split(", ")[0].split("/")[1]
        const localHours = localNow.split(", ")[1].split(":")[0]
        const localMinutes = localNow.split(", ")[1].split(":")[1]

        const formattedDateTimeString = `${localYears}-${localMonths}-${localDays} ${localHours}:${localMinutes}:00`
        return formattedDateTimeString
    }

    const handleAddProblemsClick = () => {
        setShowProblems(!showProblems)
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

    useEffect(() => {
        fetchProblems()
    }, [])

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createCompetition(
                formData.name,
                formData.description,
                formData.startTime,
                formData.endTime,
                formData.problems,
                firsPlaceTrophyImage,
                secondPlaceTrophyImage,
                thirdPlaceTrophyImage
            )
            sendToast({
                severity: "success",
                summary: "Success!",
                detail: "Competition created successfully!",
                life: 10000,
            })
            setFormData({
                name: "",
                description: "",
                startTime: "",
                endTime: "",
                problems: [],
            })
            setDateTime(null)
            setFirstPlaceTrophyImage(undefined)
            setSecondPlaceTrophyImage(undefined)
            setThirdPlaceTrophyImage(undefined)
            firstPlaceTrophyImageRef.current!.value = ""
            secondPlaceTrophyImageRef.current!.value = ""
            thirdPlaceTrophyImageRef.current!.value = ""
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
        setLoading(false)
    }

    const footerTemplate = () => {
        return (
            <div className="flex justify-around items-center">
                <Button
                    label="Clear"
                    icon="pi pi-times-circle"
                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                    onClick={clearCalendar}
                />
                <Button
                    label="Close"
                    icon="pi pi-home"
                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                    onClick={closeCalendar}
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
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Toast ref={toast} />
            </div>
            <div className="bg-form bg-cover grow flex flex-row justify-center items-center">
                <form
                    onSubmit={submitForm}
                    className="mx-[5%] rounded-xl px-[5%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4">
                    <div className="flex flex-col gap-[3vh] h-[85vh] overflow-auto scrollbar-hide">
                        <div className="m-[5%] flex flex-col gap-2 pt-20">
                            <span className="text-[4vh] text-center font-semibold text-primary mb-2">Create Competition</span>
                            <span className="text-[2vh] text-center text-slate-950">
                                Please fill in the form below to create a competition.
                            </span>
                        </div>
                        <TextInput name="name" value={formData.name} label="Name" onUpdate={handleValueChange} />
                        <div className="flex justify-center items-center">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="description"
                                    className="w-[20rem] lg:w-[24rem] text-sm rounded-[1vh]"
                                    autoResize
                                    name="description"
                                    value={formData.description}
                                    rows={5}
                                    cols={30}
                                    onChange={handleValueChange}
                                />
                                <label htmlFor="description">Description</label>
                            </span>
                        </div>
                        <div className="flex justify-center items-center flex-col space-y-4">
                            <div className="relative pointer-events-none">
                                <label
                                    htmlFor="firstPlaceTrophyImage"
                                    className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center">
                                    First Place Trophy Image...
                                </label>
                                <input
                                    id="firstPlaceTrophyImage"
                                    ref={firstPlaceTrophyImageRef}
                                    className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                    type="file"
                                    onChange={(e: any) => setFirstPlaceTrophyImage(e.target.files[0])}
                                />
                            </div>
                            <div className="relative pointer-events-none">
                                <label
                                    htmlFor="secondPlaceTrophyImage"
                                    className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center">
                                    Second Place Trophy Image...
                                </label>
                                <input
                                    id="secondPlaceTrophyImage"
                                    ref={secondPlaceTrophyImageRef}
                                    className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                    type="file"
                                    onChange={(e: any) => setSecondPlaceTrophyImage(e.target.files[0])}
                                />
                            </div>
                            <div className="relative pointer-events-none">
                                <label
                                    htmlFor="thirdPlaceTrophyImage"
                                    className="text-xs text-gray-800 text-center absolute top-1/2 -translate-y-1/2 left-0 w-1/2 flex items-center justify-center">
                                    Third Place Trophy Image...
                                </label>
                                <input
                                    id="thirdPlaceTrophyImage"
                                    ref={thirdPlaceTrophyImageRef}
                                    className="w-[20rem] lg:w-[24rem] pointer-events-none rounded-[1vh] file:w-1/2 block text-sm file:text-white/0 file:rounded-[1vh] file:bg-gray-300 file:hover:bg-gray-200 file:transition-all file:ease-in-out file:duration-300 file:border-none select-none file:cursor-pointer cursor-defualt file:text-gray-800 file:p-3 file:pointer-events-auto bg-gray-50 text-gray-600"
                                    type="file"
                                    onChange={(e: any) => setThirdPlaceTrophyImage(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Calendar
                                id="calendar-24h"
                                className="w-[20rem] lg:w-[24rem]"
                                panelStyle={{
                                    backgroundColor: "#f8f9fa",
                                    border: "1px",
                                    borderColor: "#554acf",
                                    borderRadius: "0.5rem",
                                    borderStyle: "solid",
                                }}
                                pt={{
                                    input: {
                                        root: { className: "hover:border-[#554acf]" },
                                    },
                                    dropdownButton: {
                                        root: { className: "bg-[#554acf] border-[#554acf]" },
                                    },
                                }}
                                value={dateTime}
                                onChange={(e) => formatDates(e.value)}
                                selectionMode="range"
                                showTime
                                showIcon
                                hourFormat="24"
                                readOnlyInput
                                ref={calendarRef}
                                footerTemplate={footerTemplate}
                                placeholder="Duration"
                            />
                        </div>
                        <div className="lg:w-[50rem]">
                            <div className="flex justify-center items-center">
                                <Button
                                    label={showProblems ? "Hide Problems" : "Show Problems"}
                                    className="bg-primary hover:bg-primarylight text-white font-semibold"
                                    type="button"
                                    onClick={handleAddProblemsClick}
                                />
                            </div>
                            {showProblems && (
                                <div className="grid grid-cols-2 my-4">
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
                                                    {problems.find((p: ProblemProps) => p.organiser_id === auth?.id) ? (
                                                        <div>
                                                            {problems
                                                                .filter((p: ProblemProps) => p.organiser_id === auth?.id)
                                                                .slice((currentPage - 1) * 10, currentPage * 10)
                                                                .map((problem: ProblemProps) => {
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
                                                                                    {formData.problems.includes(problem.id) ? (
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
                                                    {problems.find((p: ProblemProps) => p.organiser_id !== auth?.id) ? (
                                                        <div>
                                                            {problems
                                                                .filter((p: ProblemProps) => p.organiser_id !== auth?.id)
                                                                .slice((currentPage - 1) * 10, currentPage * 10)
                                                                .map((problem: ProblemProps) => {
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
                                                                                    {formData.problems.includes(problem.id) ? (
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
                            {formData.problems.length > 0 && (
                                <div className="bg-gray-300 rounded-lg border-secondary border-2 my-4">
                                    <div className="py-2 text-xl p-2 justify-center items-center flex bg-secondary text-white font-semibold">
                                        Selected Problems
                                    </div>
                                    {formData.problems.map((problemId: string) => {
                                        const problem = problems.find((p: ProblemProps) => p.id === problemId)
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
                            <div className="flex justify-between items-center mt-4 mb-8 px-2">
                                <Button
                                    label="Back"
                                    icon="pi pi-arrow-left"
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    type="button"
                                    onClick={navigateToHome}
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

type ProblemProps = {
    id: string
    name: string
    example_input: string
    example_output: string
    is_hidden: boolean
    num_of_points: number
    runtime_limit: number
    description: string
    organiser_id: string
    is_private: boolean
    created_on: string
}

type TextInputProps = {
    name: string
    value: string
    label: string
    onUpdate: (value: any) => void
}

const TextInput = ({ name, value, label, onUpdate }: TextInputProps) => {
    return (
        <div className="flex justify-center items-center">
            <span className="p-float-label">
                <InputText
                    name={name}
                    value={value}
                    onChange={(e) => onUpdate(e)}
                    className="w-[20rem] lg:w-[24rem] text-[2vh] rounded-[1vh]"
                />
                <label htmlFor="in">{label}</label>
            </span>
        </div>
    )
}

export default CreateCompetitionPage
