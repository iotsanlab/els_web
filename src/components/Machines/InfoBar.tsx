import { useState } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import Dropdown from "../Dropdown";
import { useDarkMode } from "../../context/DarkModeContext";
import { useTranslation } from 'react-i18next';

type TimeData = {
  totalWorkTime: number ;
  oldWorkTime: number;
  fuelUsed: number;
  fuelRate: number;
  rolantiWork: number;
  oldRolanti: number;
};

type InfoBarProps = {
  weeklyData: TimeData;
  monthlyData: TimeData;
};

const formatNumber = (value: number | undefined | null): string => {
  return typeof value === "number" && !isNaN(value) ? value.toFixed(2) : "-";
};

const InfoBar = ({ weeklyData, monthlyData }: InfoBarProps) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const options = [t("global.weekly"), t("global.monthly")];

  const { isDarkMode } = useDarkMode();

  const handleChange = (index: number, value: string) => {
    setSelectedOption(index);
    console.log(`Seçilen seçenek: ${value} ${index}`);
  };

  const data = selectedOption === 0 ? weeklyData : monthlyData;

 const convertToHourMinute = (hours: number | undefined | null): string => {
  if (typeof hours !== "number" || isNaN(hours)) return "-";
  const fullHours = Math.floor(hours);
  const minutes = Math.round((hours - fullHours) * 60);
  return `${fullHours} ${t("global.h")} ${minutes} ${t("global.min")}`;
};

  const isWorkTimeIncrease =
    (selectedOption === 0 && weeklyData.totalWorkTime > weeklyData.oldWorkTime) ||
    (selectedOption === 1 && monthlyData.totalWorkTime > monthlyData.oldWorkTime);

  const isIdleDecrease =
    (selectedOption === 0 && weeklyData.rolantiWork < weeklyData.oldRolanti) ||
    (selectedOption === 1 && monthlyData.rolantiWork < monthlyData.oldRolanti);

  const isFuelIncrease =
    (selectedOption === 0 && weeklyData.fuelUsed > weeklyData.fuelRate) ||
    (selectedOption === 1 && monthlyData.fuelUsed > monthlyData.fuelRate);

  return (
    <div className="flex w-full h-20 pt-2 pb-2 pl-5 pr-5 bg-white rounded-[10px] drop-shadow-[2px_2px_4px_#00000026] dark:bg-gray10">
      <div className="flex items-center justify-start w-full h-full mr-2 ">
        <SvgIcons iconName="Clock" fill={isDarkMode ? '#fff' : '#28333E'} />
        <div className="flex flex-col ">
          <span className="text-xs 2xl:text-xs  font-medium text-gray4 dark:text-gray7 font-inter">
            {t("generalMachinesPage.firstWidget.totalWork")}
          </span>
          <div className="flex items-center">
            <span className="text-gray10 font-inter font-bold text-base 2xl:text-base lg:text-[14px] mr-1 dark:text-white truncate">{convertToHourMinute(data.totalWorkTime)}</span>
            <SvgIcons iconName={isWorkTimeIncrease ? "UpRate" : "DownRate"} fill={isWorkTimeIncrease ? "#5EB044" : "#E84747"} />
            <span className="text-gray4 font-inter font-medium text-base 2xl:text-base lg:text-[14px] ml-1 dark:text-gray7 truncate">({convertToHourMinute(data.oldWorkTime)})</span>
          </div>
        </div>
      </div>

     

      <div className="flex items-center justify-start w-full h-full mr-2">
        <SvgIcons iconName="Energy" fill={isDarkMode ? '#fff' : '#28333E'} />
        <div className="flex flex-col ">
          <span className="text-xs font-medium text-gray4 dark:text-gray7 font-inter ">
            {t("generalMachinesPage.firstWidget.fuel")}
          </span>
          <div className="inline-flex items-center">
            <span className="text-gray10 font-inter font-bold text-base 2xl:text-base lg:text-[14px] mr-1 dark:text-white truncate">{formatNumber(data.fuelUsed)} {t("global.kWh/s")}</span>
            <SvgIcons iconName={isFuelIncrease ? "UpRate" : "DownRate"} fill={isFuelIncrease ? "#E84747" : "#5EB044"} />
            <span className="text-gray4 font-inter font-medium text-base 2xl:text-base lg:text-[14px] ml-1 dark:text-gray7 truncate">({formatNumber(data.fuelRate)} {t("global.kWh/s")})</span>
          </div>
        </div>
      </div>

      <div className="w-[40%]  items-center flex justify-end pb-2">
        <Dropdown
          options={options}
          selectedIndex={selectedOption}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default InfoBar;
