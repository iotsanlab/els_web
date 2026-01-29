import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const DailyWorking: React.FC = () => {
    const data = [
        { date: '01.02.2025', hours: 4.70 },
        { date: '02.02.2025', hours: 4.80 },
        { date: '03.02.2025', hours: 6.20 },
        { date: '04.02.2025', hours: 3.00 },
        { date: '05.02.2025', hours: 3.50 },
        { date: '06.02.2025', hours: 6.20 },
        { date: '07.02.2025', hours: 4.40 },
    ];

    return (

        <div className="w-full h-full rounded-xl items-start justify-start p-4 flex border-[0.5px] border-gray22 rounded-xl mx-2">
            <div className='flex flex-col'>
                <h2 className="text-gray8 text-sm font-outfit font-bold mb-8">Daily Working Hours</h2>

                <div className="w-full h-[400px]">
                    <BarChart
                        width={400}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            bottom: 25,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E8EB" />
                        <XAxis
                            dataKey="date"
                            tick={{
                                fill: '#5D6974',
                                fontSize: 7,
                                angle: -45,
                                textAnchor: 'end',
                                dy: 10,
                            }}
                            axisLine={{ stroke: '#E5E8EB' }}
                        />

                        <YAxis
                            domain={[0, 10]}
                            tick={{ fill: '#8B96A2' }}
                            axisLine={{ stroke: '#E5E8EB' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E5E8EB',
                                borderRadius: '4px',
                            }}
                        />
                        <Bar
                            dataKey="hours"
                            fill="#005A9C"
                            radius={[4, 4, 0, 0]}
                            label={{ position: 'top', fill: '#333', fontSize: 12 }} // Bar üstünde değeri göstermek için
                        />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default DailyWorking;
