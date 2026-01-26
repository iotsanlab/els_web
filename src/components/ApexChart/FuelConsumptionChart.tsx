import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDarkMode } from "../../context/DarkModeContext";
import NoDataBar from "../../assets/images/noDataBar.png";
import { useTranslation } from 'react-i18next';

interface FuelConsumptionData {
  series: {
    name: string;
    data: (number | { x?: string; y: number; fillColor?: string; actualValue?: number })[];
    color?: string;
  }[];
  days: string[];
  isEmpty?: boolean;
  isFuel?: boolean;
  isLegend?: boolean;
  isTooltipText?: boolean;
  showAverageLine?: boolean;
  averageValue?: number;
  onToggleAverageLine?: (value: boolean) => void;
}

const FuelConsumptionChart: React.FC<FuelConsumptionData> = ({
  series,
  days,
  isEmpty,
  isFuel,
  isLegend = true,
  isTooltipText = true,
  showAverageLine = false,
  averageValue = 7,
  onToggleAverageLine
}) => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getMaxValueFromSeries = (series: FuelConsumptionData["series"]): number => {
  const allValues = series.flatMap(s => s.data.map(d => typeof d === "number" ? d : d?.y ?? 0));
  const maxVal = Math.max(...allValues, 0);
  return Math.max(10, maxVal+4);
};


  const [state, setState] = React.useState<{
    series: FuelConsumptionData["series"];
    options: ApexOptions;
  }>({
    series: series,
    options: {
      chart: {
        type: "bar",
        height: "auto",
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        enabled: true,
        custom: function ({ seriesIndex, dataPointIndex, w }) {
          const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          const name = w.globals.initialSeries[seriesIndex].name;

          if (data?.actualValue === 0) return '';

          return `<ul class="list-none p-1 bg-white dark:bg-gray10 dark:text-white rounded-md border-none">
      <li><b>${name}</b>: ${data.actualValue} ${
        isTooltipText ? isFuel == true ? t("global.kWh") : t("global.h") : ""
      } </li>
    </ul>`;
        }
      },
      responsive: [
        {
          breakpoint: 1536,
          options: {
            chart: {
              height: 250,
            },
            plotOptions: {
              bar: {
                borderRadius: 3,
                columnWidth: "60%",
                dataLabels: {
                  total: {
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
              },
            },
            legend: {
              position: "bottom",
              offsetX: 0,
              offsetY: 0,
              fontSize: "8px",
            },
            xaxis: {
              labels: {
                fontSize: "10px"
              },
            },
          },
        }
      ],
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 5,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          columnWidth: "50%",
          dataLabels: {
            hideOverflowingLabels: true,
            total: {
              enabled: true,
              formatter: function (val, { seriesIndex, dataPointIndex, w }): string {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                // actualValue 0 ise yazı göstermiyoruz
                if (data?.actualValue === 0) return "";

                return val?.toString() ?? "";
              }, style: {
                fontSize: "12px",
                fontWeight: "bold",
                color: "#A8A29E"
              },
            },
          },
        },
      },
      grid: {
        borderColor: isDarkMode ? '#5D6974' : '#f8f8f8',
        xaxis: {
          lines: {
            show: true,
          },
        }
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (value: number) => {
            return value.toFixed(0);
          },
          style: {
            fontSize: "11px",
            colors: '#A8A29E'
          },
        },
      },
      xaxis: {
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        type: "category",
        categories: days,

        labels: {
          show: true,
          formatter: (value: string) => {
            return value;
          },
          style: {
            fontSize: days.length > 10 ? "8px" : "10px",
                colors: '#A8A29E'

          },
        },
      },
      legend: {
        position: "bottom",
        offsetX: 10,
        offsetY: 10,
        show: false, // Custom legend kullanacağız
        showForSingleSeries: true,
        horizontalAlign: "left",
        fontWeight: "bold",
        labels: {
          colors: isDarkMode ? '#5D6974' : '#B9C2CA',
        }
      },
      fill: {
        opacity: 1,
      },
      annotations: {
        yaxis: showAverageLine ? [{
          y: averageValue,
          borderColor: '#EF4444',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '11px',
              fontWeight: 'bold',
            },
            text: `İdeal: ${averageValue}`,
            position: 'left',
            offsetX: 40,
            offsetY: 0,
          }
        }] : []
      },
    },
  });

  // Dark mode değiştiğinde chart'ı güncelle
useEffect(() => {
  const calculatedMax = getMaxValueFromSeries(series); // buradan max hesaplıyoruz

  setState(prevState => ({
    ...prevState,
    series: series,
    options: {
      ...prevState.options,
      grid: {
        ...prevState.options.grid,
        borderColor: isDarkMode ? '#5D6974' : '#f8f8f8',
      },
      xaxis: {
        ...prevState.options.xaxis,
        categories: days,
        labels: {
          ...prevState.options.xaxis?.labels,
          style: {
            ...prevState.options.xaxis?.labels?.style,
            fontSize: days.length > 10 ? "8px" : "10px"
          }
        }
      },
      yaxis: {
        ...prevState.options.yaxis,
        min: 0,
        max: calculatedMax,
      },
      legend: {
        ...prevState.options.legend,
        labels: {
          colors: isDarkMode ? '#B9C2CA' : '#5D6974',
        }
      },
      plotOptions: {
        ...prevState.options.plotOptions,
        bar: {
          ...prevState.options.plotOptions?.bar,
          dataLabels: {
            ...prevState.options.plotOptions?.bar?.dataLabels,
            total: {
              ...prevState.options.plotOptions?.bar?.dataLabels?.total,
              enabled: series.length === 1,
              style: {
                ...prevState.options.plotOptions?.bar?.dataLabels?.total?.style,
              }
            }
          }
        }
      },
      annotations: {
        yaxis: showAverageLine ? [{
          y: averageValue,
          borderColor: '#EF4444',
          borderWidth: 2,
          strokeDashArray: 5,
          label: {
            borderColor: '#EF4444',
            style: {
              color: '#fff',
              background: '#EF4444',
              fontSize: '11px',
              fontWeight: 'bold',
            },
            text: `İdeal: ${averageValue}`,
            position: 'left',
            offsetX: 40,
            offsetY: 0,
          }
        }] : []
      }
    }
  }));
}, [series, days, isDarkMode, showAverageLine, averageValue]);



  // Mouse event handlers for dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (chartContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - chartContainerRef.current.offsetLeft);
      setScrollLeft(chartContainerRef.current.scrollLeft);

      // Add cursor-grab style
      if (chartContainerRef.current) {
        chartContainerRef.current.style.cursor = 'grabbing';
        chartContainerRef.current.style.userSelect = 'none';
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !chartContainerRef.current) return;

    const x = e.pageX - chartContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scroll
    chartContainerRef.current.scrollLeft = scrollLeft - walk;

    // Prevent default behavior
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Reset cursor style
    if (chartContainerRef.current) {
      chartContainerRef.current.style.cursor = 'grab';
      chartContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);

      // Reset cursor style
      if (chartContainerRef.current) {
        chartContainerRef.current.style.cursor = 'grab';
        chartContainerRef.current.style.userSelect = 'auto';
      }
    }
  };


  return (
    <div className="w-full h-full">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center w-full h-[300px]">
          <img
            className="w-[180px] h-[180px] object-contain"
            src={NoDataBar}
            alt="No enough data"
          />
          <span className='mt-2 text-[16px] font-bold tracking-wide text-gray10 font-inter dark:text-gray6'>
            {t("global.noData") || "Yeteri kadar veri yok"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          <div
            ref={chartContainerRef}
            className="w-full h-full overflow-x-auto"
            style={{ cursor: "grab" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <ReactApexChart
              series={state.series as any}
              options={state.options}
              type="bar"
              width={days.length > 10 ? 1200 : undefined}
              height={300}
            />
          </div>
          {/* Custom Legend - Series + İdeal Tüketim yan yana */}
          <div className="flex items-center gap-5 px-12 -mt-2">
            {/* Series Legend Items */}
            {isLegend && series.map((s, index) => (
              <div key={index} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: s.color || '#FFA600' }}
                />
                <span className="text-xs font-semibold text-gray8 dark:text-gray4">
                  {s.name}
                </span>
              </div>
            ))}
            
            {/* İdeal Tüketim Toggle */}
            {onToggleAverageLine && (
              <label 
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => onToggleAverageLine(!showAverageLine)}
              >
                <span 
                  className="w-6 h-0"
                  style={{ 
                    borderTop: showAverageLine ? '2px dashed #EF4444' : '2px dashed #9CA3AF'
                  }}
                />
                <span 
                  className={`text-xs font-semibold transition-colors ${
                    showAverageLine 
                      ? 'text-gray8 dark:text-gray4' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {t("global.idealConsumption") || "İdeal Tüketim"}
                </span>
              </label>
            )}
          </div>
        </div>
      )}

    </div>
  );

};

export default FuelConsumptionChart;