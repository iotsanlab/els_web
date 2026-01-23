import Dropdown from "../Dropdown";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';


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

const ManuelDonut = ({ weeklyData, monthlyData, onSelectOption, selectedOption }: Props) => {
    const {t} = useTranslation();
    const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number; type: 'active' | 'idle' | null }>({
        show: false,
        x: 0,
        y: 0,
        type: null
    });

    const options = [t("global.weekly"), t("global.monthly")];

    const handleChange = (index: number, value: string) => {
        onSelectOption?.(index);
        console.log(`Selected option: ${value} ${index}`);
    };

    // Select appropriate data based on the selected option
    const selectedData = selectedOption === 0 ? weeklyData : monthlyData;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // İç daire kontrolü (tooltip gösterme)
        const distanceFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
        if (distanceFromCenter < 70) {
            setTooltip({ show: false, x: 0, y: 0, type: null });
            return;
        }
        
        // Açıyı hesapla (saat 12 yönünden başlayarak saat yönünde)
        const angle = Math.atan2(mouseX - centerX, centerY - mouseY);
        const degrees = ((angle * 180 / Math.PI) + 360) % 360;
        
        // Hangi dilimde olduğunu belirle
        const workingPercent = parseFloat(selectedData.workingTime);
        const workingDegrees = (workingPercent / 100) * 360;
        
        const type = degrees <= workingDegrees ? 'active' : 'idle';
        
        setTooltip({
            show: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            type
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ show: false, x: 0, y: 0, type: null });
    };

    const getTooltipContent = () => {
        if (tooltip.type === 'active') {
            return {
                label: t("global.activeWorkingTitle"),
                value: `${parseFloat(selectedData.activeWorking).toFixed(2)} ${t("global.h")}`,
                percent: `${parseFloat(selectedData.workingTime).toFixed(1)}%`,
                color: '#005a9c'
            };
        }
        return {
            label: t("global.idlingTitle"),
            value: `${parseFloat(selectedData.idle).toFixed(2)} ${t("global.h")}`,
            percent: `${(100 - parseFloat(selectedData.workingTime)).toFixed(1)}%`,
            color: '#B9C2CA'
        };
    };

    return (
        <div className="w-[368px] h-[279px] flex items-start justify-start bg-white dark:bg-gray10  ">

            <div className="flex flex-col mr-4">
                <p className="mb-4 text-[16px] font-bold tracking-wide text-gray10 font-inter dark:text-gray6">{t("global.donutTitle")}</p>

                <div className="flex items-center justify-center relative">
                    <div
                        className="flex w-[200px] h-[200px] rounded-full cursor-pointer"
                        style={{
                            background: `conic-gradient(
                                #005a9c ${selectedData?.workingTime}%,  /* Kırmızı alan */
                                #B9C2CA ${selectedData?.workingTime}% 100% /* Mavi alan */
                            )`,
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Tooltip */}
                        {tooltip.show && tooltip.type && (
                            <div 
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    left: tooltip.x,
                                    top: tooltip.y - 85,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <div className="bg-gray10 dark:bg-gray10 text-white px-3 py-2 rounded-lg shadow-lg min-w-[140px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div 
                                            className="w-3 h-3 rounded-full" 
                                            style={{ backgroundColor: getTooltipContent().color }}
                                        />
                                        <span className="text-xs font-semibold">{getTooltipContent().label}</span>
                                    </div>
                                
                                    <div className="text-xs text-gray-300">{getTooltipContent().value}</div>
                                </div>
                                <div 
                                    className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-gray10 dark:bg-gray10 rotate-45"
                                />
                            </div>
                        )}
                    </div>

                    <div className="absolute flex flex-col items-center justify-center w-[140px] h-[140px] bg-white rounded-full dark:bg-gray10 pointer-events-none">
                        <p className="text-gray10 dark:text-white font-['Plus Jakarta Sans'] font-bold text-[40px] font-jakarta tracking-wide">{parseFloat(selectedData.workingTime).toFixed(0)}%</p>
                        <p className="text-gray10 dark:text-white font-['Plus Jakarta Sans'] font-semibold text-[13px] tracking-wide font-jakarta">{t("global.activeWorking")}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-start w-full h-full min-w-32">
                <div className="flex flex-col items-end justify-end w-full mb-4">
                    <Dropdown
                        options={options}
                        selectedIndex={selectedOption}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-start justify-start mt-4">
                    <div className="w-[16px] h-[16px] mr-4 rounded-[10px] bg-mstYellow"></div>

                    <div className="flex flex-col">
                        <p className="text-xs font-bold tracking-wide text-gray10 dark:text-white font-inter">{t("global.activeWorkingTitle")}</p>
                        <p className="text-xs font-medium leading-normal tracking-wide dark:text-white text-gray10 font-inter">
                            ({parseFloat(selectedData.activeWorking).toFixed(2)} {t("global.h")}) 
                        </p>
                    </div>
                </div>

                <div className="flex items-start justify-start mt-2">
                    <div className="w-[16px] h-[16px] mr-4 rounded-[10px] bg-gray4"></div>

                    <div className="flex flex-col ">
                        <p className="text-xs font-bold tracking-wide text-gray10 font-inter dark:text-white ">{t("global.idlingTitle")}</p>
                        <p className="text-xs font-medium leading-normal tracking-wide text-gray10 font-inter dark:text-white">
                            ({parseFloat(selectedData.idle).toFixed(2)} {t("global.h")})
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManuelDonut;
