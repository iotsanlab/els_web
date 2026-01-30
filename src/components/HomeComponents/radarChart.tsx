import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const ChargingPatternChart: React.FC = () => {
    const { t } = useTranslation();
    const data = [
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

    return (
        <div className="w-full h-full items-start justify-start p-4 bg-white rounded-xl border-[0.5px] border-gray22 mx-2">
            <h2 className="text-gray8 text-sm font-outfit font-bold mb-8">{t("batteryHealthPage.cumulativeChargingPattern")}</h2>
            <div className="w-full h-[400px] flex items-center justify-center">
                <RadarChart
                    width={400}
                    height={300}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                >
                    <PolarGrid gridType="circle" />
                    <PolarAngleAxis
                        dataKey="hour"
                        tick={{ fill: '#5D6974', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 20]}
                        tick={{ fill: '#5D6974', fontSize: 10 }}
                    />
                    <Radar
                        name={t("batteryHealthPage.chargingPattern")}
                        dataKey="value"
                        stroke="#005A9C"
                        fill="#005A9C"
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E8EB',
                            borderRadius: '4px',
                        }}
                        formatter={(value: number) => [`${value}%`, t("batteryHealthPage.chargingRate")]}
                    />
                </RadarChart>
            </div>
        </div>
    );
};

export default ChargingPatternChart; 