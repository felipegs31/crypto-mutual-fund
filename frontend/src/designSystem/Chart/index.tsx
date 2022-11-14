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
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        display: false,
      }
    },
    x: {
      ticks: {
        display: false,
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false,
      text: 'Coin Issued Value',
    },
  },
};

const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function Chart() {
  return <Line options={options} data={data} />;
}

export default Chart;
