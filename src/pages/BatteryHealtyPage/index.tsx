import InfoMenu from "../../components/InfoMenu/InfoMenu";

import DashboardCard from "../../components/HomeComponents/dashboard";
import BatteryHealth from "../../components/HomeComponents/batteryHealth";
import WeighLoad from "../../components/HomeComponents/weighLoad";
import DailyWorking from "../../components/HomeComponents/dailyWorking";
import EnergyConsumptionChart from "../../components/HomeComponents/areaChart";
import ChargingPatternChart from '../../components/HomeComponents/radarChart';
import { getDevices } from "../../services/devices";
import { useEffect, useState } from "react";
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

const warningList = [
  { code: "101", description: "SPN - FMI", details: "4326354-5" },
  { code: "89", description: "SPN - FMI", details: "4326354-5" },
  { code: "77", description: "SPN - FMI", details: "4326354-5" },
  { code: "408", description: "SPN - FMI", details: "4326354-5" }
];


interface Device {
  id: { id: string };
  name: string;
  type: string;
  label: string;
  createdTime: number;
}

const BatteryHealtyPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
  const [devices, setDevices] = useState<Device[]>([]);
  const [vehicleID, setVehicleID] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedDeviceAttributes, setFetchedDeviceAttributes] = useState<Record<string, string>>({}); // Attribute'leri saklayan state
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, string>>({});
  const [vehicle, setVehicle] = useState<any>();


  const { alarms: vehicleAlarms, isLoading: isVehicleAlarmsLoading } = useNotification({
    autoRefresh: true,
    pageSize: 100,
    deviceId: vehicleID
  });


  const machineList = deviceAttributes.all;

  const getTimestamp = (daysAgo, endOfDay = false) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, 999);
    return date.getTime();
  };

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
  
 useEffect(() => {
  const start = getTimestamp(6, false); // 6 gün önce, günün başlangıcı (00:00:00)
  const end = getTimestamp(0, true);  // Bugünün sonu (23:59:59)
  
  console.log("Start:", start);
  console.log("End:", end);
 },[]);

  const fetchDevices = async () => {
    try {
      const response = await getDevices();
      setDevices(response.data);

      //setDevices(data);
    } catch (err) {
      setError("Veri çekilirken hata oluştu.");
      console.log("error -> ", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);




  const fetchDeviceDetails = async (entityType: string, entityId: string) => {
    try {
      const response = await getValuesAttributes(entityType, entityId, [
        "Brand",
        "Imei",
        "SIM",
        "Tel",
        "Type",
      ]);

      console.log("Fetched Attributes ->", response);

      // API yanıtını key-value formatına çevirip kaydedelim
      const formattedAttributes = response.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      setFetchedDeviceAttributes(formattedAttributes);
    } catch (error) {
      console.error(`Error fetching details for device ${entityId}:`, error);
    }
  };

  const fetchDeviceTelemetry = async (entityType: string, entityId: string) => {
    try {
      const response = await getValuesTimeSeries(entityType, entityId, [
        "AlarmCoding",
        "Ampere",
        "BatteryLevel",
        "ChargerNODE",
        "ChargingPhase",
        "Current",
        "DisplayAlarmCode",
        "FlashCode",
        "Load",
        "latitude",
        "longitude",
        "PlatformMODE",
        "stat", //terminal status 0
        "Temperature",
        "TILTY",
        "TILTX",
        "Voltage",
        "WorkingHours",
      ]);

      console.log("Fetched Telemetry Response ->", response);

      // API'den gelen veriyi `key-value` formatına dönüştürelim
      const formattedTelemetry = Object.keys(response).reduce((acc: Record<string, string>, key: string) => {
        const latestData = response[key]?.[0]; // En güncel (ilk) veriyi al
        if (latestData) {
          acc[key] = latestData.value; // Sadece "value" bilgisini al
        }
        return acc;
      }, {});

      console.log("Formatted Telemetry ->", formattedTelemetry);
      setDeviceTelemetry(formattedTelemetry);
    } catch (error) {
      console.error(`Error fetching telemetry for device ${entityId}:`, error);
    }
  };



  useEffect(() => {
    if (devices.length > 0) {
      console.log("Devices[0] ->", devices[0].id.id, devices[0].id.entityType);
      fetchDeviceDetails(devices[0].id.entityType, devices[0].id.id);
      fetchDeviceTelemetry(devices[0].id.entityType, devices[0].id.id);

    }
  }, [devices]); // devices güncellendiğinde tetiklenir



  const items = [
    { title: t("batteryHealthPage.terminalStatus"), desc: deviceTelemetry.stat == "0" ? t("batteryHealthPage.offline") : t("batteryHealthPage.online") },
    { title: t("batteryHealthPage.deviceSignal"), desc: "", isPercentage: true, percentageValue: 60 },
    { title: t("batteryHealthPage.totalWorkingHours"), desc: parseFloat(deviceTelemetry.WorkingHours).toFixed(1) },
    { title: t("batteryHealthPage.cumulativeCharge"), desc: "320" },
    { title: t("batteryHealthPage.chargingCycle"), desc: "230" },
    { title: t("batteryHealthPage.remainingChargingCycle"), desc: "230" },
    { title: t("batteryHealthPage.aveDailyWorkingHours"), desc: "230" },
    { title: t("batteryHealthPage.accumulatedWorkingHours"), desc: "230" }
  ];

  useEffect(() => {
    console.log("telemetsry -> ", JSON.stringify(deviceTelemetry.PlatformMODE))
  }, [deviceTelemetry]);



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
        deviceWarnings={vehicleAlarms.filter((alarm) => alarm.subtype !== "Develon" || alarm.cleared !== true || alarm.acknowledged !== true)} // ✅ Yeni prop
        deviceName={vehicle?.deviceName}
      />


      
      
     
   
    {/* 
     
      <div className="bg-gray-300 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Cihaz Bilgileri</h3>
        <ul>
          {Object.entries(fetchedDeviceAttributes).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-300 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Anlık Cihaz Verileri</h3>
        <ul>
          {Object.entries(deviceTelemetry).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
      
      */}
      
      



      <div className="flex flex-col w-full h-full items-center justify-center">


        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-wrap gap-6 p-6 min-w-[1200px]">
            <div className="flex flex-col w-full">
              <GeneralTitle title={t("batteryHealthPage.systemDashboard")} />

              <div className="flex items-center justify-between mt-2">
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <DashboardCard title={t("batteryHealthPage.systemDashboard")} items={items} />
                </div>
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <BatteryHealth val1="96.40" val2="98" />
                </div>
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <WeighLoad value={48} desc1={t("batteryHealthPage.platform")} desc2="3''" desc3="0 mph" />
                </div>
              </div>
            </div>



            <div className="flex flex-col w-full">
              <GeneralTitle title={t("batteryHealthPage.charts")} />
              <div className="flex items-center justify-between mt-2">

                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <DailyWorking />
                </div>
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <EnergyConsumptionChart />
                </div>
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <ChargingPatternChart />
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
