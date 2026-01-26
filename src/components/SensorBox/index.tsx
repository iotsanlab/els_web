import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import LineChart from "../LineChart";
import RadialChart from "../RadialChart";
import { useTranslation } from "react-i18next";
//
import React, { useEffect, useMemo, useRef, useState } from "react";
//

interface ChartCardProps {
  chartType?: "empty" | "radial" | "linear" | "boolean";
  type: "fuel" | "service" | "add" | "temperature";
  title?: string;
  value?: number;
  valueTitle?: string;
  valueSubTitle?: string;
  minValue?: number;
  maxValue?: number;
  lastUpdateTime?: string;
  onClick?: () => void;
  onClickInfo?: () => void;
}

const SensorBox: React.FC<ChartCardProps> = ({
  chartType = "empty",
  type,
  title,
  value,
  maxValue,
  minValue,
  lastUpdateTime,
  valueTitle,
  valueSubTitle,
  onClick,
  onClickInfo,
}) => {
  const { isDarkMode } = useDarkMode();

  const { t } = useTranslation();

  const memoizedRender = useMemo(() => {
    return (
      <Render
        chartType={chartType}
        value={value}
        valueTitle={valueTitle}
        valueSubTitle={valueSubTitle}
        maxValue={maxValue}
        minValue={minValue}
        title={title}
        lastUpdateTime={lastUpdateTime}
      />
    );
  }, [
    chartType,
    value,
    valueTitle,
    valueSubTitle,
    maxValue,
    minValue,
    title,
    lastUpdateTime,
  ]);

  const renderIcon = (type: "fuel" | "service" | "add" | "temperature") => {
    const svgRender: Record<string, () => JSX.Element | null> = {
      fuel: () => (
        <SvgIcons
          iconName="FuelLarge"
          className="w-[24px] h-[24px]"
          fill={isDarkMode ? "#5D6974" : "#CBD1D7"}
        />
      ),
      service: () => (
        <SvgIcons
          iconName="Services"
          className="w-[24px] h-[24px]"
          fill={isDarkMode ? "#5D6974" : "#CBD1D7"}
        />
      ),
      add: () => (
        <SvgIcons
          iconName="Add"
          className="w-[24px] h-[24px]"
          fill={isDarkMode ? "#5D6974" : "#CBD1D7"}
        />
      ),
      temperature: () => (
        <SvgIcons
          iconName="Temperature"
          className="w-[24px] h-[24px]"
          fill={isDarkMode ? "#5D6974" : "#CBD1D7"}
        />
      ),
      default: () => null,
    };

    return (svgRender[type] || svgRender["default"])();
  };

  return (
    <div
      className="rounded-[10px] bg-white dark:bg-gray10  h-[200px] drop-shadow-[2px_2px_4px_#00000026] relative overflow-hidden w-full 4xl:min-h-[250px]  3xl:min-h-[215px]  max-h-[200px]"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 m-3">{renderIcon(type)}</div>
      {
        type !== "add" && (
          <div
            className="absolute top-0 right-0 m-3 cursor-pointer z-[100]"
            onClick={(e) => {
              e.stopPropagation();
              onClickInfo?.();
            }}
          >
            <SvgIcons
              iconName="Info"
              className="w-[24px] h-[24px]"
              fill={isDarkMode ? "#5D6974" : "#CBD1D7"}
            />
          </div>
        )
      }
      <div className="flex flex-col items-center justify-center w-full h-full font-sans">
        {type !== "add" && (
          <div className="flex flex-col items-center justify-center w-full h-full ">
            <div className="flex flex-col items-center justify-center w-full h-full ">
              {memoizedRender}
            </div>
          </div>
        )}

        {type === "add" && (
          <div className="flex flex-col items-center justify-start w-full h-full pt-[50px] cursor-pointer">
            <SvgIcons
              iconName="Plus"
              fill={isDarkMode ? "#5D6974" : "#CBD1D7"}
            />
            <p className="text-[14px] font-bold font-arial leading-normal tracking-wide text-gray3 dark:text-gray8 pt-[30px] ">
              {t("machineInfoPage.infoWidget.add")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface Props {
  chartType?: "empty" | "radial" | "linear" | "boolean";
  value?: number;
  valueTitle?: string;
  valueSubTitle?: string;
  minValue?: number;
  maxValue?: number;
  lastUpdateTime?: string;
  title?: string;
}

const Render: React.FC<Props> = ({
  chartType = "empty",
  value,
  valueTitle,
  valueSubTitle,
  maxValue,
  minValue,
  title,
  lastUpdateTime,
}) => {
  const { t } = useTranslation();

  const [displayValue, setDisplayValue] = useState(value);
  const [timestamp, setTimestamp] = useState(lastUpdateTime);
  const prevValueRef = useRef(value);
  const prevTimeRef = useRef(lastUpdateTime);

  useEffect(() => {
    if (
      prevValueRef.current !== value ||
      prevTimeRef.current !== lastUpdateTime
    ) {
      setDisplayValue(value);
      setTimestamp(lastUpdateTime);
      prevValueRef.current = value;
      prevTimeRef.current = lastUpdateTime;
    }
  }, [value, lastUpdateTime]);

  if (chartType === "empty") {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full ">
          <p className="text-[48px] font-bold leading-normal tracking-wide text-gray10 dark:text-white ">
            {t(displayValue?.toString() || "0")}
          </p>
          <p className="text-[16px] font-bold leading-normal tracking-wide text-gray10 dark:text-white  ">
            {valueTitle}
          </p>
          <p className="text-[12px] font-medium leading-normal tracking-wide text-gray3 dark:text-gray8  ">
            {valueSubTitle}
          </p>
        </div>
        <div className="flex flex-col font-sans text-center">
          <p className="text-[12px] font-bold  leading-normal tracking-wide text-gray10 dark:text-gray2 ">
            {title}
          </p>
          <p className="text-[12px] font-medium leading-normal tracking-wide text-gray3  mb-1">
            {t("machineInfoPage.infoWidget.past", { time: timestamp })}
          </p>
        </div>
      </>
    );
  }

  if (chartType === "linear") {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full ">
          <div className="flex items-center justify-center w-full mt-5 ">
            <div className="flex items-center justify-center ">
              <LineChart
                value={displayValue}
                maxValue={maxValue}
                minValue={minValue}
              />
            </div>
            <div className="flex flex-col items-start justify-between h-full font-sans ">
              <span className="text-xs font-normal text-gray2 dark:text-gray8">
                {maxValue} {valueTitle} max
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-4xl font-bold text-gray10 dark:text-white">
                  {displayValue} {valueTitle}
                </span>
              </div>
              <span className="text-xs font-normal text-gray2 dark:text-gray8">
                {minValue} {valueTitle} min
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-sans text-center">
          <p className="text-[12px] font-bold  leading-normal tracking-wide text-gray10 dark:text-gray2 ">
            {title}
          </p>
          <p className="text-[12px] font-medium leading-normal tracking-wide text-gray3  mb-1">
            {t("machineInfoPage.infoWidget.past", { time: timestamp })}
          </p>
        </div>
      </>
    );
  }

  if (chartType === "radial") {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full ">
          <div className="flex flex-col items-center justify-center w-full ">
            <RadialChart
              value={displayValue}
              maxValue={maxValue}
              minValue={minValue}
            />

            <div className="flex flex-col items-center justify-center w-full mt-[-25px]">
              <span className="font-sans text-4xl font-bold text-gray10 dark:text-white">
                {displayValue} {valueTitle}
              </span>
              <span className="text-[10px] font-normal text-gray2">
                {maxValue} {valueTitle} max
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-sans text-center">
          <p className="text-[12px] font-bold  leading-normal tracking-wide text-gray10 dark:text-gray2 ">
            {title}
          </p>
          <p className="text-[12px] font-medium leading-normal tracking-wide text-gray3  mb-1">
            {t("machineInfoPage.infoWidget.past", { time: timestamp })}
          </p>
        </div>
      </>
    );
  }
  if (chartType === "boolean") {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full ">
          <p className="text-[48px] font-bold leading-normal tracking-wide text-gray10 dark:text-white ">
            {displayValue == 0 ? "OFF" : "ON"}
          </p>
          <p className="text-[16px] font-bold leading-normal tracking-wide text-gray10 dark:text-white  ">
            {valueTitle}
          </p>
          <p className="text-[12px] font-medium leading-normal tracking-wide text-gray3 dark:text-gray8  ">
            {valueSubTitle}
          </p>
        </div>
        <div className="flex flex-col font-sans text-center">
          <p className="text-[12px] font-bold  leading-normal tracking-wide text-gray10 dark:text-gray2 ">
            {title}
          </p>
          <p className="text-[12px] font-medium leading-normal tracking-wide text-gray3  mb-1">
            {t("machineInfoPage.infoWidget.past", { time: timestamp })}
          </p>
        </div>
      </>
    );
  }
};

export default SensorBox;
