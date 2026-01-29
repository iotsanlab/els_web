import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const EnergyConsumptionChart: React.FC = () => {
    const data = [
        { date: '01-02-2025', value: 2 },
        { date: '02-02-2025', value: 10.6 },
        { date: '03-02-2025', value: 14.9 },
        { date: '04-02-2025', value: 7.2 },
        { date: '05-02-2025', value: 8.1 },
        { date: '06-02-2025', value: 14.2 },
        { date: '07-02-2025', value: 11.4 },
    ];

    const averageValue = 10.8; // Kesikli çizgi için ortalama değer

    return (
        <div className="w-full h-full items-start justify-start p-4 bg-white border-[0.5px] border-gray22 rounded-xl mx-2">
            <h2 className="text-gray8 text-sm font-outfit font-bold mb-8">Energy Consumption Trend Chart</h2>
            <div className="w-full h-[400px]">
                <AreaChart
                    width={400}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#5D6974', fontSize: 12 }}
                        axisLine={{ stroke: '#E5E8EB' }}
                    />
                    <YAxis
                        domain={[0, 16]}
                        tick={{ fill: '#5D6974', fontSize: 12 }}
                        axisLine={{ stroke: '#E5E8EB' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E8EB',
                            borderRadius: '4px',
                        }}
                    />
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#005A9C" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#005A9C" stopOpacity={0.1}/>
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
                        stroke="#005A9C"
                        fill="url(#colorValue)"
                        label={{
                            position: 'top',
                            fill: '#333',
                            fontSize: 12,
                            formatter: (value: number) => `${value}`,
                        }}
                    />
                </AreaChart>
            </div>
        </div>
    );
};

export default EnergyConsumptionChart;
