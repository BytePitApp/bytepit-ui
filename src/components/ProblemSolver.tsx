import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createSubmission } from "../services/problem.service"
import { Problem, ProblemSolverProps, CodeEditorLanguages, CreateSubmission, SubmissionResult } from "../Models"
import { CodeEditor } from "./"
import useAuth from "../hooks/useAuth"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toast } from "primereact/toast"
import { Dialog } from "primereact/dialog"

const ProblemSolver: React.FC<ProblemSolverProps> = ({ problems, competitionId, submitCode }) => {
    const [loading, setLoading] = useState(false)
    const [selectedProblem, setSelectedProblem] = useState<Problem | undefined>(undefined)
    const [problemAnswers, setProblemAnswers] = useState<{
        [key: string]: {
            code: string
            language: CodeEditorLanguages | null
        }
    }>({})
    const [submissionResults, setSubmissionResults] = useState<{
        [key: string]: SubmissionResult | undefined
    }>({})
    const [modalVisible, setModalVisible] = useState(false)
    const { auth } = useAuth()
    const toast = useRef<Toast>(null)
    const navigate = useNavigate()

    const selectProblem = (problem: Problem) => {
        setSelectedProblem(problem)
    }

    const toggleModal = () => {
        setModalVisible((prev) => !prev)
    }

    const formatRuntimeLimit = (runtimeLimit: number | undefined): string => {
        if (!runtimeLimit) {
            return "N/A"
        }
        return `${runtimeLimit * 1000} ms`
    }

    const handleAnswerChange = (code: string | undefined, language: CodeEditorLanguages | null) => {
        if (selectedProblem && code) {
            setProblemAnswers((prev) => {
                return {
                    ...prev,
                    [selectedProblem.id]: {
                        code,
                        language,
                    },
                }
            })
        }
    }

    const formatException = (exception: string): string => {
        if (exception.includes("\n")) {
            return exception.replaceAll("\n", "<br/>")
        }
        return exception
    }

    const init = useCallback(() => {
        if (problems) {
            setSelectedProblem(problems[0])
            const initialProblemAnswers: {
                [key: string]: {
                    code: string
                    language: CodeEditorLanguages | null
                }
            } = {}
            problems.forEach((problem) => {
                initialProblemAnswers[problem.id] = {
                    code: "",
                    language: null,
                }
            })
            if (auth && competitionId) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key?.startsWith(`${auth.id}/${competitionId}`)) {
                        const value = localStorage.getItem(key)
                        if (value && initialProblemAnswers[key.split("/")[2]]) {
                            initialProblemAnswers[key.split("/")[2]] = JSON.parse(value)
                        }
                    }
                }
            }
            setProblemAnswers(initialProblemAnswers)
            const initialSubmissionResults: {
                [key: string]: SubmissionResult | undefined
            } = {}
            problems.forEach((problem) => {
                initialSubmissionResults[problem.id] = undefined
            })
            setSubmissionResults(initialSubmissionResults)
        }
    }, [problems])

    const save = () => {
        if (selectedProblem && problemAnswers[selectedProblem.id] && auth && competitionId) {
            const value = {
                code: problemAnswers[selectedProblem.id].code,
                language: problemAnswers[selectedProblem.id].language,
            }
            localStorage.setItem(`${auth.id}/${competitionId}/${selectedProblem.id}`, JSON.stringify(value))
            toast.current?.show({
                severity: "info",
                summary: "Saved",
                detail: "Your answer has been saved",
                life: 2000,
            })
        }
    }

    const run = async () => {
        if (
            selectedProblem &&
            problemAnswers[selectedProblem.id] &&
            problemAnswers[selectedProblem.id].language != null
        ) {
            setLoading(true)
            try {
                const submission: CreateSubmission = {
                    problemId: selectedProblem.id,
                    language: problemAnswers[selectedProblem.id].language!,
                    sourceCode: problemAnswers[selectedProblem.id].code,
                    competitionId: competitionId,
                }
                const result = await createSubmission(submission)
                const incorectOutputs = result.data.incorrect_outputs.map((output: any) => {
                    return {
                        expectedOutput: output.expected_output,
                        output: output.output,
                    }
                })
                const submissionResult: SubmissionResult = {
                    isCorrect: result.data.is_correct,
                    isRuntimeOk: result.data.is_runtime_ok,
                    hasImproved: result.data.has_improved,
                    incorrectOutputs: incorectOutputs,
                    exception: result.data.exception,
                    points: result.data.points,
                }
                setSubmissionResults((prev) => {
                    return {
                        ...prev,
                        [selectedProblem.id]: submissionResult,
                    }
                })
            } catch (err: any) {
                const submissionResult: SubmissionResult = {
                    isCorrect: false,
                    isRuntimeOk: false,
                    hasImproved: false,
                    incorrectOutputs: [],
                    exception: formatException(err.response?.data?.detail ?? "Something went wrong"),
                    points: 0,
                }
                setSubmissionResults((prev) => {
                    return {
                        ...prev,
                        [selectedProblem.id]: submissionResult,
                    }
                })
            }
            setLoading(false)
        } else if (selectedProblem && problemAnswers[selectedProblem.id].language == null) {
            toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: "Please select a language",
                life: 3000,
            })
        }
    }

    const sendSubmissions = async () => {
        for (const problem of problems) {
            if (problemAnswers[problem.id].code.trim() === "" || problemAnswers[problem.id].language == null) {
                continue
            }
            const submission: CreateSubmission = {
                problemId: problem.id,
                language: problemAnswers[problem.id].language!,
                sourceCode: problemAnswers[problem.id].code,
                competitionId: competitionId,
            }
            try {
                await createSubmission(submission)
            } catch (err: any) {}
        }
        if (competitionId) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key?.startsWith(`${auth?.id}/${competitionId}`)) {
                    localStorage.removeItem(key)
                }
            }
        }
        navigate("/contestant/home")
    }

    const submit = async () => {
        for (const problem of problems) {
            if (problemAnswers[problem.id].code.trim() !== "" && problemAnswers[problem.id].language == null) {
                toast.current?.show({
                    severity: "warn",
                    summary: "Warning",
                    detail: "Please select a language",
                    life: 3000,
                })
                return
            }
        }
        setLoading(true)
        await sendSubmissions()
        toggleModal()
    }

    useEffect(() => {
        if (submitCode) {
            const sendAllSubmissions = async () => {
                await sendSubmissions()
            }
            sendAllSubmissions()
        }
    }, [submitCode])

    useEffect(() => {
        init()
    }, [init])

    const headerTemplate = () => {
        return <div className="text-3xl font-bold">Are you sure?</div>
    }

    const footerTemplate = () => {
        return (
            <div className="flex justify-between">
                <Button
                    type="button"
                    label="Cancel"
                    className="hover:scale-[102%] w-full lg:w-32 transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                    onClick={toggleModal}
                />
                <Button
                    type="button"
                    label="Submit"
                    className="hover:scale-[102%] w-full lg:w-32 transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                    onClick={submit}
                />
            </div>
        )
    }

    return (
        <>
            <div className="flex absolute right-0 py-10 px-6 z-30">
                <Toast ref={toast} />
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 lg:max-w-[50%]">
                {problems?.map((problem, index) => (
                    <div
                        key={problem.id}
                        onClick={() => selectProblem(problem)}
                        className={`text-[1.2rem] w-10 h-10 flex justify-center items-center border-2 rounded-lg select-none text-graymedium ${
                            selectedProblem?.id === problem.id
                                ? "bg-secondarylight border-secondarylight"
                                : "cursor-pointer bg-gray-600 border-gray-600 hover:bg-gray-600/90 hover:border-gray-600/0"
                        }`}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
            <div className="lg:flex w-full h-[90%] rounded-2xl scrollbar-hide px-6 py-4 bg-gray-300/90">
                <div className="lg:w-1/3 text-gray-700 overflow-y-auto scrollbar-hide">
                    <div className="flex overflow-x-auto scrollbar-hide flex-col gap-8">
                        <div className="text-left w-full flex flex-col gap-2">
                            <div className="text-[3vh] font-semibold">{selectedProblem?.name}</div>
                            <div className="text-sm">{selectedProblem?.description}</div>
                        </div>
                        <div className="text-[1rem]">
                            <span className="font-semibold mr-2">Example Input:</span>
                            <span className="text-[0.9rem]">{selectedProblem?.example_input}</span>
                        </div>
                        <div className="text-[1rem]">
                            <span className="font-semibold mr-2">Example Output:</span>
                            <span className="text-[0.9rem]">{selectedProblem?.example_output}</span>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-0">
                            <div className="text-[1rem]">
                                <span className="font-semibold mr-2">Runtime Limit:</span>
                                <span className="text-[0.9rem]">
                                    {formatRuntimeLimit(selectedProblem?.runtime_limit)}
                                </span>
                            </div>
                            <div className="text-[1rem]">
                                <span className="font-semibold mr-2">Available Points:</span>
                                <span className="text-[0.9rem]">{selectedProblem?.num_of_points}</span>
                            </div>
                        </div>
                        <div
                            className={`flex ${
                                competitionId ? "justify-between gap-2 lg:gap-0" : "justify-end"
                            } lg:m-2 items-center`}
                        >
                            {competitionId ? (
                                <Button
                                    type="button"
                                    label="SAVE"
                                    className="hover:scale-[102%] w-full lg:w-32 transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                    onClick={() => save()}
                                />
                            ) : null}
                            <Button
                                type="button"
                                label="SUBMIT"
                                className="hover:scale-[102%] w-full lg:w-32 transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                                onClick={toggleModal}
                            />
                            <Dialog
                                visible={modalVisible}
                                modal
                                style={{ width: "50rem" }}
                                onHide={toggleModal}
                                draggable={false}
                                header={headerTemplate}
                                footer={footerTemplate}
                            >
                                <span className="m-0">
                                    By clicking submit, all of your answers will be submitted and you will be redirected
                                    to the home page.
                                </span>
                                <span className="m-0 font-semibold">
                                    {" "}
                                    Note that you will be able to change your answers until the deadline, but answers
                                    will not be saved.
                                </span>
                            </Dialog>
                        </div>
                        {selectedProblem && submissionResults[selectedProblem.id] ? (
                            submissionResults[selectedProblem.id]?.isCorrect ? (
                                submissionResults[selectedProblem.id]?.isRuntimeOk ? (
                                    submissionResults[selectedProblem.id]?.hasImproved ? (
                                        <div className="text-gray-700 mt-10">
                                            <div className="text-[3vh] font-semibold flex justify-between items-center border-b border-gray-400">
                                                <div>Great job!</div>
                                                <p className="pi pi-check-circle text-[2rem] text-green-600"></p>
                                            </div>
                                            <div className="text-sm mt-2">It is correct and your best attempt!</div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-700 mt-10">
                                            <div className="text-[3vh] font-semibold flex justify-between items-center border-b border-gray-400">
                                                <div>Great job!</div>
                                                <p className="pi pi-check-circle text-[2rem] text-green-600"></p>
                                            </div>
                                            <div className="text-sm mt-2">
                                                <span>It is correct but not your best attempt.</span>
                                                <span className="font-semibold">
                                                    {" "}
                                                    Note that only the best attempt will be evaluated!
                                                </span>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-gray-700 mt-10">
                                        <div className="text-[3vh] font-semibold flex justify-between items-center border-b border-gray-400">
                                            <div>Not good enough!</div>
                                            <p className="pi pi-ban text-[2rem] text-red-600"></p>
                                        </div>
                                        <div className="text-sm mt-2">
                                            It is correct but it exceeds the runtime limit!
                                        </div>
                                    </div>
                                )
                            ) : submissionResults[selectedProblem.id]?.exception ? (
                                <div className="text-gray-700 mt-10">
                                    <div className="text-[3vh] font-semibold flex justify-between items-center border-b border-gray-400">
                                        <div>Wrong answer!</div>
                                        <p className="pi pi-ban text-[2rem] text-red-600"></p>
                                    </div>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: formatException(
                                                submissionResults[selectedProblem.id]?.exception ??
                                                    "Something went wrong!"
                                            ),
                                        }}
                                        className="text-sm mt-2 mr-2"
                                    />
                                </div>
                            ) : submissionResults[selectedProblem.id]?.incorrectOutputs &&
                              submissionResults[selectedProblem.id]?.incorrectOutputs?.length! > 0 ? (
                                <div className="text-gray-700 mt-10">
                                    <div className="text-[3vh] font-semibold flex justify-between items-center border-b border-gray-400">
                                        <div>Wrong answer!</div>
                                        <p className="pi pi-ban text-[2rem] text-red-600"></p>
                                    </div>
                                    <div className="flex mt-2 flex-col gap-y-2">
                                        {submissionResults[selectedProblem.id]?.incorrectOutputs?.map(
                                            (output, index) => (
                                                <div
                                                    key={index}
                                                    className="border-2 border-graymedium bg-graymedium rounded-lg p-2 flex flex-row"
                                                >
                                                    <div className="lg:text-[1.5rem] w-20 flex justify-start items-end">
                                                        <span className="border-b-2 border-gray-700">Test</span>
                                                    </div>
                                                    <div className="w-full flex flex-row">
                                                        <div className="h-full w-[1px] bg-gray-700 mx-1"></div>
                                                        <div className="flex h-full w-1/2 flex-col">
                                                            <div className="font-semibold leading-4 text-[0.7rem] lg:text-[1rem]">
                                                                Expected output
                                                            </div>
                                                            <div className="mx-1 h-full leading-4 text-[0.8rem] lg:text-[1rem] flex justify-start items-center overflow-x-auto">
                                                                {output.expectedOutput}
                                                            </div>
                                                        </div>
                                                        <div className="h-full w-[1px] bg-gray-700 mx-1"></div>
                                                        <div className="flex h-full w-1/2 flex-col">
                                                            <div className="font-semibold leading-4 text-[0.7rem] lg:text-[1rem]">
                                                                Your output
                                                            </div>
                                                            <div className="mx-1 h-full leading-4 text-[0.8rem] lg:text-[1rem] flex justify-start items-center overflow-x-auto">
                                                                {output.output}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-700 mt-10">
                                    <div className="text-[3vh] font-semibold flex justify-between items-center border-b border-gray-400">
                                        <div>Wrong answer!</div>
                                        <p className="pi pi-ban text-[2rem] text-red-600"></p>
                                    </div>
                                    <div className="text-sm mt-2">Your answer is wrong!</div>
                                </div>
                            )
                        ) : null}
                    </div>
                </div>
                <div className="lg:w-2/3 relative">
                    {loading ? (
                        <div className="absolute flex justify-center items-center z-50 h-full w-full">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="7" />
                        </div>
                    ) : null}
                    <CodeEditor
                        currentAnswer={
                            selectedProblem && problemAnswers[selectedProblem.id]
                                ? problemAnswers[selectedProblem.id].code
                                : ""
                        }
                        currentLanguage={
                            selectedProblem && problemAnswers[selectedProblem.id]
                                ? problemAnswers[selectedProblem.id].language
                                : null
                        }
                        onAnswerChange={handleAnswerChange}
                        run={run}
                    />
                </div>
            </div>
        </>
    )
}

export default ProblemSolver
