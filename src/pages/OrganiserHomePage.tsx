import { useState, useEffect, useCallback, useRef } from "react"
import { Navbar, CompetitionCard, ProblemList } from "../components"
import { Link } from "react-router-dom"
import { ProgressSpinner } from "primereact/progressspinner"
import { getAllCompetitionsForOrganiser } from "../services/competition.service"
import { getProblemsForOrganiser } from "../services/problem.service"
import { Competition, Problem } from "../Models"
import useAuth from "../hooks/useAuth"

const OrganiserHomePage = () => {
    const [loading, setLoading] = useState(true)
    const [problems, setProblems] = useState<Problem[]>([])
    const scrollCompetitionRef = useRef<HTMLDivElement>(null)
    const scrollProblemRef = useRef<HTMLDivElement>(null)
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const { auth } = useAuth()

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getProblemsForOrganiser(auth?.id)
            const problems: Problem[] = response.data
            setProblems(problems)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    const fetchCompetitions = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllCompetitionsForOrganiser(auth?.id)
            const competitions: Competition[] = response.data
            setCompetitions(
                competitions.sort((a, b) => {
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
                })
            )
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchProblems()
        fetchCompetitions()
    }, [])

    const handleScrollCompetition = (direction: number) => {
        if (scrollCompetitionRef.current) {
            scrollCompetitionRef.current.scrollLeft -= scrollCompetitionRef.current.clientWidth * direction
        }
    }

    const handleScrollProblem = (direction: number) => {
        if (scrollProblemRef.current) {
            scrollProblemRef.current.scrollLeft -= scrollProblemRef.current.clientWidth * direction
        }
    }

    return (
        <div className="bg-form bg-cover min-h-screen">
            {loading && (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            )}
            <Navbar />
            <div className="m-10 bg-graymedium px-8 py-16 rounded-xl">
                <div className="mb-5 flex flex-col md:flex-row max-md:gap-4 items-center md:justify-between justify-center">
                    <div className="flex gap-4 items-center">
                        <span className="text-xl md:text-3xl font-bold">Your competitions</span>
                        <Link
                            to="/organiser/create-competition"
                            className="max-md:order-2 duration-150 cursor-pointer"
                            replace={true}
                        >
                            <span
                                className="pi pi-plus-circle max-md:order-1 fill-primary hover:fill-primarylight hover:scale-105 duration-150 w-auto h-10 cursor-pointer"
                                style={{ color: "var(--primary-color)", fontSize: "2.5rem" }}
                            />
                        </Link>
                    </div>
                    <div className="flex gap-4 text-lg items-center max-md:justify-between max-md:w-full transition-colors">
                        <span
                            className="pi pi-arrow-circle-left max-md:order-1 fill-primary hover:fill-primarylight duration-150 w-auto h-7 cursor-pointer"
                            style={{
                                color: "var(--primary-color)",
                                fontSize: "2rem",
                            }}
                            onClick={() => handleScrollCompetition(1)}
                        />
                        <span
                            className="pi pi-arrow-circle-right max-md:order-1 fill-primary hover:fill-primarylight duration-150 w-auto h-7 cursor-pointer"
                            style={{
                                color: "var(--primary-color)",
                                fontSize: "2rem",
                            }}
                            onClick={() => handleScrollCompetition(-1)}
                        />
                    </div>
                </div>
                <div
                    ref={scrollCompetitionRef}
                    className="mb-10 scroll-smooth overflow-x-auto snap-x snap-mandatory grid grid-flow-col auto-cols-[100%] xl:auto-cols-[30%] gap-5 scrollbar-hide"
                >
                    {competitions.map((competition) => (
                        <CompetitionCard
                            key={competition.id}
                            competitionId={competition.id}
                            name={competition.name}
                            description={competition.description}
                            startTime={competition.start_time}
                            endTime={competition.end_time}
                            problemCount={competition.problems.length}
                            className="snap-start"
                        />
                    ))}
                </div>
                <div className="mb-5 flex flex-col md:flex-row max-md:gap-4 items-center md:justify-between justify-center">
                    <div className="flex gap-4 items-center">
                        <span className="text-xl md:text-3xl font-bold">Your problems</span>
                        <Link
                            to="/organiser/create-problem"
                            className="max-md:order-2 hover:text-secondary duration-150 cursor-pointer"
                            replace={true}
                        >
                            <span
                                className="pi pi-plus-circle max-md:order-1 fill-primary hover:fill-primarylight hover:scale-105 duration-150 w-auto h-10 cursor-pointer"
                                style={{ color: "var(--primary-color)", fontSize: "2.5rem" }}
                            />
                        </Link>
                    </div>
                    <div className="flex gap-4 text-lg items-center max-md:justify-between max-md:w-full transition-colors">
                        <span
                            className="pi pi-arrow-circle-left max-md:order-1 fill-primary hover:fill-primarylight duration-150 w-auto h-7 cursor-pointer"
                            style={{
                                color: "var(--primary-color)",
                                fontSize: "2rem",
                            }}
                            onClick={() => handleScrollProblem(1)}
                        />
                        <span
                            className="pi pi-arrow-circle-right max-md:order-1 fill-primary hover:fill-primarylight duration-150 w-auto h-7 cursor-pointer"
                            style={{
                                color: "var(--primary-color)",
                                fontSize: "2rem",
                            }}
                            onClick={() => handleScrollProblem(-1)}
                        />
                    </div>
                </div>
                <div
                    ref={scrollProblemRef}
                    className="mb-10 scroll-smooth overflow-x-auto snap-x snap-mandatory grid grid-flow-col auto-cols-[100%] xl:auto-cols-[30%] gap-5 scrollbar-hide"
                >
                    <ProblemList problems={problems} />
                </div>
            </div>
        </div>
    )
}

export default OrganiserHomePage
