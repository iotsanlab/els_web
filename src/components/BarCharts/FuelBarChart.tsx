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

const FuelBarChart = ({title} : Props) => {
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

  // Grafik verisi ve konfigürasyonu
  const data = {
    labels: ['Pt','Sa','Ça','Pe','Cu','Ct','Pa'],
    datasets: [
      {
        label: 'Yakıt (Lt)', // Yeşil veri (Çalışma)
        data: [12, 15, 7, 39, 16, 10, 8], // Çalışma saatleri
        backgroundColor: isDarkMode ? '#FFA600' : '#FFA600', // Yakıt rengi
        stack: 'stack1', // Yığma için grup
        borderRadius: 6,
        borderColor: 'transparent', // Kenarlık rengini şeffaf yap
        borderWidth: 0, // Kenarlık kalınlığını sıfırla
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
          text: 'Günler', // X ekseninin başlığı
        },
        grid: {
          display: true, // X eksenindeki grid çizgilerini gizler
          color: isDarkMode ? '#424D57' : '#E7E7E7',
        },
        ticks: {
          color: isDarkMode ? '#CBD1D7' : '#5D6974',
          font: {
            size: width < 768 ? 10 : 12,
          }
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
        max: 40, // Sabit max değer
        grid: {
          display: true, // Y eksenindeki grid çizgilerini göster
          color: isDarkMode ? '#424D57' : '#E7E7E7',
        },
        ticks: {
          stepSize: 5, // Her bir artış değeri 5 olacak şekilde ayarlıyoruz
          callback: (value) => `${value}`, // Değerlerin formatlanması
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
          usePointStyle: true, // Legend için yuvarlak işaretler
          boxWidth: width < 640 ? 8 : 10,
          padding: width < 640 ? 8 : 15,
          font: {
            size: width < 640 ? 10 : 12,
          },
          color: isDarkMode ? '#CBD1D7' : '#5D6974',
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
    <div className="flex flex-col w-full h-full">
      <h2 className="pl-8 mb-4 text-sm font-bold leading-tight text-gray8 dark:text-gray2 font-inter">{title}</h2>

      <div className="w-full h-full px-2">
        <Bar data={data} options={options} />
      </div>
      
    </div>
  );
};

export default FuelBarChart;
