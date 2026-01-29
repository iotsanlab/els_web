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

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceAttributes, setDeviceAttributes] = useState<Record<string, string>>({}); // Attribute'leri saklayan state
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, string>>({});

  const getTimestamp = (daysAgo, endOfDay = false) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, 999);
    return date.getTime();
  };
  
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

      setDeviceAttributes(formattedAttributes);
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
    { title: "Terminal Status ", desc: deviceTelemetry.stat == "0" ? "Offline" : "Online" },
    { title: "Device Signal", desc: "", isPercentage: true, percentageValue: 60 },
    { title: "Total Working Hours (h)", desc: parseFloat(deviceTelemetry.WorkingHours).toFixed(1) },
    { title: "Cumulative Charge (kWh)", desc: "320" },
    { title: "Charging Cycle (qty) ", desc: "230" },
    { title: "Remaining Charging Cycle (qty)", desc: "230" },
    { title: "Ave. Daily Working Hours in the month (h)", desc: "230" },
    { title: "Accumulated Working Hours in the month (h)", desc: "230" }
  ];

  useEffect(() => {
    console.log("telemetsry -> ", JSON.stringify(deviceTelemetry.PlatformMODE))
  }, [deviceTelemetry]);



  return (
    <div className="flex h-full">
      {/* Sol taraf - InfoMenu */}
      <div className="flex-shrink-0">
        <InfoMenu
          serialNo={"1234-1234-1234"}
          title={"Manlift ELS-1"}
          totalHours={"1925 sa"}
          operator={"Burak DİLAVEROĞLU"}
          lock={true}
          avgFuel={"5.3 Lt / sa"}
          instantFuel={"4.5 Lt / sa"}
          trip={"25 Lt / 4 sa 45 dk"}
          defAmount={"%70 200 Lt"}
          hydraulicPressure={""}
          hydOilHeat={""}
          engineWaterHeat={""}
          saseNo="94310549368"
          type={MachineType.EXCAVATOR}
          warningCodes={warningList}
          model="A515"
          imei={deviceAttributes.Imei}
        />
      </div>

      
      
     
   
    {/* 
     
      <div className="bg-gray-300 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Cihaz Bilgileri</h3>
        <ul>
          {Object.entries(deviceAttributes).map(([key, value]) => (
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
              <GeneralTitle title="System Dashboard" />

              <div className="flex items-center justify-between mt-2">
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <DashboardCard title="System Dashboard" items={items} />
                </div>
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <BatteryHealth val1="96.40" val2="98" />
                </div>
                <div className="bg-gray-300 h-[500px] w-[calc(33.333%_-_1.5rem)] flex items-center justify-center">
                  <WeighLoad value={48} desc1="Platform" desc2="3''" desc3="0 mph" />
                </div>
              </div>
            </div>



            <div className="flex flex-col w-full">
              <GeneralTitle title="Charts" />
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
