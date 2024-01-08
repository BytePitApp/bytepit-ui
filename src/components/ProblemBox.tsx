import React from 'react'
import { Problem } from '../Models'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface ProblemProps {
    problem: Problem
}

const ProblemBox: React.FC<ProblemProps> = ({problem}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [isHovered, setIsHovered] = useState(false)

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
        <div 
            className={`transition-bg border border-gray-300 mx-2 rounded-lg shadow-lg overflow-hidden flex flex-col h-[330px] w-[500px] ${isHovered ? 'bg-secondary' : 'bg-white'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className={`p-4 ${isHovered ? 'bg-secondary text-white border-b transition-bg' : 'bg-gray-200 transition-bg'}`}>
                <h2 className={`font-bold text-xl ${isHovered ? 'text-black transition-bg' : 'text-primary'}`}>{problem.name}</h2>
                <p className={`${isHovered ? 'text-black' : 'text-primary'}`}>{problem.num_of_points} points</p>
            </div>
            <div className={`p-4 flex-grow overflow-auto ${isHovered ? 'bg-secondary text-white transition-bg' : 'transition-bg'}`}>
                <h3 className={`mb-2 font-bold ${isHovered ? 'text-black' : 'text-primary'}`}>Description</h3>
                <p>{summarizeDescription(problem.description)}</p>
            </div>
            <div className={`p-4 flex justify-between items-center ${isHovered ? 'bg-secondary text-white border-t transition-bg' : 'bg-gray-100 transition-bg'}`}>
                <Link to={`/organiser/view-problem`} state={{problem : problem}} className={`${isHovered ? 'text-black' : 'text-primary'} hover:text-black transition-colors duration-200`}>
                    View problem
                </Link>
                <Link to={`/organiser/edit-problem/${problem.id}`} state={{problem : problem}} className={`${isHovered ? 'text-black' : 'text-primary'} hover:text-black transition-colors duration-200`}>
                    Edit problem
                </Link>
            </div>
        </div>
    )
}

export default ProblemBox
