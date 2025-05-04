import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { StockSummary } from '@/types/product';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockLineChartProps {
  stockData: StockSummary[];
}

export const StockLineChart = ({ stockData }: StockLineChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Estoque Total (últimos 30 dias)',
      },
    },
  };

  const labels = stockData.map(item => {
    const date = new Date(item.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: stockData.map(item => item.totalQuantity),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="h-80">
      <Line options={options} data={data} />
    </div>
  );
};