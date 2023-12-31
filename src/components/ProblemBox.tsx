import React from 'react'
import { Problem } from '../Models'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface ProblemProps {
  problem: Problem;
}

const ProblemBox: React.FC<ProblemProps> = ({
    problem,
}) => {
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
        <div className="border bg-white border-gray-300 mx-2 mx-auto rounded-lg shadow-lg overflow-hidden flex flex-col h-[330px] w-[500px]">
            <div className="p-4 bg-gray-200">
                <h2 className="font-bold text-xl text-primary">{problem.name}</h2>
                <p className="text-gray-600">{problem.num_of_points} points</p>
            </div>
            <div className="p-4 flex-grow overflow-auto">
                <h3 className="font-bold mb-2 text-primary">Description</h3>
                <p className="text-gray-700">{summarizeDescription(problem.description)}</p>
            </div>
            <div className="p-4 bg-gray-100 flex justify-between items-center">
                <Link to={`/organiser/view-problem`} state={{problem : problem}} className="text-primary hover:text-black transition-colors duration-200">
                    View problem
                </Link>
                <Link to={`/organiser/edit-problem`} state={{problem : problem}} className="text-primary hover:text-black transition-colors duration-200">
                    Edit problem
                </Link>
            </div>
        </div>
    )
}


export default ProblemBox