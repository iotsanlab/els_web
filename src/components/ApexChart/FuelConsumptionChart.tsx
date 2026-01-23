import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDarkMode } from "../../context/DarkModeContext";
import NoDataBar from "../../assets/images/noDataBar.png";
import { useTranslation } from 'react-i18next';

interface FuelConsumptionData {
  series: {
    name: string;
    data: number[];
    color?: string;
  }[];
  days: string[];
  isEmpty?: boolean;
  isFuel?: boolean;
  isLegend?: boolean;
  isTooltipText?: boolean;
}

const FuelConsumptionChart: React.FC<FuelConsumptionData> = ({
  series,
  days,
  isEmpty,
  isFuel,
  isLegend = true,
  isTooltipText = true
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
              formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                // actualValue 0 ise yazı göstermiyoruz
                if (data?.actualValue === 0) return "";

                return val;
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
        show: isLegend,
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
      }
    }
  }));
}, [series, days, isDarkMode]);


  // Props değiştiğinde state'i güncelle
  useEffect(() => {
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
        }
      }
    }));

  }, [series, days, isDarkMode]);

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
            series={state.series}
            options={state.options}
            type="bar"
            width={days.length > 10 ? 1200 : undefined}
            height={300}
          />
        </div>
      )}

    </div>
  );

};

export default FuelConsumptionChart;