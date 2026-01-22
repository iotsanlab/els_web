import { useState, useEffect, useCallback } from "react";
import WarningSearchArea from "../../components/Warning/WarningSearchBar";
import GeneralTitle from "../../components/Title/GeneralTitle";
import WarningList from "../../components/Warning/WarningList";
import { useTranslation } from 'react-i18next';
import { getDevices } from "../../services/devices";
import { observer } from "mobx-react";
import deviceWorkStore from "../../store/DeviceTelemetry";
import deviceAttributes from "../../store/DeviceAttributes";
import { useNotification } from "../../hooks/useNotification";
import { NotificationData } from "../../data/NotificationData";
import i18n from "../../context/i18n";
import { getValuesTimeSeries } from "../../services/telemetry";


interface Alert {
  deviceId: string;
  deviceName: string;
  key: string;
  ts: number;
  details: any;
  SPN: number;
  FMI: number;
  Hours: number;
  TotalWorkingHours?: number;
}

interface Warnings {
  warning_name_2: string;
  warning_type: string;
  warning_code: string;
  warning_date: string;
  description: string;
  source: string;
}

interface MachineProps {
  type: string;
  serialNo: string;
  model: string;
  warnings: Warnings[];
  fuel_level: string;
  totalWorkingHours: number;
  remaining_for_service: string;
  location: string;
  lat: number;
  long: number;
}

const WarningPage = observer(() => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [machineList, setMachineList] = useState<MachineProps[]>([]);
  const [filteredList, setFilteredList] = useState<MachineProps[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { alarms, isLoading: alarmsLoading } = useNotification({ pageSize: 500});
  


  const fetchAllDeviceAlerts = async () => {
    try {
        const response = await getDevices();

      // Device'ları filtrele - sadece label'ı olan cihazlar
      response.data.filter((item: any) => item.label && item.label.trim() !== "");

      const allAlerts: Alert[] = [];

      const filterAlarms = alarms.filter((alarm) => (Number(alarm.alarmTypeId) <= 14 && Number(alarm.alarmTypeId) >= 7));

      // alarm.timestamp, bu zaman ile şimdiki zaman arasında gün saat farkını al

      console.log(filterAlarms, 'filterAlarms');
      
      

      for (const alarm of filterAlarms) {

        console.log(filterAlarms, 'alarm');

        const totalWorkingHours = await getValuesTimeSeries("DEVICE", alarm.deviceId, ["EngineTotalHours"]);
        console.log(totalWorkingHours, 'totalWorkingHours');;

        const hours = totalWorkingHours?.["EngineTotalHours"]?.at(-1)?.value;



        allAlerts.push({
          deviceId: alarm.deviceId,
          deviceName: alarm.deviceId,
          key: alarm.details?.src as string,
          ts: alarm.timestamp,
          details: alarm.details,
          SPN: alarm?.details?.spn as number,
          FMI: alarm?.details?.fmi as number,
          Hours: alarm?.details?.hrs as number,
          TotalWorkingHours: hours as number,
        });
      }

      console.log(filterAlarms, 'filterAlarms');

      setAlerts(allAlerts);
    } catch (error) {
      console.error("Alarm verileri alınırken hata:", error);
    }
  };

  const transformAlertsToMachines = useCallback((alerts: Alert[]): MachineProps[] => {
    const deviceMap = new Map<string, MachineProps>();


    alerts.forEach((alert) => {
      if (!deviceMap.has(alert.deviceId)) {
        const getAttr = (key: string) => {
          const attrs = deviceAttributes.getAttributesById(alert.deviceId);
          return attrs?.find((a: any) => a.key === key)?.value ?? "";
        };

        deviceMap.set(alert.deviceId, {
          type: getAttr("Type"),
          subtype: getAttr("Subtype"),
          serialNo: getAttr("SeriNo"),
          model: getAttr("Model"),
          warnings: [],
          fuel_level: "N/A", // Yakıt seviyesi bilgisi yok
          totalWorkingHours: alert.TotalWorkingHours as number || 0, // undefined durumu için fallback
          remaining_for_service: "N/A", // Servis kalan süre bilgisi yok
          location: deviceWorkStore.getCity(alert.deviceId) || "Türkiye",
          lat: parseFloat(deviceWorkStore.getTelemetry(alert.deviceId, "latitude").at(-1)?.value?.toString() || "0"),
          long: parseFloat(deviceWorkStore.getTelemetry(alert.deviceId, "longitude").at(-1)?.value?.toString() || "0"),
        });
      }

      const machine = deviceMap.get(alert.deviceId)!;

      if (alert.SPN === 0 && alert.FMI === 0) return;

      let source = "System";
      if (/^Eng\d+$/i.test(alert.key)) {
        source = `Engine ${alert.key.replace("Eng", "")}`;
      } else if (/^Gear\d+$/i.test(alert.key)) {
        source = `Gear ${alert.key.replace("Gear", "")}`;
      } else {
        source = alert.details?.src as string;
      }

      // Hours undefined kontrolü ekleyin
      const hours = alert.Hours ?? 0;

      let description = "";

      // dil göre warning name al
      if (i18n.language === "en") {
        description = NotificationData.find((item) => item.id === alert.details?.id)?.name_en || "-";
        } else {
        description = NotificationData.find((item) => item.id === alert.details?.id)?.name_tr || "-";
      }

      machine.warnings.push({
        warning_name_2: `${alert.key}`,
        warning_type: `SPN - FMI`,
        warning_code: `${alert.SPN} - ${alert.FMI}`,
        warning_date: `${hours ? Number(hours).toFixed(2)+ " " + t("global.h") : "-"}`, // Güvenli toFixed kullanımı
        description: `${description}`,
        source,
      });

      // Hours değeri varsa ve mevcut değerden büyükse güncelle
      if (hours > machine.totalWorkingHours) {
        machine.totalWorkingHours = hours;
      }
    });

    return Array.from(deviceMap.values()).filter(machine => machine.warnings.length > 0);
  }, [deviceAttributes.all, deviceWorkStore.all, t]);

  const applyFiltersAndSearch = (rawData: MachineProps[], filters: string[], search: string) => {
    const lowerSearch = search.toLowerCase();

    const filtered = rawData.filter(machine => {
      const matchesSearch =
        machine.serialNo.toLowerCase().includes(lowerSearch) ||
        machine.model.toLowerCase().includes(lowerSearch);

      const matchesType = filters.length === 0 || filters.includes(machine.type);

      return matchesSearch && matchesType;
    });

    setFilteredList(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    applyFiltersAndSearch(machineList, selectedFilters, text);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
    applyFiltersAndSearch(machineList, filters, searchText);
  };

  // İlk veri yükleme - sadece alarms hazır olduğunda çalışır
  useEffect(() => {
    if (!alarmsLoading && alarms.length > 0 && !isDataLoaded) {
      fetchAllDeviceAlerts();
    }
  }, [alarmsLoading, alarms, isDataLoaded]);

  // Alarms ve store'lar hazır olduğunda transformation yap
  useEffect(() => {
    if (alerts.length > 0 && deviceAttributes.all.length > 0) {
      const transformedMachines = transformAlertsToMachines(alerts);
      setMachineList(transformedMachines);
      applyFiltersAndSearch(transformedMachines, selectedFilters, searchText);
      setIsDataLoaded(true);
    }
  }, [alerts, deviceAttributes.all, deviceWorkStore.all, transformAlertsToMachines]);

  

  return (
    <div className="flex flex-col overflow-x-auto min-w-[1340px] pr-4 w-full h-full">
      <GeneralTitle title={t("warningPage.title1")} />
      <WarningSearchArea onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
      <div className="h-4"></div>
      <GeneralTitle title={t("warningPage.title2")} />
      <WarningList deviceData={filteredList} />
    </div>
  );
});

export default WarningPage;