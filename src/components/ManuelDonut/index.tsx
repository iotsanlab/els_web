import Dropdown from "../Dropdown";
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';

interface DonutData {
  activeWorking: string;
  idle: string;
  workingTime: string;
}

interface Props {
  weeklyData: DonutData;
  monthlyData: DonutData;
  onSelectOption?: (option: number) => void;
  selectedOption?: number; // 0: Weekly, 1: Monthly
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  value: string;
  color: string;
}

const ManuelDonut = ({ weeklyData, monthlyData, onSelectOption, selectedOption }: Props) => {
    const {t} = useTranslation();
    const donutRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipData>({
        visible: false,
        x: 0,
        y: 0,
        label: '',
        value: '',
        color: ''
    });

    const options = [t("global.weekly"), t("global.monthly")];

    const handleChange = (index: number, value: string) => {
        onSelectOption?.(index);
        console.log(`Selected option: ${value} ${index}`);
    };

    // Select appropriate data based on the selected option
    const selectedData = selectedOption === 0 ? weeklyData : monthlyData;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!donutRef.current) return;

        const rect = donutRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate distance from center
        const distanceFromCenter = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );

        // Check if mouse is within the donut ring (between inner and outer radius)
        const outerRadius = rect.width / 2;
        const innerRadius = 70; // Inner circle radius

        if (distanceFromCenter < innerRadius || distanceFromCenter > outerRadius) {
            setTooltip(prev => ({ ...prev, visible: false }));
            return;
        }

        // Calculate angle (0 degrees is at top, clockwise)
        let angle = Math.atan2(mouseX - centerX, centerY - mouseY) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const workingTimePercent = parseFloat(selectedData?.workingTime || '0');
        const workingTimeAngle = (workingTimePercent / 100) * 360;

        let label: string;
        let value: string;
        let color: string;

        if (angle <= workingTimeAngle) {
            label = t("global.activeWorking");
            value = `${parseFloat(selectedData.activeWorking).toFixed(2)} ${t("global.h")} (${parseFloat(selectedData.workingTime).toFixed(1)}%)`;
            color = '#005a9c';
        } else {
            label = t("global.idling");
            const idlePercent = 100 - workingTimePercent;
            value = `${parseFloat(selectedData.idle).toFixed(2)} ${t("global.h")} (${idlePercent.toFixed(1)}%)`;
            color = '#B9C2CA';
        }

        setTooltip({
            visible: true,
            x: e.clientX - rect.left + 10,
            y: e.clientY - rect.top - 40,
            label,
            value,
            color
        });
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    return (
        <div className="w-[358px] h-[279px] bg-white dark:bg-gray10">

            <div className="flex justify-between items-center mr-4">
                <p className="text-[16px] font-bold tracking-wide text-gray10 font-inter dark:text-gray6">{t("global.donutTitle")}</p>
                <Dropdown
                        options={options}
                        selectedIndex={selectedOption}
                        onChange={handleChange}
                    />
               
            </div>

            <div className="flex items-center mt-6 justify-center relative">
                    <div
                        ref={donutRef}
                        className="flex w-[200px] h-[200px] rounded-full cursor-pointer transition-all duration-200"
                        style={{
                            background: `conic-gradient(
                                #005a9c ${selectedData?.workingTime}%,
                                #B9C2CA ${selectedData?.workingTime}% 100%
                            )`,
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    ></div>

                    <div className="absolute flex flex-col items-center justify-center w-[140px] h-[140px] bg-white rounded-full dark:bg-gray10 pointer-events-none">
                        <p className="text-gray10 dark:text-white font-['Plus Jakarta Sans'] font-bold text-[40px] font-jakarta tracking-wide">{parseFloat(selectedData.workingTime).toFixed(0)}%</p>
                        <p className="text-gray10 dark:text-white font-['Plus Jakarta Sans'] font-semibold text-[13px] tracking-wide font-jakarta">{t("global.activeWorking")}</p>
                    </div>

                    {/* Tooltip */}
                    {tooltip.visible && (
                        <div
                            className="absolute z-50 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: tooltip.color }}
                                ></div>
                                <span className="font-semibold">{tooltip.label}</span>
                            </div>
                            <div className="mt-1 text-gray-300">{tooltip.value}</div>
                            {/* Tooltip arrow */}
                            <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-800 dark:bg-gray-700 transform -translate-x-1/2 rotate-45"></div>
                        </div>
                    )}
                </div>

         

        </div>
    );
};

export default ManuelDonut;
