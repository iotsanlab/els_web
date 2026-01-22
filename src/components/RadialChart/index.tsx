import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useDarkMode } from '../../context/DarkModeContext';

interface RadialChartProps {
  value?: number;
  maxValue?: number;
  minValue?: number;
  title?: string;
  color?: string;
}

const RadialChart: React.FC<RadialChartProps> = ({
  value = 0,
  maxValue = 100,
  minValue = 0,
  title = '',
  color = '#5EB044'
}) => {
  // Değerin min ve max arasındaki yüzdesini hesapla
  const percentage = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));

  const { isDarkMode } = useDarkMode();
  
  // Değere göre renk belirle
  let chartColor = color;
  if (!color) {
    const average = (maxValue + minValue) / 2;
    if (value < minValue + (maxValue - minValue) * 0.3) {
      chartColor = "#5EB044"; // Yeşil
    } else if (value > average && value < average + (maxValue - average) * 0.6) {
      chartColor = "#FFD600"; // Sarı
    } else if (value >= average + (maxValue - average) * 0.6) {
      chartColor = "#E84747"; // Kırmızı
    }
  }

  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -10,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -65,
        endAngle: 65,
        track: {
          background: isDarkMode ? "#424D57" : "#e7e7e7",
          strokeWidth: '100%',
          margin: 0,
          
        },
        dataLabels: {
          name: {
            show: false
          }
        }
      }
    },
    fill: {
      colors: [chartColor]
    },
  };

  const series = [percentage];

  return (
    <ReactApexChart 
        options={options} 
        series={series} 
        type="radialBar" 
        height={220} 
      />
  );
};

export default RadialChart;
