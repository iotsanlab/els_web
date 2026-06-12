import React, { useEffect, useState, useCallback } from "react";
import FuelConsumptionChart from "../ApexChart/FuelConsumptionChart";
import Dropdown from "../Dropdown";
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react-lite";
import deviceWorkStore from "../../store/DeviceTelemetry";

interface StatisticsSwiperProps {
  deviceId: string;
  machineType: string;
}

const StatisticsSwiper: React.FC<StatisticsSwiperProps> = ({ deviceId, machineType }) => {
  const { t } = useTranslation();

  const [fuelDropdown, setFuelDropdown] = useState<number>(0);
  const [workingTimeDropdown, setWorkingTimeDropdown] = useState<number>(0);
  const [showFuelAverageLine, setShowFuelAverageLine] = useState<boolean>(true);
  const [showWorkingAverageLine, setShowWorkingAverageLine] = useState<boolean>(true);

  const [fuelSeries, setFuelSeries] = useState<any[]>([]);
  const [fuelDays, setFuelDays] = useState<string[]>([]);
  const [workingSeries, setWorkingSeries] = useState<any[]>([]);
  const [workingDays, setWorkingDays] = useState<string[]>([]);

  const formatDate = useCallback((ts: number) => {
    const date = new Date(ts);
    const day = date.getDate();
    const weekdays = [
      t("global.weekly_days.paz"),
      t("global.weekly_days.pzt"),
      t("global.weekly_days.sal"),
      t("global.weekly_days.çar"),
      t("global.weekly_days.per"),
      t("global.weekly_days.cum"),
      t("global.weekly_days.cmt")
    ];
    return `${day} ${weekdays[date.getDay()]}`;
  }, [t]);

  // Tutarlı yerel tarih key'ı oluştur (toISOString UTC'ye çevirir, timezone kayması yapar)
  const toLocalDateKey = useCallback((ts: number) => {
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const processFuelTelemetry = useCallback((dayCount: number) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const fromTime = startOfToday - (dayCount - 1) * 24 * 60 * 60 * 1000;
    const endTime = startOfToday + 24 * 60 * 60 * 1000 - 1; // Bugünün sonu

    const fuel = deviceWorkStore.getTelemetry(deviceId, "DailyEnergyConsumption")
      .filter(entry => entry.ts >= fromTime);

    const dateMap: Record<string, number> = {};
    for (const entry of fuel) {
      const key = toLocalDateKey(entry.ts);
      dateMap[key] = (dateMap[key] ?? 0) + entry.value;
    }

    const resultDates: string[] = [];
    const rawValues: number[] = [];

    const start = new Date(fromTime);
    const end = new Date(startOfToday);

    // rawValues oluşturuluyor
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      const key = toLocalDateKey(dt.getTime());
      const ts = dt.getTime();
      resultDates.push(formatDate(ts));

      const value = dateMap[key] ?? 0;
      rawValues.push(Number(value.toFixed(1)));
    }

    // max değeri 0.1'e sabitle
    const max = Math.max(0.1, ...rawValues);
    const displayValues = rawValues.map(val => val === 0 ? (max > 10 ? max * 0.1 : 2) : val);


    const colors = rawValues.map(val => val === 0 ? "#ddd" : "#FFA600"); // Gri veya turuncu


    setFuelSeries([{
      name: t("machineInfoPage.chart.fuel"),
      data: displayValues.map((v, i) => ({
        x: resultDates[i],
        y: v,
        fillColor: colors[i],
        actualValue: rawValues[i] // Tooltip için orijinal değer
      })),
      color: "#FFA600"

    }]);
    setFuelDays(resultDates);
  }, [deviceId, formatDate, toLocalDateKey, t]);


  const processWorkingTelemetry = useCallback((dayCount: number) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const fromTime = startOfToday - (dayCount - 1) * 24 * 60 * 60 * 1000;
    const endTime = startOfToday + 24 * 60 * 60 * 1000 - 1; // Bugünün sonu

    const idle = deviceWorkStore.getTelemetry(deviceId, "DailyIdleHours").filter(entry => entry.ts >= fromTime);
    const total = deviceWorkStore.getTelemetry(deviceId, "DailyWorkingHours").filter(entry => entry.ts >= fromTime);



    const dateMap: Record<string, {
      ts: number;
      idle?: number;
      total?: number;
      eco?: number;
      std?: number;
      power?: number;
      powerplus?: number;
    }> = {};

    const accumulate = (arr: typeof idle, key: keyof typeof dateMap[string]) => {
      for (const entry of arr) {
        const dKey = toLocalDateKey(entry.ts);
        dateMap[dKey] = {
          ...dateMap[dKey],
          ts: entry.ts,
          [key]: (dateMap[dKey]?.[key] ?? 0) + entry.value
        };
      }
    };

    accumulate(idle, "idle");
    accumulate(total, "total");


    const resultDates: string[] = [];
    const rawData: Record<string, number[]> = {
      total: [],
      idle: [],
    };

    const totalPerDay: number[] = [];

    for (let ts = fromTime; ts <= endTime; ts += 24 * 60 * 60 * 1000) {
      const key = toLocalDateKey(ts);
      const formatted = formatDate(ts);
      resultDates.push(formatted);

      const d = dateMap[key] ?? {};

      const idleVal = Number((d.idle ?? 0).toFixed(2));
      const totalVal = Number((d.total ?? 0).toFixed(2));

      rawData.idle.push(idleVal);
      rawData.total.push(totalVal);

      const dailySum = idleVal + totalVal;

      console.log(dailySum, 'dailySum', idleVal, totalVal);
      totalPerDay.push(dailySum);
    }

    const generateSeries = (
      name: string,
      raw: number[],
      color: string,
      index: number
    ) => {
      // max ve displayValues hesaplamalarını map dışına çıkar (performans + doğruluk)
      const maxVal = Math.max(0.1, ...totalPerDay);
      const minBarHeight = maxVal * 0.1; // Her zaman max'ın %10'u

      return {
        name,
        data: raw.map((val, i) => {
          const isEmptyDay = totalPerDay[i] === 0;

          // Sadece ilk seri için mini bar ver (boş günlerde)
          if (isEmptyDay) {
            if (index === 0) {
              return {
                x: resultDates[i],
                y: minBarHeight,
                fillColor: "#ddd",
                actualValue: 0,
              };
            } else {
              return {
                x: resultDates[i],
                y: 0,
                fillColor: "#F8F8F8",
                actualValue: 0,
              };
            }
          }

          // Normal değerli gün
          return {
            x: resultDates[i],
            y: val,
            fillColor: color,
            actualValue: val,
          };
        }),
        color,
      };
    };


    let series = [];

    series = [
      generateSeries(t("machineInfoPage.summaryWidget.labels.std"), rawData.total, "#FFD335", 0)
    ];


    setWorkingSeries(series);
    setWorkingDays(resultDates);
  }, [deviceId, machineType, formatDate, toLocalDateKey, t]);



  useEffect(() => {
    const dayCount = fuelDropdown === 1 ? 30 : 7;
    processFuelTelemetry(dayCount);
  }, [fuelDropdown, deviceId, processFuelTelemetry]);

  useEffect(() => {
    const dayCount = workingTimeDropdown === 1 ? 30 : 7;
    processWorkingTelemetry(dayCount);
  }, [workingTimeDropdown, deviceId, processWorkingTelemetry]);

  const options = [t("global.weekly"), t("global.monthly")];



  return (
    <div className="flex flex-row items-center justify-center w-full h-full px-0 py-3">
      <div className="w-1/2">
        <div className="flex items-end justify-between w-full px-6">
          <h2 className="text-sm font-bold text-gray8 dark:text-gray2">{t("global.fuelGraphTitle")}</h2>
          <Dropdown
            options={options}
            onChange={(val) => setFuelDropdown(val)}
            selectedIndex={fuelDropdown}
          />
        </div>
        <FuelConsumptionChart
          series={fuelSeries}
          days={fuelDays}
          isFuel={true}
          showAverageLine={showFuelAverageLine}
          averageValue={7}
          minIdealValue={6}
          maxIdealValue={7}
          onToggleAverageLine={setShowFuelAverageLine}
        />

      </div>

      <div className="w-1/2">
        <div className="flex items-end justify-between w-full px-6">
          <h2 className="text-sm font-bold text-gray8 dark:text-gray2">{t("global.workingGraphTitle")}</h2>
          <Dropdown
            options={options}
            onChange={(val) => setWorkingTimeDropdown(val)}
            selectedIndex={workingTimeDropdown}
          />
        </div>
        <FuelConsumptionChart
          series={workingSeries}
          days={workingDays}
          isFuel={false}
        />
      </div>
    </div>
  );
};

export default observer(StatisticsSwiper);
