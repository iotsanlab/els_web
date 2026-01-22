import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize.tsx';
import { useDarkMode } from '../../context/DarkModeContext.tsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  title: string;
}

const WorkingBarChart = ({ title }: Props) => {
  const { width } = useWindowSize();
  const [aspectRatio, setAspectRatio] = useState(1.4);
  const { isDarkMode } = useDarkMode();
  
  useEffect(() => {
    // Ekran boyutuna göre aspect ratio ayarla
    if (width < 640) { // sm
      setAspectRatio(0.8);
    } else if (width < 768) { // md
      setAspectRatio(1);
    } else if (width < 1024) { // lg
      setAspectRatio(1.2);
    } else { // xl ve üzeri
      setAspectRatio(1.4);
    }
  }, [width]);

  const data = {
    labels: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'],
    datasets: [
      {
        label: 'Rönlanti',
        data: [2, 4, 3, 5, 8, 3, 4], // Rolanti saatleri
        backgroundColor: '#B9C2CA',
        stack: 'stack1',
        borderColor: 'transparent',
        borderWidth: 0, 
        borderRadius: 6,
        barPercentage: 0.7,

      },
      {
        label: 'Standart',
        data: [4, 15, 7, 10, 4, 10, 4],
        backgroundColor: '#FFD335',
        stack: 'stack1',
        borderRadius: 6,
        borderColor: 'transparent',
        borderWidth: 0, 
        barPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    aspectRatio: aspectRatio,
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 10,
        bottom: 10
      }
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Günler',
        },
        grid: {
          display: true,
          color: isDarkMode ? '#424D57' : '#E7E7E7',
        },
        ticks: {
          color: isDarkMode ? '#CBD1D7' : '#5D6974',
          font: {
            size: width < 768 ? 10 : 12,
          }
        },
        position: 'top',
      },
      y: {
        title: {
          display: false,
          text: 'Saatler',
        },
        beginAtZero: true,
        stacked: true,
        max: 24,
        grid: {
          display: true,
          color: isDarkMode ? '#424D57' : '#E7E7E7',
        },
        ticks: {
          stepSize: 4,
          callback: (value) => `${value}`,
          color: isDarkMode ? '#CBD1D7' : '#5D6974',
          font: {
            size: width < 768 ? 10 : 12,
          }
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#2C353D' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#FFFFFF' : '#2C353D',
        bodyColor: isDarkMode ? '#CBD1D7' : '#5D6974',
        borderColor: isDarkMode ? '#424D57' : '#E7E7E7',
        borderWidth: 1,
        padding: 8,
        displayColors: true,
        caretSize: 6,
      },
      legend: {
        position: width < 768 ? 'top' : 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          boxWidth: width < 640 ? 8 : 10,
          padding: width < 640 ? 8 : 15,
          font: {
            size: width < 640 ? 10 : 12,
          },
          color: isDarkMode ? '#CBD1D7' : '#5D6974',
        },
      },
    },
    indexAxis: 'x',
    elements: {
      bar: {
        borderWidth: 0,
        borderColor: 'transparent',
      },
    },
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="pl-8 mb-4 text-sm font-bold leading-tight text-gray8 dark:text-gray2 font-inter">{title}</h2>

      <div className="w-full h-full px-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default WorkingBarChart;
