import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { SvgIcons } from '../../assets/icons/SvgIcons';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../context/DarkModeContext';

interface WeighLoadProps {
  value: number; // Tek bir değer alacak şekilde props ekliyoruz
  desc1?: string;
  desc2?: string;
  desc3?: string;
}

const WeighLoad = ({ value, desc1, desc2, desc3 }: WeighLoadProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  // Yüzdeyi hesapla
  const percentage = Math.round(value); // Örneğin 55 ise 55% diyebiliriz

  const [state, setState] = useState({
    series: [value, 100 - value], // Tek veri, diğer kısım boş olacak
    options: {
      chart: {
        type: 'donut' as const,
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
        },
      },
      tooltip: {
        enabled: false,
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
                color: isDarkMode ? '#fff' : '#333',
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
      colors: isDarkMode ? ['#424D57', '#e12627'] : ['#B9C2CA', '#e12627'],
    },
  });

  useEffect(() => {
    setState({
      series: [value, 100 - value],
      options: {
        chart: {
          type: 'donut' as const,
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            offsetY: 10,
          },
        },
        annotations: {
          position: 'front',
          yaxis: [
            {
              y: 50,
              borderColor: 'transparent',
              label: {
                text: `${percentage}%`,
                style: {
                  fontSize: '24px',
                  color: isDarkMode ? '#fff' : '#333',
                  fontWeight: 'bold',
                },
              },
            },
          ],
        },
        legend: {
          show: false,
        },
        grid: {
          padding: {
            bottom: -100,
          },
        },
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
        colors: isDarkMode ? ['#424D57', '#e12627'] : ['#B9C2CA', '#e12627'],
      },
    });
  }, [value, isDarkMode, percentage]);

  return (
    <div className="w-full h-full bg-white dark:bg-gray10 border border-gray2 dark:border-gray9 rounded-xl p-6 flex flex-col justify-between items-center">
      <div id="chart" className="w-full items-center justify-center flex flex-col">
        <p className="text-gray8 dark:text-white text-sm font-outfit font-bold self-start mb-2">{t("batteryHealthPage.currentWeightLoad")}</p>
        <ReactApexChart options={state.options} series={state.series} type="donut" height={220} />

        <div className="flex flex-col justify-start items-start w-full mt-4 space-y-2">
          <div className="flex items-center">
            <SvgIcons iconName={"ListArrow"} fill='#FF6F00' className="w-4 h-4 flex-shrink-0" />
            <div className="text-blue1 dark:text-gray3 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{t("batteryHealthPage.currentMode")}</div>
            <div className="text-sm font-medium text-gray10 dark:text-white">: {desc1}</div>
          </div>

          <div className="flex items-center">
            <SvgIcons iconName={"ListArrow"} fill='#FF6F00' className="w-4 h-4 flex-shrink-0" />
            <div className="text-blue1 dark:text-gray3 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{t("batteryHealthPage.currentHeight")}</div>
            <div className="text-sm font-medium text-gray10 dark:text-white">: {desc2}</div>
          </div>

          <div className="flex items-center">
            <SvgIcons iconName={"ListArrow"} fill='#FF6F00' className="w-4 h-4 flex-shrink-0" />
            <div className="text-blue1 dark:text-gray3 font-bold font-outfit text-xs tracking-wide min-w-[150px] ml-4">{t("batteryHealthPage.currentGroundSpeed")}</div>
            <div className="text-sm font-medium text-gray10 dark:text-white">: {desc3}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeighLoad;
