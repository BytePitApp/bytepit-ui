import { useState, useRef, FormEvent, useCallback, useEffect } from "react"
import { Navbar, ProblemListItem, ProblemPicker } from "../components"
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

const EditCompetitionPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [dateTime, setDateTime] = useState<Nullable<(Date | null)[]>>(null)
    const [showProblems, setShowProblems] = useState(false)
    const [problems, setProblems] = useState<Problem[]>([])
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

    const handleValueChange = (e: any) => {
        const { name, value } = e.target
        setFormDataModified({
            ...formDataModified,
            [name]: value,
        })
    }

    const fetchProblems = useCallback(async () => {
        try {
            const response = await getAllProblems()
            setProblems(response.data)
        } catch (err: any) {
            console.log(err)
        }
    }, [])

    const fetchCompetition = useCallback(async (competitionId: string) => {
        try {
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
        } catch (err: any) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        if (id) {
            fetchCompetition(id)
        }
        fetchProblems()
        setLoading(false)
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
        return `${date[2]}-${date[0].padStart(2, "0")}-${date[1].padStart(2, "0")} ${time[0]}:${time[1]}:00`
    }

    const submitForm = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (formDataModified.startTime === "" || formDataModified.endTime === ""
                || formDataModified.name === "" || formDataModified.description === ""
                || formDataModified.problems.length === 0) {
                sendToast({
                    severity: "error",
                    summary: "Error!",
                    detail: "Please fill in all the required fields!",
                })
                setLoading(false)
                return
            }
            await modifyCompetition(id!, formDataModified, formData)
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
        navigate("/organiser/home")
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
                        <div className="m-[5%] flex flex-col gap-2 pt-20">                        
                            <span className="text-[4vh] text-center font-semibold text-primary">Modify Competition</span>
                            <span className="text-[2vh] text-center text-slate-950 mb-0">
                                Please fill in the form fields that you wish to change.
                            </span>
                        </div>
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
                        <div className="lg:w-[50rem]">
                            <div className="flex justify-center">
                                <Button
                                    label={showProblems ? "Hide Problems" : "Show Problems"}
                                    className="bg-primary hover:bg-primarylight text-white font-semibold w-fit"
                                    type="button"
                                    onClick={() => setShowProblems(!showProblems)}
                                />
                            </div>
                            {showProblems && (
                                <ProblemPicker
                                    problems={problems}
                                    addProblem={addProblem}
                                    removeProblem={removeProblem}
                                    selectedProblems={formDataModified.problems}
                                />
                            )}
                            {(formDataModified.problems.length > 0 && problems.length > 0) ? (
                                <div className="bg-secondarylight rounded-lg border-secondarylight border-2 my-4">
                                    <div className="py-2 text-xl p-2 justify-center items-center flex bg-secondarylight text-white font-semibold">
                                        Selected Problems
                                    </div>
                                    {formDataModified.problems.map((problemId: string) => {
                                        const problem = problems.find((p: Problem) => p.id === problemId)
                                        return (
                                            <ProblemListItem
                                                key={problemId}
                                                problem={problem!!}
                                                selectedProblems={formDataModified.problems}
                                                addProblem={addProblem}
                                                removeProblem={removeProblem}
                                            />
                                        )
                                    })}
                                </div>
                            ) : null}
                            <div className="flex justify-between items-center w-full px-2">
                                <Button
                                    label="Back"
                                    icon="pi pi-arrow-left"
                                    className="hover:scale-[102%] transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    type="button"
                                    onClick={() => navigate("/organiser/home")}
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
