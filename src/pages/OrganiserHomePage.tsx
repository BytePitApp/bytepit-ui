import { useState, useEffect, useCallback, useRef } from "react"
import { Navbar, CompetitionCard, ProblemList } from "../components"
import { DataTable } from "primereact/datatable"
import { getOrganisersProblems } from "../services/organiser.service"
import { useParams, Link } from "react-router-dom"
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Column } from "primereact/column"
import { getCurrentUser } from "../services/users.service"
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import { getAllCompetitionsForOrganiser } from "../services/competition.service"
import { Competition, Problem } from "../Models"
import useAuth from "../hooks/useAuth"


const OrganiserHomePage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [problems, setProblems] = useState<any>([])
    const { auth } = useAuth()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [competitions, setCompetitions] = useState<Competition[]>([])


    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getOrganisersProblems(auth?.id) // Access the user's id
            const problems : Problem[] = response.data
            setProblems(problems)
            setLoading(false)
        } catch (err: any) {
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchCompetitions = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllCompetitionsForOrganiser(auth?.id)
            const competitions: Competition[] = response.data
            setCompetitions(competitions.sort((a, b) => {
                const now = new Date()
                const aStartTime = new Date(a.start_time)
                const aEndTime = new Date(a.end_time)
                const bStartTime = new Date(b.start_time)
                const bEndTime = new Date(b.end_time)
                if (aStartTime < now && now < aEndTime) {
                    return -1
                } else if (bStartTime < now && now < bEndTime) {
                    return 1
                } else if (now < aStartTime) {
                    return -1
                } else if (now < bStartTime) {
                    return 1
                } else if (aEndTime < now) {
                    return -1
                } else if (bEndTime < now) {
                    return 1
                } else {
                    return 0
                }
            }))
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchProblems()
    }, [])

    useEffect(() => {
        fetchCompetitions()
    }, [])

    const handleScroll = (direction: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= scrollContainerRef.current.clientWidth * direction
        }
    }

    return (
        <>
            <div className="bg-form bg-cover min-h-screen">
                <div className="bg-form bg-cover h-screen">
                    {loading && (
                        <div className="z-50 absolute top-1.5 left-[50%]">
                            <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                        </div>
                    )}
                    <Navbar />
                    <div className="grow m-[5%]">
                        <div className="mb-5 flex flex-col md:flex-row max-md:gap-4 items-center md:justify-between justify-center">
                            <span className="text-xl md:text-3xl font-bold">Recent competitions</span>
                            <div className="flex gap-4 text-lg items-center max-md:justify-between max-md:w-full transition-colors">
                                <Link to="/organiser/create-competition" className="max-md:order-2 hover:text-secondary duration-150 cursor-pointer" replace={true}>New competition</Link>
                                <FaArrowCircleLeft onClick={() => handleScroll(1)} className="max-md:order-1 fill-secondarydark hover:fill-secondary duration-150 w-auto h-7 cursor-pointer" />
                                <FaArrowCircleRight onClick={() => handleScroll(-1)} className="max-md:order-3 fill-secondarydark hover:fill-secondary duration-150 w-auto h-7 cursor-pointer" />
                            </div>
                        </div>
                        <div ref={scrollContainerRef} className="scroll-smooth overflow-x-auto snap-x snap-mandatory grid grid-flow-col auto-cols-[100%] xl:auto-cols-[30%] gap-5 scrollbar-hide">
                            {competitions.map(competition => (
                                <CompetitionCard
                                    key={competition.id}
                                    competitionId={competition.id}
                                    name={competition.name}
                                    description={competition.description}
                                    startTime={competition.start_time}
                                    endTime={competition.end_time}
                                    problemCount={competition.problems.length}
                                    trophyCount={competition.trophies?.length || 0}
                                    className="snap-start"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="grow m-[5%]">
                        <div className="flex flex-col md:flex-row max-md:gap-4 items-center md:justify-between justify-center">
                            <span className="text-xl md:text-3xl font-bold text-primary">Your Problems</span>
                            <div className="flex gap-4 text-lg items-center max-md:justify-between max-md:w-full transition-colors">
                                <Link to="/organiser/create-problem" className="text-primary max-md:order-2 hover:text-secondary duration-150 cursor-pointer font-bold" replace={true}>New Problem</Link>
                                <FaArrowCircleLeft onClick={() => handleScroll(1)} className="max-md:order-1 fill-secondarydark hover:fill-secondary duration-150 w-auto h-7 cursor-pointer" />
                                <FaArrowCircleRight onClick={() => handleScroll(-1)} className="max-md:order-3 fill-secondarydark hover:fill-secondary duration-150 w-auto h-7 cursor-pointer" />
                            </div>
                        </div>
                        <div ref={scrollContainerRef} className="scroll-smooth overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                            <div className="my-5">
                                <ProblemList problems={problems} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default OrganiserHomePage
