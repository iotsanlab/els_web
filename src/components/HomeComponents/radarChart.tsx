import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
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

    // Prop'tan veri gelmediyse statik veri kullan
    const data = propData && propData.length > 0 ? propData : [
        { hour: '0', value: 15 },
        { hour: '1', value: 12 },
        { hour: '2', value: 8 },
        { hour: '3', value: 5 },
        { hour: '4', value: 3 },
        { hour: '5', value: 2 },
        { hour: '6', value: 1 },
        { hour: '7', value: 0 },
        { hour: '8', value: 0 },
        { hour: '9', value: 0 },
        { hour: '10', value: 0 },
        { hour: '11', value: 2 },
        { hour: '12', value: 3 },
        { hour: '13', value: 4 },
        { hour: '14', value: 5 },
        { hour: '15', value: 6 },
        { hour: '16', value: 7 },
        { hour: '17', value: 10 },
        { hour: '18', value: 12 },
        { hour: '19', value: 15 },
        { hour: '20', value: 18 },
        { hour: '21', value: 17 },
        { hour: '22', value: 16 },
        { hour: '23', value: 15 },
    ];

    const maxValue = Math.max(...data.map(d => d.value), 20);
    const radarMax = Math.ceil(maxValue / 5) * 5; // 5'in katlarına yuvarla

    const brandColor = isDarkMode ? "#e12627" : "#e12627";

    return (
        <div className="w-full h-full items-start justify-start p-4 bg-white dark:bg-gray10 rounded-xl border-[0.5px] border-gray2 dark:border-gray9">
            <h2 className="text-gray8 dark:text-white text-sm font-outfit font-bold mb-8">{t("batteryHealthPage.cumulativeChargingPattern")}</h2>
            <div className="w-full h-[320px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={data}
                    >
                        <PolarGrid stroke={isDarkMode ? '#424D57' : '#E5E8EB'} />
                        <PolarAngleAxis
                            dataKey="hour"
                            tick={{ fill: isDarkMode ? '#A2ADB9' : '#5D6974', fontSize: 10 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, radarMax]}
                            tick={{ fill: isDarkMode ? '#A2ADB9' : '#5D6974', fontSize: 10 }}
                            axisLine={{ stroke: isDarkMode ? '#424D57' : '#E5E8EB' }}
                        />
                        <Radar
                            name={t("batteryHealthPage.chargingPattern")}
                            dataKey="value"
                            stroke={brandColor}
                            fill={brandColor}
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#28333E' : '#fff',
                                border: `1px solid ${isDarkMode ? '#424D57' : '#E5E8EB'}`,
                                borderRadius: '4px',
                                color: isDarkMode ? '#fff' : '#000'
                            }}
                            formatter={(value: number) => [`${value}%`, t("batteryHealthPage.chargingRate")]}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChargingPatternChart;