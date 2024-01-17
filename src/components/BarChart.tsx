import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarData {
  name: string;
  count: number;
}

interface RankBarChartProps {
  data: BarData[];
}

const RankBarChart: React.FC<RankBarChartProps> = ({ data }) => {
  return (
    <>
      <h2 className="font-bold pb-[30px]">Competition Placements</h2>
      <div className="" style={{ height: '300px', width: '500px' }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default RankBarChart;
