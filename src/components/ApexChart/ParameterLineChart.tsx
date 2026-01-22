import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDarkMode } from "../../context/DarkModeContext";
import NoDataBar from "../../assets/images/noDataBar.png";
import { useTranslation } from 'react-i18next';

interface LineChartData {
    series: {
        name: string;
        data: number[];
        color?: string;
    }[];
    days: string[];
    isEmpty?: boolean;
}

const ParameterLineChart: React.FC<LineChartData> = ({
    series,
    days,
    isEmpty
}) => {
    const { isDarkMode } = useDarkMode();
    const { t } = useTranslation();

    // Çok fazla veri varsa label sayısını azalt
    const shouldRotateLabels = days.length > 15;
    const tickAmount = days.length > 20 ? 10 : undefined;

    const [state, setState] = useState<{
        series: LineChartData["series"];
        options: ApexOptions;
    }>({
        series: series,
        options: {
            chart: {
                type: "line",
                height: 350,
                fontFamily: 'Inter, system-ui, sans-serif',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                animations: {
                    enabled: true,
                    speed: 800,
                },
            },
            colors: series.map(s => s.color || '#005a9c'),
            stroke: {
                curve: "smooth",
                width: series.map(() => 3),
            },
            markers: {
                size: 4,
                strokeWidth: 2,
                strokeColors: '#fff',
                hover: {
                    size: 6,
                    sizeOffset: 3,
                },
            },
            dataLabels: {
                enabled: false,
            },
            grid: {
                show: true,
                borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                strokeDashArray: 3,
                position: 'back',
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10,
                },
            },
            xaxis: {
                categories: days,
                tickAmount: tickAmount,
                labels: {
                    show: true,
                    rotate: shouldRotateLabels ? -45 : 0,
                    rotateAlways: shouldRotateLabels,
                    hideOverlappingLabels: true,
                    trim: true,
                    style: {
                        fontSize: '11px',
                        fontWeight: 500,
                        colors: isDarkMode ? '#9CA3AF' : '#6B7280',
                    },
                },
                axisBorder: {
                    show: true,
                    color: isDarkMode ? '#374151' : '#E5E7EB',
                },
                axisTicks: {
                    show: true,
                    color: isDarkMode ? '#374151' : '#E5E7EB',
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    show: true,
                    formatter: (value: number) => {
                        return value !== null && value !== undefined ? value.toFixed(1) : '';
                    },
                    style: {
                        fontSize: '11px',
                        fontWeight: 500,
                        colors: isDarkMode ? '#9CA3AF' : '#6B7280',
                    },
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            tooltip: {
                enabled: true,
                shared: true,
                intersect: false,
                followCursor: false,
                theme: isDarkMode ? 'dark' : 'light',
                style: {
                    fontSize: '12px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                },
                x: {
                    show: true,
                    format: 'dd.MM',
                },
                y: {
                    formatter: (value: number) => {
                        return value !== null && value !== undefined ? value.toFixed(2) : '';
                    },
                    title: {
                        formatter: (seriesName: string) => seriesName + ':',
                    },
                },
                marker: {
                    show: true,
                },
                custom: undefined,
            },
            legend: {
                show: false,
            },
            fill: {
               
            },
        },
    });

    // Dark mode ve props değiştiğinde chart'ı güncelle
    useEffect(() => {
        const shouldRotate = days.length > 15;
        const ticks = days.length > 20 ? 10 : undefined;

        setState(prevState => ({
            ...prevState,
            series: series,
            options: {
                ...prevState.options,
                colors: series.map(s => s.color || '#005a9c'),
                stroke: {
                    ...prevState.options.stroke,
                    width: series.map(() => 3),
                },
                grid: {
                    ...prevState.options.grid,
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                },
                xaxis: {
                    ...prevState.options.xaxis,
                    categories: days,
                    tickAmount: ticks,
                    labels: {
                        ...prevState.options.xaxis?.labels,
                        rotate: shouldRotate ? -45 : 0,
                        rotateAlways: shouldRotate,
                        hideOverlappingLabels: true,
                        style: {
                            ...prevState.options.xaxis?.labels?.style,
                            colors: isDarkMode ? '#9CA3AF' : '#6B7280',
                        }
                    },
                    axisBorder: {
                        ...prevState.options.xaxis?.axisBorder,
                        color: isDarkMode ? '#374151' : '#E5E7EB',
                    },
                    axisTicks: {
                        ...prevState.options.xaxis?.axisTicks,
                        color: isDarkMode ? '#374151' : '#E5E7EB',
                    },
                },
                yaxis: {
                    ...prevState.options.yaxis,
                    labels: {
                        ...(typeof prevState.options.yaxis === 'object' && !Array.isArray(prevState.options.yaxis) ? prevState.options.yaxis.labels : {}),
                        style: {
                            fontSize: '11px',
                            fontWeight: 500,
                            colors: isDarkMode ? '#9CA3AF' : '#6B7280',
                        },
                    },
                },
                tooltip: {
                    ...prevState.options.tooltip,
                    theme: isDarkMode ? 'dark' : 'light',
                },
                fill: {
                    ...prevState.options.fill,
                    gradient: {
                        ...(prevState.options.fill?.gradient || {}),
                        shade: isDarkMode ? 'dark' : 'light',
                    },
                },
            }
        }));
    }, [series, days, isDarkMode]);

    return (
        <div className="w-full h-full dark:bg-gray-800">
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center w-full h-[350px]">
                    <img
                        className="w-[140px] h-[140px] object-contain opacity-60"
                        src={NoDataBar}
                        alt="No data available"
                    />
                    <span className='mt-4 text-[14px] font-medium text-gray-500 dark:text-gray-400'>
                        {t("global.noData") || "Yeteri kadar veri yok"}
                    </span>
                </div>
            ) : (
                <div className="w-full h-full">
                    <ReactApexChart
                        options={state.options}
                        series={state.series}
                        type="line"
                        height={350}
                        width="100%"
                    />
                </div>
            )}
        </div>
    );
};

export default ParameterLineChart;

