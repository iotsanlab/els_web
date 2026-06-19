import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../context/DarkModeContext';

interface ChargingData {
    hour: string;
    value: number;
}

interface Props {
    data?: ChargingData[];
}

const ChargingPatternChart: React.FC<Props> = ({ data: propData }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useDarkMode();

    const data = propData && propData.length > 0 ? propData : [
        { hour: '11/06', value: 60 },
        { hour: '12/06', value: 75 },
        { hour: '13/06', value: 55 },
        { hour: '14/06', value: 80 },
        { hour: '15/06', value: 70 },
        { hour: '16/06', value: 74 },
        { hour: '17/06', value: 65 },
    ];

    const brandColor = "#e12627";

    return (
        <div className="w-full h-full items-start justify-start p-4 bg-white dark:bg-gray10 rounded-xl border-[0.5px] border-gray2 dark:border-gray9">
            <h2 className="text-gray8 dark:text-white text-sm font-outfit font-bold mb-4">{t("batteryHealthPage.cumulativeChargingPattern")}</h2>
            <div className="w-full h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="20%">
                        <CartesianGrid vertical={false} stroke={isDarkMode ? '#424D57' : '#E5E8EB'} />
                        <XAxis
                            dataKey="hour"
                            tick={{ fill: isDarkMode ? '#A2ADB9' : '#5D6974', fontSize: 9 }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tickCount={6}
                            tick={{ fill: isDarkMode ? '#A2ADB9' : '#5D6974', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                            cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div
                                            className="p-2 bg-white dark:bg-gray10 rounded shadow text-xs font-inter font-medium"
                                            style={{ border: `1px solid ${isDarkMode ? '#424D57' : '#E5E8EB'}`, color: isDarkMode ? '#fff' : '#000' }}
                                        >
                                            <p className="font-bold mb-1">{label}</p>
                                            <p>{payload[0].value}%</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" radius={[3, 3, 0, 0]} fill={brandColor} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChargingPatternChart;