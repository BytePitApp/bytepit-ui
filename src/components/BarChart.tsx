import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"

interface BarData {
    name: string
    count: number
}

interface RankBarChartProps {
    data: BarData[]
}

const RankBarChart: React.FC<RankBarChartProps> = ({ data }) => {
    return (
        <div className="bg-white p-4 flex flex-col justify-center items-center text-center gap-2 border-4 rounded-2xl">
            <div className="text-xl font-bold h-[20%]">Competition placements</div>
            <div style={{ height: "100%", width: "25rem" }}>
                {!data[0].count && !data[1].count && !data[0].count ? (
                    <div className="w-full h-full flex text-center items-center justify-center">
                        No available competition placements for this contestant.
                    </div>
                ) : (
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}

export default RankBarChart
