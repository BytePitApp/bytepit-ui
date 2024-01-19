import { useParams, useNavigate } from "react-router-dom"
import { Navbar, ProblemSolver, ProfileLink, Timer } from "../components"
import { useState, useEffect, useCallback } from "react"
import { getCompetition } from "../services/competition.service"
import { Competition } from "../Models"
import { ProgressSpinner } from "primereact/progressspinner"
import CompetitionDashboard from "../components/CompetitionDashboard"

const ContestantViewCompetitionPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [competition, setCompetition] = useState<Competition>()
    const [submitCode, setSubmitCode] = useState<boolean>(false)
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const isCompetitionActive = () => {
        const start = new Date(competition?.start_time!!)
        const end = new Date(competition?.end_time!!)
        const now = new Date()
        return start < now && end > now
    }

    const getRemainingTime = () => {
        const start = new Date(competition?.start_time!!)
        const end = new Date(competition?.end_time!!)
        const now = new Date()
        if (start < now && end > now) {
            return Math.floor((end.valueOf() - now.valueOf()) / 1000)
        }
        return 0
    }

    const getCompetitionData = useCallback(async () => {
        if (id) {
            try {
                const competition = await getCompetition(id)
                setCompetition(competition.data)
                setLoading(false)
            } catch (err: any) {
                console.log(err)
                setError(err.response?.data?.detail ?? "Something went wrong")
            }
        }
    }, [id])

    useEffect(() => {
        getCompetitionData()
    }, [getCompetitionData])

    const timerEnded = () => {
        setSubmitCode(true)
    }

    return (
        <div className="flex flex-col h-screen justify-center">
            {loading ? (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            ) : null}
            <Navbar />
            <div className="bg-form bg-cover grow flex flex-row justify-center items-center">
                {error ? <div className="text-2xl">{error}</div> : null}
                {!error || !loading ? (
                    <div className="mx-[2%] rounded-xl px-[2%] bg-graymedium drop-shadow-xl rounded-t-xl border-graydark border-b-4">
                        <div className="flex flex-col gap-[3vh] py-4 h-[85vh] w-[90vw] overflow-auto scrollbar-hide items-center">
                            <div className="w-full flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:justify-between">
                                <div className="w-full flex flex-col gap-2 text-gray-700">
                                    <div className="text-left text-[3vh] font-semibold flex flex-col justify-center">
                                        <div className="flex gap-4">
                                            {competition?.name}
                                            {competition?.parent_id && (
                                                <div className="bg-primary w-[8vh] h-[4vh] rounded-3xl text-center text-white text-sm font-semibold flex justify-center items-center select-none">
                                                    Virtual
                                                </div>
                                            )}
                                        </div>
                                        {competition?.parent_id === null && (
                                            <div className="text-[2vh]">
                                                Created by: <ProfileLink username={competition?.organiser_username!} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left text-sm">{competition?.description}</div>
                                </div>
                                {!loading &&
                                    (isCompetitionActive() ? (
                                        <div className="flex items-end">
                                            <Timer seconds={getRemainingTime()} handleTimerEnd={timerEnded} />
                                        </div>
                                    ) : (
                                        <span className="text-xl font-semibold text-white-700">Finished</span>
                                    ))}
                            </div>
                            {competition &&
                                (isCompetitionActive() ? (
                                    <ProblemSolver
                                        problems={competition?.problems!!}
                                        competitionId={competition?.id}
                                        submitCode={submitCode}
                                    />
                                ) : (
                                    <CompetitionDashboard competition={competition}></CompetitionDashboard>
                                ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ContestantViewCompetitionPage
