import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../context/DarkModeContext';

interface EnergyData {
    date: string;
    value: number;
}

interface Props {
    data?: EnergyData[];
}

const EnergyConsumptionChart: React.FC<Props> = ({ data: propData }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useDarkMode();

    // Prop'tan veri gelmediyse statik veri kullan
    const data = propData && propData.length > 0 ? propData : [
        { date: '01-02-2025', value: 2 },
        { date: '02-02-2025', value: 10.6 },
        { date: '03-02-2025', value: 14.9 },
        { date: '04-02-2025', value: 7.2 },
        { date: '05-02-2025', value: 8.1 },
        { date: '06-02-2025', value: 14.2 },
        { date: '07-02-2025', value: 11.4 },
    ];

    const averageValue = data.length > 0
        ? parseFloat((data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1))
        : 10.8;

    const maxValue = Math.max(...data.map(d => d.value), 16);
    const yMax = Math.ceil(maxValue / 4) * 4; // 4'ün katlarına yuvarla

    const brandColor = isDarkMode ? "#e12627" : "#e12627";

    return (
        <div className="w-full h-full items-start justify-start p-4 bg-white dark:bg-gray10 border-[0.5px] border-gray2 dark:border-gray9 rounded-xl">
            <h2 className="text-gray8 dark:text-white text-sm font-outfit font-bold mb-8">{t("batteryHealthPage.energyConsumptionTrend")}</h2>
            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 20,
                            bottom: 20,
                            right: 10,
                            left: -10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#424D57' : '#E5E8EB'} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: isDarkMode ? '#A2ADB9' : '#5D6974', fontSize: 12 }}
                            axisLine={{ stroke: isDarkMode ? '#424D57' : '#E5E8EB' }}
                        />
                        <YAxis
                            domain={[0, yMax]}
                            tick={{ fill: isDarkMode ? '#A2ADB9' : '#5D6974', fontSize: 12 }}
                            axisLine={{ stroke: isDarkMode ? '#424D57' : '#E5E8EB' }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div 
                                            className="p-2 bg-white dark:bg-gray10 rounded shadow text-xs font-inter font-medium"
                                            style={{
                                                border: `1px solid ${isDarkMode ? '#424D57' : '#E5E8EB'}`,
                                                color: isDarkMode ? '#fff' : '#000'
                                            }}
                                        >
                                            <p className="font-bold mb-1">{label}</p>
                                            <p>{payload[0].value} {t("global.kWh")}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={brandColor} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={brandColor} stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <ReferenceLine
                            y={averageValue}
                            stroke="#FF6B6B"
                            strokeDasharray="3 3"
                            label={{
                                value: `${averageValue}`,
                                position: 'right',
                                fill: '#FF6B6B',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            name={t("batteryHealthPage.energyConsumptionTrend")}
                            stroke={brandColor}
                            fill="url(#colorValue)"
                            label={{
                                position: 'top',
                                fill: isDarkMode ? '#fff' : '#333',
                                fontSize: 12,
                                formatter: (value: number) => `${value}`,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EnergyConsumptionChart;
