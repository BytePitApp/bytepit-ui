import { useState } from "react"
import { ProblemPickerProps, Problem } from "../Models"
import { ProblemListItem } from "./"
import useAuth from "../hooks/useAuth"

const ProblemPicker: React.FC<ProblemPickerProps> = ({ problems, selectedProblems, addProblem, removeProblem }) => {
    const [showOption, setShowOption] = useState("your")
    const [currentPage, setCurrentPage] = useState(1)
    const { auth } = useAuth()

    const setProblemsToShow = (option: string) => {
        setShowOption(option)
        setCurrentPage(1)
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

    return (
        <div className="grid grid-cols-2 my-4">
            <div
                className={`${
                    showOption === "your" ? "bg-primarylight" : "bg-secondarylight hover:bg-secondarydark cursor-pointer"
                } flex justify-center items-center text-white px-2 py-4 rounded-tl-lg font-semibold text-lg`}
                onClick={() => setProblemsToShow("your")}>
                Your Problems
            </div>
            <div
                className={`${
                    showOption === "other" ? "bg-primarylight" : " bg-secondarylight hover:bg-secondarydark cursor-pointer"
                } flex justify-center items-center text-white px-2 py-4 rounded-tr-lg font-semibold text-lg`}
                onClick={() => setProblemsToShow("other")}>
                Other Problems
            </div>
            <div className="col-span-2 border-b-2 border-x-2 border-secondarylight bg-secondarylight rounded-b-lg">
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
                                                <ProblemListItem
                                                    key={problem.id}
                                                    problem={problem}
                                                    selectedProblems={selectedProblems}
                                                    removeProblem={removeProblem}
                                                    addProblem={addProblem}
                                                />
                                            )
                                        })}
                                    <ProblemPickerFooter
                                        currentPage={currentPage}
                                        incrementPage={incrementPage}
                                        decrementPage={decrementPage}
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center">No problems found</div>
                            )}
                        </>
                    ) : (
                        <>
                            {problems.find((p: Problem) => p.organiser_id !== auth?.id) ? (
                                <>
                                    {problems
                                        .filter((p: Problem) => p.organiser_id !== auth?.id)
                                        .slice((currentPage - 1) * 10, currentPage * 10)
                                        .map((problem: Problem) => {
                                            return (
                                                <ProblemListItem
                                                    key={problem.id}
                                                    problem={problem}
                                                    selectedProblems={selectedProblems}
                                                    removeProblem={removeProblem}
                                                    addProblem={addProblem}
                                                />
                                            )
                                        })}
                                    <ProblemPickerFooter
                                        currentPage={currentPage}
                                        incrementPage={incrementPage}
                                        decrementPage={decrementPage}
                                    />
                                </>
                            ) : (
                                <div className="flex justify-center items-center">No problems found</div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

interface ProblemPickerFooterProps {
    currentPage: number
    incrementPage: () => void
    decrementPage: () => void
}

const ProblemPickerFooter: React.FC<ProblemPickerFooterProps> = ({ currentPage, incrementPage, decrementPage }) => {
    return (
        <div className="flex p-2 justify-center items-center gap-8">
            <div
                className="pi pi-chevron-left text-xl bg-primarylight text-white p-2 rounded-3xl cursor-pointer"
                onClick={decrementPage}></div>
            <div className="text-2xl w-14 text-white font-semibold flex justify-center items-center select-none">{currentPage}</div>
            <div
                className="pi pi-chevron-right text-xl bg-primarylight text-white p-2 rounded-3xl cursor-pointer"
                onClick={incrementPage}></div>
        </div>
    )
}

export default ProblemPicker
