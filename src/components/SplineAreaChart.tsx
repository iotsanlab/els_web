import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
} from 'chart.js';

// Chart.js modüllerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { useTranslation } from 'react-i18next';


const SplineAreaChart = () => {
    const {t} = useTranslation();
  
  const data = {
    labels: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    datasets: [
      {
        label: 'Bu Hafta',
        data: [30, 45, 40, 50, 60, 55, 65],
        fill: true,
        borderColor: '#4CAF50',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return undefined;  // null yerine undefined döndürülüyor
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(76, 175, 80, 0.5)');
          gradient.addColorStop(1, 'rgba(76, 175, 80, 0.2)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Geçen Hafta',
        data: [35, 50, 55, 45, 50, 60, 70],
        fill: true,
        borderColor: '#F44336',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;
          if (!chartArea) return undefined;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(244, 67, 54, 0.5)');
          gradient.addColorStop(1, 'rgba(244, 67, 54, 0.2)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };
  

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Günler',
        },
        position: 'top' as const,  // Tip uyuşmazlığını gidermek için 'as const' ekleniyor
      },
      y: {
        title: {
          display: true,
          text: `${t("global.barTitle1")} (L)`,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        mode: 'index' as const,  // Tip uyumsuzluğunu gidermek için 'as const' ekleniyor
        intersect: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-[10px]">
      <h2 className="text-2xl font-semibold mb-4">Yakıt Miktarı</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default SplineAreaChart;
