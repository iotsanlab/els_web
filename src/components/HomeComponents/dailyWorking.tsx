import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../context/DarkModeContext';

interface DailyWorkingData {
    date: string;
    hours: number;
}

interface Props {
    data?: DailyWorkingData[];
}

const DailyWorking: React.FC<Props> = ({ data: propData }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useDarkMode();

    // Prop'tan veri gelmediyse statik veri kullan
    const data = propData && propData.length > 0 ? propData : [
        { date: '01.02.2025', hours: 4.70 },
        { date: '02.02.2025', hours: 4.80 },
        { date: '03.02.2025', hours: 6.20 },
        { date: '04.02.2025', hours: 3.00 },
        { date: '05.02.2025', hours: 3.50 },
        { date: '06.02.2025', hours: 6.20 },
        { date: '07.02.2025', hours: 4.40 },
    ];

    const maxHours = Math.max(...data.map(d => d.hours), 10);
    const yMax = Math.ceil(maxHours / 2) * 2; // 2'nin katlarına yuvarla

    return (
        <div className="w-full h-full items-start justify-start p-4 flex flex-col bg-white dark:bg-gray10 border-[0.5px] border-gray2 dark:border-gray9 rounded-xl">
            <div className='flex flex-col w-full h-full'>
                <h2 className="text-gray8 dark:text-white text-sm font-outfit font-bold mb-8">{t("batteryHealthPage.dailyWorkingHours")}</h2>

                <div className="w-full h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                bottom: 25,
                                right: 10,
                                left: -10,
                            }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#424D57' : '#E5E8EB'} vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{
                                    fill: isDarkMode ? '#A2ADB9' : '#5D6974',
                                    fontSize: 7,
                                    angle: -45,
                                    textAnchor: 'end',
                                    dy: 10,
                                }}
                                axisLine={{ stroke: isDarkMode ? '#424D57' : '#E5E8EB' }}
                            />

                            <YAxis
                                domain={[0, yMax]}
                                tick={{ fill: isDarkMode ? '#8B96A2' : '#8B96A2' }}
                                axisLine={{ stroke: isDarkMode ? '#424D57' : '#E5E8EB' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#28333E' : '#fff',
                                    border: `1px solid ${isDarkMode ? '#424D57' : '#E5E8EB'}`,
                                    borderRadius: '4px',
                                    color: isDarkMode ? '#fff' : '#000'
                                }}
                                formatter={(value: number) => [`${value} ${t("global.h")}`, t("batteryHealthPage.dailyWorkingHours")]}
                            />
                            <Bar
                                dataKey="hours"
                                name={t("batteryHealthPage.dailyWorkingHours")}
                                fill={isDarkMode ? "#e12627" : "#e12627"}
                                radius={[4, 4, 0, 0]}
                                label={{ position: 'top', fill: isDarkMode ? '#fff' : '#333', fontSize: 12 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DailyWorking;
