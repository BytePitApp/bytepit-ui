import { useState, useEffect } from "react"
import { ProblemListItemProps, Problem } from "../Models"
import { Link } from "react-router-dom"

interface ProblemListProps {
    problems: Problem[]

}

const ProblemList: React.FC<ProblemListProps> = ({
    problems,
}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const summarizeDescription = (description: string): string => {
        if (windowWidth < 768) {
            if (description.length > 15) {
                return description.slice(0, 15) + "..."
            }
        } else {
            if (description.length > 650) {
                return description.slice(0, 200) + "..."
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
    <div className="w-3/4 mx-auto">
        {problems.map((problem) => {
            return (
                <Link to={`/organiser/problem/${problem.name}`} state={{problem : problem}}>
                    <div className={`border bg-graydark border-graydark m-2 rounded-lg py-2 px-4 grid grid-cols-4 gap-4 text-primary
                        hover:scale-[103%] hover:bg-primary hover:text-white transition-all ease-in-out duration-300`}>
                        <div className="flex flex-col col-span-1 border-r border-black">
                            <div className="flex items-center justify-center h-full text-center">
                                <span className="font-semibold text-2xl ">{problem.name}</span>
                            </div>
                        </div>
                        <div className="w-full break-words col-span-2 text-left">
                            <span className="text-lg mt-4 italic  text-opacity-80">
                                {summarizeDescription(problem.description)}
                            </span>
                        </div>
                        <div className="flex justify-center items-center col-span-1 border-l border-black">
                            <span className="text-lg font-bold ">{problem.num_of_points} points</span>
                        </div>
                    </div>
                </Link>
            )
        })}
    </div>
)
}

export default ProblemList