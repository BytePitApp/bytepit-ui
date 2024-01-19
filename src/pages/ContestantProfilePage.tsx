import { Navbar, UserInfo } from "../components"
import { getCurrentUsersStatistics } from "../services/users.service"
import { useEffect, useState } from "react"
import { UserStatistics } from "../Models"
import { useCallback } from "react"
import { StatisticsChart } from "../components"
import { RankBarChart } from "../components"
import { UserTrophies } from "../components"
import { ProgressSpinner } from "primereact/progressspinner"
import { useParams } from "react-router-dom"

const ContestantProfilePage = () => {
    const [loading, setLoading] = useState(true)
    const [statistics, setStatistics] = useState<UserStatistics>()
    const { id } = useParams<{ id: string }>()

    const fetchStatistics = useCallback(async () => {
        try {
            setLoading(true)
            const response = await getCurrentUsersStatistics(id)
            const statistics: UserStatistics = response.data
            setStatistics(statistics)
            setLoading(false)
        } catch (err: any) {
            console.log(err.response?.data?.detail ?? "Something went wrong")
        }
    }, [])

    useEffect(() => {
        fetchStatistics()
    }, [fetchStatistics])

    const rankCounts = statistics?.trophies.reduce(
        (counts, trophy) => {
            const rank = trophy.rank_in_competition
            if (rank >= 1 && rank <= 3) {
                counts[3 - rank].count += 1
            }
            return counts
        },
        [
            { name: "3rd places", count: 0 },
            { name: "2nd places", count: 0 },
            { name: "1st places", count: 0 },
        ]
    ) || [
        { name: "3rd places", count: 0 },
        { name: "2nd places", count: 0 },
        { name: "1st places", count: 0 },
    ]

    return (
        <div className="bg-form bg-cover min-h-screen pb-4">
            <Navbar />
            {loading && (
                <div className="z-50 absolute top-1.5 left-[50%]">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
                </div>
            )}
            <div className="m-10 bg-graymedium px-[5%] rounded-xl flex flex-col py-8 border-b-4 border-graydark">
                <UserInfo userId={id} />
                <div className="flex justify-center gap-10">
                    <StatisticsChart statistics={statistics} />
                    <RankBarChart data={rankCounts} />
                    <UserTrophies trophies={statistics?.trophies ?? []} />
                </div>
            </div>
        </div>
    )
}

export default ContestantProfilePage
