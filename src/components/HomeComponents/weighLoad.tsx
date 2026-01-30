import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useTranslation } from 'react-i18next';

interface WeighLoadProps {
  value: number; // Tek bir değer alacak şekilde props ekliyoruz
  desc1?: string;
  desc2?: string;
  desc3?: string;
}

const WeighLoad = ({ value, desc1, desc2, desc3 }: WeighLoadProps) => {
  const { t } = useTranslation();
  // Yüzdeyi hesapla
  const percentage = Math.round(value); // Örneğin 55 ise 55% diyebiliriz

  const [state, setState] = React.useState({
    series: [value, 100 - value], // Tek veri, diğer kısım boş olacak
    options: {
      chart: {
        type: 'donut',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
        },
      },
      // Yüzdeyi ortada göstermek için annotations
      annotations: {
        position: 'front',
        yaxis: [
          {
            y: 50, // Ortada göstermek istediğiniz alan
            borderColor: 'transparent',
            label: {
              text: `${percentage}%`, // Ortada gösterilecek metin
              style: {
                fontSize: '24px',
                color: '#333',
                fontWeight: 'bold',
              },
            },
          },
        ],
      },
      // Legend kısmını gizleme
      legend: {
        show: false,
      },
      grid: {
        padding: {
          bottom: -100,
        },
      },
      // Responsive ayarları
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      // Çizgi renklerini kırmızı ve yeşil yapma
      colors: ['#B9C2CA', '#005A9C'], // Yeşil ve Kırmızı renkler
    },
  });

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div id="chart" className="w-[300px] sm:w-[400px] lg:w-[500px] items-center justify-center  flex flex-col">
        <p>{t("batteryHealthPage.currentWeightLoad")}</p>
        <ReactApexChart options={state.options} series={state.series} type="donut" height={350} />

            <div className="flex flex-col justify-start items-start">
            <div className="ml-4 flex items-center justify-center">
                <SvgIcons iconName={"ListArrow"} fill='#FF6F00' />
                <div className="text-blue1 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{t("batteryHealthPage.currentMode")}</div>
                <div className="text-sm font-medium text-gray10">: {desc1}</div>
            </div>

            <div className="ml-4 flex items-center justify-center">
                <SvgIcons iconName={"ListArrow"} fill='#FF6F00' />
                <div className="text-blue1 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{t("batteryHealthPage.currentHeight")}</div>
                <div className="text-sm font-medium text-gray10">: {desc2}</div>
            </div>

            <div className="ml-4 flex items-center justify-center">
                <SvgIcons iconName={"ListArrow"} fill='#FF6F00' />
                <div className="text-blue1 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{t("batteryHealthPage.currentGroundSpeed")}</div>
                <div className="text-sm font-medium text-gray10">: {desc3}</div>
            </div>
            </div>

      </div>
    </div>
  );
};

export default WeighLoad;
