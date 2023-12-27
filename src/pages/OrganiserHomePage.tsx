import { useEffect, useState, useCallback, useRef } from "react"
import { getAllCompetitions } from "../services/competition.service"
import { CompetitionCard, Navbar } from "../components"
import { Competition } from "../Models"
import { ProgressSpinner } from "primereact/progressspinner"
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import "./Organiser.css"
import { Link } from "react-router-dom"

const OrganiserHomePage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    
    const fetchCompetitions = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getAllCompetitions()
            const competitions: Competition[] = response.data
            // Sort competitions, first ones that are active (start_time < now < end_time), then ones that are upcoming (now < start_time), then ones that are finished (end_time < now)
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
            setError(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])
    
    const handleScroll = (direction: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= scrollContainerRef.current.clientWidth * direction
        }
    }

    useEffect(() => {
        fetchCompetitions()
    }, [])

    return (
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
        </div>
    )
}

export default OrganiserHomePage
