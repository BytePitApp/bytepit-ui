import { Problem } from "../Models"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

interface ProblemProps {
    problem: Problem
}

const ProblemBox: React.FC<ProblemProps> = ({ problem }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const summarizeDescription = (description: string): string => {
        if (windowWidth < 768) {
            if (description.length > 15) {
                return description.slice(0, 15) + "..."
            }
        } else {
            if (description.length > 250) {
                return description.slice(0, 250) + "..."
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
        <Link
            className={`transition-bg border border-gray-300 rounded-lg shadow-lg overflow-hidden relative flex flex-col group bg-white`}
            to={`/organiser/view-problem`}
            state={{ problem: problem }}
        >
            <div className={`p-4 bg-gray-200 transition-bg`}>
                <h2 className={`font-bold text-xl text-primary`}>{problem.name}</h2>
                <p className={`text-primary`}>
                    {problem.num_of_points} point{`${problem.num_of_points > 1 ? "s" : ""}`}
                </p>
            </div>
            <div className={`p-4 flex-grow overflow-auto transition-bg h-[16vh]`}>
                <p>{summarizeDescription(problem.description)}</p>
            </div>
        </Link>
    )
}

export default ProblemBox
