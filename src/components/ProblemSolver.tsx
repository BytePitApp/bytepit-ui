import { useState, useEffect, useCallback } from "react"
import { Problem, ProblemSolverProps, CodeEditorLanguages } from "../Models"
import { CodeEditor } from "./"
import { Button } from "primereact/button"

const ProblemSolver: React.FC<ProblemSolverProps> = ({ problems }) => {
    const [selectedProblem, setSelectedProblem] = useState<Problem | undefined>(undefined)
    const [problemAnswers, setProblemAnswers] = useState<{
        [key: string]: {
            code: string
            language: string | null
        }
    }>({})

    const selectProblem = (problem: Problem) => {
        setSelectedProblem(problem)
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

    const setInitialProblem = useCallback(() => {
        if (problems) {
            setSelectedProblem(problems[0])
            const initialProblemAnswers: {
                [key: string]: {
                    code: string
                    language: string | null
                }
            } = {}
            problems.forEach((problem) => {
                initialProblemAnswers[problem.id] = {
                    code: "",
                    language: null,
                }
            })
            setProblemAnswers(initialProblemAnswers)
        }
    }, [problems])

    useEffect(() => {
        setInitialProblem()
    }, [setInitialProblem])

    return (
        <>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 max-w-[50%]">
                {problems?.map((problem, index) => (
                    <div
                        key={problem.id}
                        onClick={() => selectProblem(problem)}
                        className={`text-[1.2rem] w-10 h-10 flex justify-center items-center border-2 rounded-lg select-none text-graymedium ${
                            selectedProblem?.id === problem.id
                                ? "bg-secondarylight border-secondarylight"
                                : "cursor-pointer bg-gray-600 border-gray-600 hover:bg-gray-600/90 hover:border-gray-600/0"
                        }`}>
                        {index + 1}
                    </div>
                ))}
            </div>
            <div className="flex w-full h-full rounded-2xl overflow-y-auto scrollbar-hide px-6 py-4 bg-gray-300/90">
                <div className="w-1/3 text-gray-700 overflow-y-auto scrollbar-hide">
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
                        <div className="flex justify-between items-center">
                            <div className="text-[1rem]">
                                <span className="font-semibold mr-2">Runetime Limit:</span>
                                <span className="text-[0.9rem]">{formatRuntimeLimit(selectedProblem?.runtime_limit)}</span>
                            </div>
                            <div className="text-[1rem]">
                                <span className="font-semibold mr-2">Available Points:</span>
                                <span className="text-[0.9rem]">{selectedProblem?.num_of_points}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button
                                type="button"
                                label="SAVE"
                                className="hover:scale-[102%] w-full lg:w-32 transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                            />
                            <Button
                                type="button"
                                label="RUN"
                                className="hover:scale-[102%] w-full lg:w-32 transition-all ease-in-out duration-300 bg-primary hover:bg-primarylight"
                            />
                        </div>
                        {/* result will be here */}
                    </div>
                </div>
                <div className="w-2/3">
                    <CodeEditor
                        currentAnswer={selectedProblem && problemAnswers[selectedProblem.id] ? problemAnswers[selectedProblem.id].code : ""}
                        currentLanguage={null}
                        onAnswerChange={handleAnswerChange}
                    />
                </div>
            </div>
        </>
    )
}

export default ProblemSolver
