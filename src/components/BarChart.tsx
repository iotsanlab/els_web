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

// Chart.js modüllerini kaydet
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

const BarChart = ({title} : Props) => {
  // Grafik verisi ve konfigürasyonu
  const data = {
    labels: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'], // Günler
    datasets: [
      {
        label: 'Çalışma', // Yeşil veri (Çalışma)
        data: [12, 15, 7, 10, 16, 10, 0], // Çalışma saatleri
        backgroundColor: '#5EB044', // Yeşil renk (Çalışma)
        stack: 'stack1', // Yığma için grup
        borderRadius: 20,
        borderColor: 'transparent', // Kenarlık rengini şeffaf yap
        borderWidth: 0, // Kenarlık kalınlığını sıfırla
      },
      {
        label: 'Rolanti', // Kırmızı veri (Rolanti)
        data: [12, 4, 3, 5, 10, 3, 0], // Rolanti saatleri
        backgroundColor: '#E84747', // Kırmızı renk (Rolanti)
        stack: 'stack1', // Yığma için grup
        borderColor: 'transparent', // Kenarlık rengini şeffaf yap
        borderWidth: 0, // Kenarlık kalınlığını sıfırla
      },
      {
        label: 'Kapalı', // Gri bar
        data: [24, 24, 24, 24, 24, 24, 24], // Her barın toplam yüksekliği
        backgroundColor: '#EAEAEA', // Gri renk (Boş Alan)
        stack: 'stack1', // Yığma için grup
        borderColor: 'transparent', // Kenarlık rengini şeffaf yap
        borderWidth: 0, // Kenarlık kalınlığını sıfırla
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: false,
          text: 'Günler', // X ekseninin başlığı
        },
        grid: {
          display: false, // X eksenindeki grid çizgilerini gizler
        },
        position: 'top', // X eksenindeki etiketleri barların üstünde göstermek için 'top' konumu kullan
      },
      y: {
        title: {
          display: false,
          text: 'Saatler', // Y ekseninin başlığı
        },
        beginAtZero: true, // Y ekseni sıfırdan başlasın
        stacked: true, // Yığmalı bar
        max: 24, // Sabit max değer
        grid: {
          display: false, // Y eksenindeki grid çizgilerini gizler
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'bottom', // Legend'ı alt tarafa yerleştiriyoruz
        labels: {
          usePointStyle: true, // Legend için yuvarlak işaretler
        },
      },
    },
    indexAxis: 'x', // X eksenini yatay olarak ayarlayalım
    elements: {
      bar: {
        borderWidth: 0, // Tüm barlar için kenarlık kalınlığını sıfırla
        borderColor: 'transparent', // Tüm barlar için kenarlık rengini şeffaf yap
      },
    },
  };

  return (
    <div className="w-[400px] h-[400px]">
      <h2 className="text-gray8 font-inter font-bold text-sm leading-tight mb-4 pl-8">{title}</h2>

      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
