import { useState, useEffect } from "react"
import { ProblemListItemProps } from "../Models"

const ProblemListItem: React.FC<ProblemListItemProps> = ({
    problem,
    selectedProblems,
    removeProblem,
    addProblem,
}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const summarizeDescription = (description: string): string => {
        if (windowWidth < 768) {
            if (description.length > 15) {
                return description.slice(0, 15) + "..."
            }
        } else {
            if (description.length > 65) {
                return description.slice(0, 65) + "..."
            }
        }
        return description
    }

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div
            className={`border ${
                selectedProblems.includes(problem.id)
                    ? "bg-primarylight border-primarylight text-white"
                    : "bg-graydark border-graydark text-gray-800"
            }  m-2 rounded-lg py-2 px-4`}>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span className="font-semibold">{problem.name}</span>
                    <span className="text-xs">
                        {summarizeDescription(problem.description)}
                    </span>
                </div>
                <div className="flex justify-center items-center gap-4">
                    <span className="text-sm">{problem.num_of_points} points</span>
                    {selectedProblems.includes(problem.id) ? (
                        <div
                            className="bg-graydark pi pi-times text-primarylight text-lg p-1 rounded-2xl cursor-pointer"
                            onClick={() => removeProblem(problem.id)}></div>
                    ) : (
                        <div
                            className="bg-primarylight pi pi-plus text-white text-lg p-1 rounded-2xl cursor-pointer"
                            onClick={() => addProblem(problem.id)}></div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProblemListItem