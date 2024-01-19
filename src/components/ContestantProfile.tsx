import { useCallback, useEffect, useState } from "react"
import RankBarChart from "./BarChart"
import StatisticsChart from "./StatisticsChart"
import UserTrophies from "./UserTrophies"
import { getCurrentUsersStatistics } from "../services/users.service"
import { UserStatistics } from "../Models"
import { ProgressSpinner } from "primereact/progressspinner"

const ContestantProfile: React.FC<{ id: string }> = ({ id }) => {
    const [loading, setLoading] = useState(true)
    const [statistics, setStatistics] = useState<UserStatistics>()

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
        <div className="flex justify-center gap-10">
            {loading ? (
                <ProgressSpinner style={{ width: "50px", height: "50px" }} fill="#dee2e6" strokeWidth="7" />
            ) : null}
            <StatisticsChart statistics={statistics} />
            <RankBarChart data={rankCounts} />
            <UserTrophies trophies={statistics?.trophies ?? []} />
        </div>
    )
}

export default ContestantProfile
