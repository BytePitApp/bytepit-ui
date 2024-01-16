import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, DoughnutController } from 'chart.js';
import { UserStatistics } from '../Models';

Chart.register(DoughnutController, ArcElement, CategoryScale);

interface StatisticsChartProps {
  statistics: UserStatistics | undefined;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ statistics }) => {
  const data = {
    labels: ['Correct Submissions', 'Incorrect Submissions'],
    datasets: [
      {
        data: [
          statistics?.correct_submissions || 0,
          (statistics?.total_submissions || 0) - (statistics?.correct_submissions || 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
  <div style={{ flexBasis: '55%', padding: '20px', boxSizing: 'border-box', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }} className="bg-white flex flex-col justify-center items-center text-center">
    <h2 className="text-2xl font-bold mb-4">Submission Statistics</h2>
    <div style={{ width: '80%', height: '80%' }} className="flex justify-center items-center">
      {statistics && <Pie data={data} />}
    </div>
    <div className="flex flex-col justify-center items-center">
      <p className="text-lg">Total Submissions: {statistics?.total_submissions}</p>
      <p className="text-lg">Correct Submissions: {statistics?.correct_submissions}</p>
    </div>
  </div>
);
};

export default StatisticsChart;
