import { useParams } from "react-router-dom"
import { Navbar, ProblemSolver, Timer } from "../components"
import { useState, useEffect, useCallback } from "react"
import { getCompetition } from "../services/competition.service"
import { Competition } from "../Models"
import { ProgressSpinner } from "primereact/progressspinner"

const ContestantViewCompetitionPage = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [competition, setCompetition] = useState<Competition | undefined>(undefined)
    const [remainingTime, setRemainingTime] = useState<number | undefined>(undefined)
    const [submitCode, setSubmitCode] = useState<boolean>(false)
    const { id } = useParams<{ id: string }>()

    const updateRemainingTime = (startTime: string, endTime: string) => {
        const start = new Date(startTime)
        const end = new Date(endTime)
        const now = new Date()
        if (start < now && end > now) {
            setRemainingTime(Math.floor((end.valueOf() - now.valueOf()) / 1000))
        }
    }

    const getCompetitionData = useCallback(async () => {
        if (id) {
            try {
                const competition = await getCompetition(id)
                setCompetition(competition.data)
                updateRemainingTime(competition.data.start_time, competition.data.end_time)
                setLoading(false)
            } catch (err: any) {
                console.log(err)
                setError(err.response?.data?.detail ?? "Something went wrong")
            }
        }
    }, [id])

    const timerEnded = () => {
        setSubmitCode(true)
    }

    useEffect(() => {
        getCompetitionData()
    }, [getCompetitionData])

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
                                <div className="text-left w-full flex flex-col gap-2 text-gray-700">
                                    <div className="text-[3vh] font-semibold">{competition?.name}</div>
                                    <div className="text-sm">{competition?.description}</div>
                                </div>
                                {loading ? null : (
                                    <Timer
                                        seconds={remainingTime}
                                        handleTimerEnd={timerEnded}
                                    />
                                )}
                            </div>
                            {competition?.start_time && competition?.end_time ? (
                                new Date(competition?.start_time) < new Date() && new Date(competition?.end_time) > new Date() ? (
                                    <ProblemSolver
                                        problems={competition?.problems!!}
                                        competitionId={competition?.id}
                                        submitCode={submitCode}
                                    />
                                ) : null
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ContestantViewCompetitionPage
