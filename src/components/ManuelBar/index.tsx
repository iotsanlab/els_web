import { useEffect, useState } from 'react';
import Dropdown from '../Dropdown';
import { useTranslation } from 'react-i18next';
import NoDataBar from "../../assets/images/noDataBar.png";

interface DataItem {
    value: number;
    dayName: string;
    dayNum: number;
}

interface Props {
    sampleDataWeekly: DataItem[];
    sampleDataMonthly: DataItem[];
    title: string;
    type: "blue" | "orange";
    selectedOption?: number; // 0: Weekly, 1: Monthly
    onSelectOption?: (option: number) => void;
}


const ManualBarChart = ({ sampleDataWeekly, sampleDataMonthly, title, type, onSelectOption, selectedOption }: Props) => {
    const { t } = useTranslation();

    const options = [t("global.weekly"), t("global.monthly")];



    const handleChange = (index: number, value: string) => {

        onSelectOption?.(index);
        console.log(index);
    };

    const data = selectedOption === 0 ? sampleDataWeekly : sampleDataMonthly;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Calculate chart width based on data length


    // Kaydırma başlatma
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(e.currentTarget.scrollLeft);
        e.preventDefault();
    };

    // Kaydırma hareketi
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const x = e.clientX;
        const walk = (x - startX) * 1.5;
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    // Kaydırma bitişi
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const [hoveredBar, setHoveredBar] = useState<number | null>(null); // Hover edilen bar'ı tutacak state


    const handleBarHeight = (data: DataItem[], value: number, type: "blue" | "orange") => {
    const maxContainerHeight = 160; // max bar yüksekliği
    const minBarHeight = 4;        // en küçük bar (görünsün diye)
    
    const values = data.map(item => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    // Değer aralığı sabit değilse, normalize et
    if (maxValue === 0) return minBarHeight;

    // Lineer normalize (0 - 1 arası)
    const normalized = (value - minValue) / (maxValue - minValue);

    // Nihai yükseklik
    const barHeight = minBarHeight + normalized * (maxContainerHeight - minBarHeight);
    
    return Math.round(barHeight);
};

    return (
        <div className='flex flex-col w-[368px] h-[279px] bg-white dark:bg-gray10 items-start justify-between px-[20px]' >
            <div className='flex justify-between w-full'>
                <p className="mb-4 text-[16px] font-bold tracking-wide text-gray10 font-inter dark:text-gray6">{title}</p>
                <Dropdown
                    options={options}
                    selectedIndex={selectedOption}
                    onChange={handleChange}
                />
            </div>

            <div
                className={`flex items-end  h-full justify-start ${data.length > 7 ? 'space-x-[12px]' : 'space-x-[22px]'} w-[328px] dark:bg-transparent overflow-x-auto cursor-grab`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {data.map((item, index) => (
                    <div
                        key={index}
                        className='flex items-end justify-start h-full bg-white dark:bg-gray10'
                        onMouseEnter={() => setHoveredBar(index)} // Hover işlemi
                        onMouseLeave={() => setHoveredBar(null)}  // Hover çıkınca
                    >
                        <div className='flex flex-col items-center justify-end w-full h-full'>


                            <div
                                className={`relative rounded-[4px] 
                                        ${item.value < 0.01 ? 'border-[2px] border-gray2' : 'border-[0px]'} 
                                        ${item.value < 0.01 ? 'bg-gray1' : type === 'blue' ? 'bg-statusBlue' : 'bg-mstYellow'} 
                                        ${selectedOption == 1 ? 'w-4' : 'w-[28px]'}`}
                                style={{
                                    height: `${item.value < 0.01 ? 20 : handleBarHeight(data, item.value, type)}px`,
                                }}

                            >
                                {item.value > 0 &&
                                <span
                                    className="absolute -top-[20px] left-1/2 -translate-x-1/2 text-[12px] font-bold font-inter text-gray10 dark:text-white whitespace-nowrap select-none"
                                >
                                    {item.value < 1 ? item.value.toFixed(1) : item.value.toFixed(0)}
                                </span>}
                                {/* Tooltip: Hover edilince gösterilecek */}
                                {hoveredBar === index && (
                                    <div className={`absolute z-[9999] w-[60px] h-[30px] ${index == data.length - 1 ? "right-[0px]" : ""} ${data.length > 7 ? (index > 2 ? "right-[0px]" : "") : ''} items-center justify-center bg-gray2 text-gray10 text-xs rounded-[10px]`}>
                                        <p className='flex items-center justify-center w-full h-full'>{`${item.value.toFixed(1)} ${type == "blue" ? t("global.lt") : t("global.h")}`}</p>
                                    </div>
                                )}
                            </div>

                            <div className='flex flex-col items-center justify-center mt-2'>
                                <p className='text-xs font-bold text-gray6 font-inter' style={{ userSelect: 'none' }}>{t(`global.weekly_days.${item.dayName}`)}</p>
                                <p className='text-xs font-bold text-gray10 dark:text-white font-inter' style={{ userSelect: 'none' }}>{item.dayNum == 0 ? " " : item.dayNum}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManualBarChart;