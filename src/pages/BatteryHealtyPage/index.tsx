import InfoMenu from "../../components/InfoMenu/InfoMenu";

import DashboardCard from "../../components/HomeComponents/dashboard";
import BatteryHealth from "../../components/HomeComponents/batteryHealth";
import WeighLoad from "../../components/HomeComponents/weighLoad";
import DailyWorking from "../../components/HomeComponents/dailyWorking";
import EnergyConsumptionChart from "../../components/HomeComponents/areaChart";
import ChargingPatternChart from '../../components/HomeComponents/radarChart';
import { getDevices } from "../../services/devices";
import { useEffect, useState, useMemo } from "react";
import { getValuesAttributes, getValuesTimeSeries } from "../../services/telemetry";
import GeneralTitle from "../../components/GeneralTitle";
import deviceAttributes from "../../store/DeviceAttributes";
import deviceWorkStore from "../../store/DeviceTelemetry";
import { useParams } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { useTranslation } from "react-i18next";


export enum MachineType {
    AE15 = "AE15",
    EL12 = "EL12",
    VM6 = "VM6",
}

// ELS telemetry key'leri (parametre listesinden)
const ELS_TELEMETRY_KEYS = [
  "AlarmCoding",
  "Ampere",
  "BatteryLevel",
  "ChargerNODE",
  "ChargingPhase",
  "Current",
  "DisplayAlarmCode",
  "FlashCode",
  "Height",
  "Load",
  "latitude",
  "longitude",
  "PlatformMODE",
  "stat",
  "Temperature",
  "TILTY",
  "TILTX",
  "Voltage",
  "WorkingHours",
  "speed",
  "TotalEnergyConsumption",
];

// Günlük ve hesaplanan telemetri key'leri (time series - tarih aralıklı)
const ELS_DAILY_KEYS = [
  "DailyWorkingHours",
  "DailyEnergyConsumption",
  "DailyPlatformHours",
  "DailyGroundHours",
];

// Attribute olarak saklanan değerler
const ELS_ATTRIBUTE_KEYS = [
  "CumulativeCharge",
  "ChargingCycle",
  "RemainingChargingCycle",
  "Brand",
  "Imei",
  "SIM",
  "Tel",
  "Type",
  "Model",
  "Subtype",
  "SeriNo",
  "opName",
  "deviceName",
  "isTelehandlerV2Image",
];

interface Device {
  id: { id: string; entityType: string };
  name: string;
  type: string;
  label: string;
  createdTime: number;
}

const BatteryHealtyPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [vehicleID, setVehicleID] = useState<any>();
  const [vehicle, setVehicle] = useState<any>();
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, any>>({});
  const [deviceDailyData, setDeviceDailyData] = useState<Record<string, any[]>>({});
  const [deviceAttrs, setDeviceAttrs] = useState<Record<string, string>>({});
  const [chargingPatternData, setChargingPatternData] = useState<any[]>([]);

  const { alarms: vehicleAlarms } = useNotification({
    autoRefresh: true,
    pageSize: 100,
    deviceId: vehicleID
  });

  const machineList = deviceAttributes.all;

  const getTimestamp = (daysAgo: number, endOfDay = false) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, 999);
    return date.getTime();
  };

  // Store'dan cihaz bilgilerini al
  useEffect(() => {
    if (!id) return;

    const selectedEntry = machineList.find(([machineId]) => machineId === id);
    if (!selectedEntry) return;

    const [deviceId, attrs] = selectedEntry;

    const getAttr = (key: string) =>
      attrs.find((a: { key: string; value: any }) => a.key === key)?.value ?? "";

    const singleMapped = {
      type: getAttr("Type"),
      SeriNo: getAttr("SeriNo"),
      model: getAttr("Model"),
      isTelehandlerV2Image: getAttr("isTelehandlerV2Image"),
      subtype: getAttr("Subtype"),
      active: deviceWorkStore.getTelemetry(deviceId, "stat").at(-1)?.value,
      instantFuel: deviceWorkStore.getTelemetry(deviceId, "EngFuelRate").at(-1)?.value,
      totalWorkingHours: deviceWorkStore.getTelemetry(deviceId, "WorkingHours").at(-1)?.value,
      totalUsedFuel: deviceWorkStore.getTelemetry(deviceId, "EngTotalFuelUsed").at(-1)?.value,
      id: deviceId,
      opName: getAttr("opName"),
      deviceName: getAttr("deviceName"),
    };

    setVehicle(singleMapped);
    setVehicleID(id);
  }, [id, machineList]);

  // Cihaz telemetri verilerini çek (anlık değerler)
  useEffect(() => {
    if (!id) return;

    const fetchTelemetry = async () => {
      try {
        const response = await getValuesTimeSeries("DEVICE", id, ELS_TELEMETRY_KEYS);

        // Her key için en güncel değeri al
        const formatted: Record<string, any> = {};
        Object.keys(response).forEach((key) => {
          const latestData = response[key]?.[0];
          if (latestData) {
            formatted[key] = latestData.value;
          }
        });

        setDeviceTelemetry(formatted);
      } catch (error) {
        console.error("Telemetry fetch error:", error);
      }
    };

    fetchTelemetry();
  }, [id]);

  // Günlük verileri çek (son 7 gün - time series)
  useEffect(() => {
    if (!id) return;

    const fetchDailyData = async () => {
      try {
        const startDate = getTimestamp(6, false);
        const endDate = getTimestamp(0, true);

        const response = await getValuesTimeSeries(
          "DEVICE", id, ELS_DAILY_KEYS,
          startDate, endDate, true // daily=true → MAX aggregation, 86400000ms interval
        );

        setDeviceDailyData(response);
      } catch (error) {
        console.error("Daily data fetch error:", error);
      }
    };

    fetchDailyData();
  }, [id]);

  // Attribute'leri çek (CumulativeCharge, ChargingCycle vb.)
  useEffect(() => {
    if (!id) return;

    const fetchAttributes = async () => {
      try {
        const response = await getValuesAttributes("DEVICE", id, ELS_ATTRIBUTE_KEYS);

        const formatted = response.reduce(
          (acc: Record<string, string>, item: { key: string; value: string }) => {
            acc[item.key] = item.value;
            return acc;
          }, {}
        );

        setDeviceAttrs(formatted);
      } catch (error) {
        console.error("Attributes fetch error:", error);
      }
    };

    fetchAttributes();
  }, [id]);

  // Şarj deseni verilerini çek
  useEffect(() => {
    if (!id) return;

    const fetchChargingPattern = async () => {
      try {
        const response = await getValuesTimeSeries("DEVICE", id, ["chargingPattern"]);

        if (response?.chargingPattern && response.chargingPattern.length > 0) {
          // chargingPattern verisi varsa parse et
          const patternValue = response.chargingPattern[0]?.value;
          if (patternValue) {
            try {
              const parsed = typeof patternValue === 'string' ? JSON.parse(patternValue) : patternValue;
              if (Array.isArray(parsed)) {
                setChargingPatternData(parsed);
              }
            } catch {
              // JSON parse başarısızsa statik veri kullanılır
            }
          }
        }
      } catch (error) {
        console.error("Charging pattern fetch error:", error);
      }
    };

    fetchChargingPattern();
  }, [id]);

  // ─── Dashboard Card Items ───
  const batteryLevel = deviceTelemetry.BatteryLevel;
  const statValue = deviceTelemetry.stat;
  const workingHours = deviceTelemetry.WorkingHours;
  const rssiValue = deviceTelemetry.RSSI;

  // Attribute'lerden gelen değerler (yoksa statik)
  const cumulativeCharge = deviceAttrs.CumulativeCharge || "320";
  const chargingCycle = deviceAttrs.ChargingCycle || "230";
  const remainingChargingCycle = deviceAttrs.RemainingChargingCycle || "230";

  // Ortalama günlük çalışma hesapla
  const avgDailyWorking = useMemo(() => {
    const daily = deviceDailyData?.DailyWorkingHours;
    if (!daily || daily.length === 0) return "230";
    const total = daily.reduce((sum: number, d: any) => sum + parseFloat(d.value || 0), 0);
    return (total / daily.length).toFixed(1);
  }, [deviceDailyData]);

  const items = [
    {
      title: t("batteryHealthPage.terminalStatus"),
      desc: statValue == null ? "-" : (Number(statValue) === 0 ? t("batteryHealthPage.offline") : t("batteryHealthPage.online"))
    },
    {
      title: t("batteryHealthPage.deviceSignal"),
      desc: "",
      isPercentage: true,
      percentageValue: rssiValue != null ? Number(rssiValue) : 60
    },
    {
      title: t("batteryHealthPage.totalWorkingHours"),
      desc: workingHours != null ? parseFloat(workingHours).toFixed(1) : "-"
    },
    {
      title: t("batteryHealthPage.cumulativeCharge"),
      desc: cumulativeCharge
    },
    {
      title: t("batteryHealthPage.chargingCycle"),
      desc: chargingCycle
    },
    {
      title: t("batteryHealthPage.remainingChargingCycle"),
      desc: remainingChargingCycle
    },
    {
      title: t("batteryHealthPage.aveDailyWorkingHours"),
      desc: avgDailyWorking
    },
    {
      title: t("batteryHealthPage.accumulatedWorkingHours"),
      desc: workingHours != null ? parseFloat(workingHours).toFixed(0) : "230"
    }
  ];

  // ─── BatteryHealth Props ───
  const batterySOC = batteryLevel != null ? parseFloat(batteryLevel).toFixed(2) : "96.40";
  const batteryHealthPercent = batteryLevel != null ? Math.min(100, Math.round(parseFloat(batteryLevel))).toString() : "98";

  // ─── WeighLoad Props ───
  const loadValue = deviceTelemetry.Load != null ? Number(deviceTelemetry.Load) : 48;
  const platformMode = deviceTelemetry.PlatformMODE;
  const heightValue = deviceTelemetry.Height;
  const speedValue = deviceTelemetry.speed;

  const platformModeText = useMemo(() => {
    if (platformMode == null) return t("batteryHealthPage.platform");
    return Number(platformMode) === 1 ? t("batteryHealthPage.platform") : t("batteryHealthPage.ground");
  }, [platformMode, t]);

  const heightText = heightValue != null ? `${parseFloat(heightValue).toFixed(0)}%` : "3''";
  const speedText = speedValue != null ? `${parseFloat(speedValue).toFixed(1)} km/h` : "0 mph";

  // ─── DailyWorking Chart Data ───
  const dailyWorkingChartData = useMemo(() => {
    const daily = deviceDailyData?.DailyWorkingHours;
    if (!daily || daily.length === 0) return undefined; // undefined → component statik veri kullanır

    return daily.map((entry: any) => {
      const date = new Date(entry.ts);
      return {
        date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        hours: parseFloat(parseFloat(entry.value || 0).toFixed(2)),
      };
    }).sort((a: any, b: any) => {
      // Tarihe göre sırala
      const [dA, mA, yA] = a.date.split('.');
      const [dB, mB, yB] = b.date.split('.');
      return new Date(`${yA}-${mA}-${dA}`).getTime() - new Date(`${yB}-${mB}-${dB}`).getTime();
    });
  }, [deviceDailyData]);

  // ─── EnergyConsumption Chart Data ───
  const energyConsumptionChartData = useMemo(() => {
    const daily = deviceDailyData?.DailyEnergyConsumption;
    if (!daily || daily.length === 0) return undefined;

    return daily.map((entry: any) => {
      const date = new Date(entry.ts);
      return {
        date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        value: parseFloat(parseFloat(entry.value || 0).toFixed(2)),
      };
    }).sort((a: any, b: any) => {
      const [dA, mA, yA] = a.date.split('.');
      const [dB, mB, yB] = b.date.split('.');
      return new Date(`${yA}-${mA}-${dA}`).getTime() - new Date(`${yB}-${mB}-${dB}`).getTime();
    });
  }, [deviceDailyData]);

  // ─── ChargingPattern Radar Data ───
  const chargingRadarData = useMemo(() => {
    if (chargingPatternData.length > 0) return chargingPatternData;
    return undefined; // undefined → component statik veri kullanır
  }, [chargingPatternData]);

  return (
    <div className="flex w-full h-full grid-cols-12 overflow-none ">
      {/* Sol taraf - InfoMenu */}
      <InfoMenu
        id={vehicleID}
        deviceId={vehicle?.id}
        serialNo={vehicle?.SeriNo || ""}
        subtype={vehicle?.subtype || ""}
        title={vehicle?.model || ""}
        isTelehandlerV2={vehicle?.isTelehandlerV2Image || false}
        totalHours={
          (vehicle?.totalWorkingHours?.toFixed(2) || "0") + " " + t("global.h")
        }
        operator={vehicle?.opName || "-"}
        avgFuel={
          isNaN(vehicle?.totalUsedFuel / vehicle?.totalWorkingHours)
            ? "-"
            : (vehicle.totalUsedFuel / vehicle.totalWorkingHours).toFixed(2) +
            " " +
            t("global.L/h")
        }
        instantFuel={
          (vehicle?.instantFuel ? vehicle?.instantFuel.toFixed(2) : "-") +
          " " +
          t("global.L/h")
        }
        saseNo={vehicle?.SeriNo || "-"}
        type={vehicle?.type || ""}
        warnings={[]}
        deviceWarnings={vehicleAlarms.filter((alarm) => alarm.subtype !== "Develon" || alarm.cleared !== true || alarm.acknowledged !== true)}
        deviceName={vehicle?.deviceName}
      />

      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-wrap gap-6 p-6 min-w-[1200px]">
            <div className="flex flex-col w-full">
              <GeneralTitle title={t("batteryHealthPage.systemDashboard")} />

              <div className="flex items-center justify-between mt-2 gap-6">
                <div className="h-[500px] w-[calc(33.333%_-_1rem)] flex items-center justify-center">
                  <DashboardCard title={t("batteryHealthPage.systemDashboard")} items={items} />
                </div>
                <div className="h-[500px] w-[calc(33.333%_-_1rem)] flex items-center justify-center">
                  <BatteryHealth val1={batterySOC} val2={batteryHealthPercent} />
                </div>
                <div className="h-[500px] w-[calc(33.333%_-_1rem)] flex items-center justify-center">
                  <WeighLoad
                    value={loadValue}
                    desc1={platformModeText}
                    desc2={heightText}
                    desc3={speedText}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <GeneralTitle title={t("batteryHealthPage.charts")} />
              <div className="flex items-center justify-between mt-2 gap-6">
                <div className="h-[500px] w-[calc(33.333%_-_1rem)] flex items-center justify-center">
                  <DailyWorking data={dailyWorkingChartData} />
                </div>
                <div className="h-[500px] w-[calc(33.333%_-_1rem)] flex items-center justify-center">
                  <EnergyConsumptionChart data={energyConsumptionChartData} />
                </div>
                <div className="h-[500px] w-[calc(33.333%_-_1rem)] flex items-center justify-center">
                  <ChargingPatternChart data={chargingRadarData} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default BatteryHealtyPage;
