import { Pie } from "react-chartjs-2"
import { Chart, ArcElement, CategoryScale, DoughnutController } from "chart.js"
import { UserStatistics } from "../Models"

Chart.register(DoughnutController, ArcElement, CategoryScale)

interface StatisticsChartProps {
    statistics: UserStatistics | undefined
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ statistics }) => {
    const data = {
        labels: ["Correct Submissions", "Incorrect Submissions"],
        datasets: [
            {
                data: [statistics?.correct_submissions || 0, (statistics?.total_submissions || 0) - (statistics?.correct_submissions || 0)],
                backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
            },
        ],
    }

    return (
        <div className="bg-white p-4 flex flex-col justify-center items-center text-center gap-2 border-4 rounded-2xl">
            <div className="text-xl font-bold h-[20%] w-[15rem]">Submission Statistics</div>
            {!statistics?.total_submissions && !statistics?.correct_submissions ? (
                <div className="w-full h-full flex text-center items-center justify-center ">
                    No available statistics for this contestant.
                </div>
            ) : (
                <>
                    <div className="flex justify-center items-center h-[60%]">
                        {statistics && <Pie data={data} style={{ maxHeight: "12rem", maxWidth: "12rem" }} />}
                    </div>
                    <div className="flex flex-col justify-center items-center h-[20%]">
                        <p className="text-lg">Total Submissions: {statistics?.total_submissions}</p>
                        <p className="text-lg">Correct Submissions: {statistics?.correct_submissions}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default StatisticsChart
