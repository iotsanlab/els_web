import InfoBar from "../../components/Machines/InfoBar";
import MachineList from "../../components/Machines/MachineList";
import SearchArea from "../../components/Machines/SearchArea";
import GeneralTitle from "../../components/Title/GeneralTitle";
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import GoogleMaps from '../../components/GoogleMaps';
import { ServiceLocation } from '../../components/GoogleMaps/type';
import { useTranslation } from 'react-i18next';
import { observer } from "mobx-react";
import deviceAttributes from "../../store/DeviceAttributes";
import deviceWorkStore from "../../store/DeviceTelemetry";
import machineStore from "../../store/MachineStore";
import deviceWarningStore from "../../store/Warnings";
import { getTimerSetting, getUserId } from "../../services/auth";
import { getValuesTimeSeries } from "../../services/telemetry";
import { getAlarms, getAllAlarms } from "../../services/alarms";
import { alarms } from "../../services/endpoints";
import { useNotification } from "../../hooks/useNotification";

interface Attribute {
  key: string;
  value: any;
}

interface MachineProps {
  attributes: Attribute[];
  type: string;
  serialNo: string;
  model: string;
  active: boolean;
  warnings: number;
  fuel_level: string;
  totalWorkingHours: string;
  remaining_for_service: string;
  location: string;
  id: string;
}

const Vehicles = () => {
  const { t } = useTranslation();

  const [originalDeviceData, setOriginalDeviceData] = useState<MachineProps[]>([]);
  const [deviceData, setDeviceData] = useState<MachineProps[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [deviceStats, setDeviceStats] = useState<Record<string, any>>({});
  const [mapKey, setMapKey] = useState(0); // Map'i force refresh için

  const [timerInterval, setTimerInterval] = useState(1);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const [userID, setUserID] = useState("");
  const [isTimerLoaded, setIsTimerLoaded] = useState(false);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Ref'ler ile state karşılaştırması için
  const prevDeviceStatsRef = useRef<Record<string, any>>({});
  const prevSelectedFiltersRef = useRef<string[]>([]);

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const from7 = now - 7 * oneDay;
  const from14 = now - 14 * oneDay;
  const from30 = now - 30 * oneDay;
  const from60 = now - 60 * oneDay;

  const allowedTypes = selectedFilters.length > 0 ? selectedFilters : [];

  const getTotalFromAttributes = useCallback((attributeKey: string, allowedTypes: string[]): number => {
    if (!deviceAttributes.all || deviceAttributes.all.length === 0) return 0;

    return deviceAttributes.all
      .filter(([_, attrs]) => {
        const type = attrs.find(a => a.key === "Type")?.value;
        return allowedTypes.length === 0 || allowedTypes.includes(type);
      })
      .map(([_, attrs]) => {
        const val = attrs.find(a => a.key === attributeKey)?.value;
        return Number(val || 0);
      })
      .reduce((acc, val) => acc + val, 0);
  }, []);

  // Stat değerini boolean'a çeviren helper fonksiyon - memoized
  const parseActiveStatus = useCallback((statValue: any): boolean => {
    if (statValue === null || statValue === undefined) {
      return false;
    }

    if (typeof statValue === 'string') {
      const numValue = Number(statValue);
      return !isNaN(numValue) && numValue > 0;
    }

    if (typeof statValue === 'number') {
      return statValue > 0;
    }

    if (typeof statValue === 'boolean') {
      return statValue;
    }

    return false;
  }, []);

  const totalWorking7Days = deviceWorkStore.getSummaryBetweenDates("DailyWorkingHours", from7, now, allowedTypes);
  const oldWorking7Days = deviceWorkStore.getSummaryBetweenDates("DailyWorkingHours", from14, from7, allowedTypes);

  const totalFuel7Days = deviceWorkStore.getSummaryBetweenDates("DailyFuelCons", from7, now, allowedTypes);
  const oldFuel7Days = deviceWorkStore.getSummaryBetweenDates("DailyFuelCons", from14, from7, allowedTypes);

  const totalIdle7Days = deviceWorkStore.getSummaryBetweenDates("idleTime", from7, now, allowedTypes);
  const oldIdle7Days = deviceWorkStore.getSummaryBetweenDates("idleTime", from14, from7, allowedTypes);

  const totalWorking30Days = getTotalFromAttributes("last30EngHours", allowedTypes);
  const oldWorking30Days = (getTotalFromAttributes("last60EngHours", allowedTypes) - getTotalFromAttributes("last30EngHours", allowedTypes));

  const totalFuel30Days = getTotalFromAttributes("last30FuelCons", allowedTypes);
  const oldFuel30Days = (getTotalFromAttributes("last60FuelCons", allowedTypes) - getTotalFromAttributes("last30FuelCons", allowedTypes));

  const totalIdle30Days = deviceWorkStore.getSummaryBetweenDates("idleTime", from30, now, allowedTypes);
  const oldIdle30Days = deviceWorkStore.getSummaryBetweenDates("idleTime", from60, from30, allowedTypes);

  const  { alarms } = useNotification({ pageSize: 500});

  // Device data'yı güncelleme - daha stabil hale getirme
  useEffect(() => {
    if (!deviceAttributes.all || deviceAttributes.all.length === 0) return;

    const filterAlarm = alarms.filter((alarm) => Number(alarm.alarmTypeId)>=7 && Number(alarm.alarmTypeId)<=14);

    console.log(filterAlarm, 'filterAlarm',alarms);
  
    const mappedData: MachineProps[] = deviceAttributes.all.map(([id, attrs]) => {
      const getAttr = (key: string) => attrs.find(a => a.key === key)?.value ?? "";
      

      const statValue = deviceStats[id];
      const isActive = parseActiveStatus(statValue);

      const isTeleV2 = getAttr("isTelehandlerV2Image");

      const warningCount = filterAlarm.filter((alarm) => alarm.deviceId == id && alarm.acknowledged !== true).length;

      return {
        attributes: attrs,
        type: getAttr("Type"),
        subtype: getAttr("Subtype"),
        isTelehandlerV2: isTeleV2,
        serialNo: getAttr("SeriNo"),
        model: getAttr("Model"),
        active: isActive,
        warnings: warningCount,
        fuel_level: deviceWorkStore.getTelemetry(id, "FuelLevel").at(-1)?.value?.toString() ?? "",
        totalWorkingHours: deviceWorkStore.getTelemetry(id, "EngineTotalHours").at(-1)?.value ?? "",
        remaining_for_service: getAttr("remainingHoursToMaintenance").toString(),
        location: deviceWorkStore.getCity(id),
        id: id,
        lat: deviceWorkStore.getTelemetry(id, "latitude").at(-1)?.value?.toString(),
        long: deviceWorkStore.getTelemetry(id, "longitude").at(-1)?.value?.toString(),
        deviceName: getAttr("deviceName")
      };
    });

    setOriginalDeviceData(mappedData);
    setDeviceData(mappedData);
    setIsInitialDataLoaded(true);
  }, [deviceAttributes.all, deviceStats, parseActiveStatus]);

  const applyFiltersAndSearch = useCallback((filters: string[], searchText: string) => {
    const lowerSearch = searchText.toLowerCase();

    const filtered = originalDeviceData.filter(machine => {
      const matchesSearch =
        machine.serialNo.toLowerCase().includes(lowerSearch) ||
        machine.model.toLowerCase().includes(lowerSearch);

      const matchesFilter =
        filters.length === 0 || filters.includes(machine.type);

      return matchesSearch && matchesFilter;
    });

    setDeviceData(filtered);
  }, [originalDeviceData]);

  const [searchText, setSearchText] = useState("");

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    applyFiltersAndSearch(selectedFilters, text);
  }, [selectedFilters, applyFiltersAndSearch]);

  const handleFilterChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
    applyFiltersAndSearch(filters, searchText);
    
    // Filter değiştiğinde map'i yeniden render et
    setMapKey(prev => prev + 1);
  }, [searchText, applyFiltersAndSearch]);

  

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserID(id);
      } catch (error) {
        console.error("User ID alınırken hata:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchTimerSetting = async () => {
      if (!userID) return;

      try {
        const timerValue = await getTimerSetting(userID);
        console.log("timer burada ", timerValue);
        if (timerValue !== null) {
          setTimerInterval(timerValue);
          console.log("Timer ayarı alındı:", timerValue);
        }
        setIsTimerLoaded(true);
      } catch (error) {
        console.error("Timer ayarı alınırken hata:", error);
        setTimerInterval(1);
        setIsTimerLoaded(true);
      }
    };

    fetchTimerSetting();
  }, [userID]);

  // Stats fetch etme - daha stabil hale getirme
  useEffect(() => {
    if (!isTimerLoaded || !isAutoRefresh) return;

    const fetchStatsFromAPI = async () => {
      try {
        const machines = machineStore.getAllMachines();
        if (machines.length === 0) return;

        const responses = await Promise.all(
          machines.map(machine =>
            getValuesTimeSeries("DEVICE", machine.id, ["stat"]).then(statData => ({
              id: machine.id,
              value: statData?.stat?.at(-1)?.value
            })).catch(error => {
              console.error(`Stat verisi alınamadı ${machine.id}:`, error);
              return { id: machine.id, value: null };
            })
          )
        );

        const newStats: Record<string, any> = {};
        responses.forEach(({ id, value }) => {
          newStats[id] = value;
        });

        // Deep comparison yaparak gereksiz re-render'ları önle
        const hasChanged = Object.keys(newStats).some(
          key => newStats[key] !== prevDeviceStatsRef.current[key]
        ) || Object.keys(prevDeviceStatsRef.current).length !== Object.keys(newStats).length;

        if (hasChanged) {
          setDeviceStats(newStats);
          prevDeviceStatsRef.current = newStats;
          console.log('📊 Device stats updated:', newStats);
        }
      } catch (error) {
        console.error("Stat verileri alınırken hata:", error);
      }
    };

    fetchStatsFromAPI();
    const interval = setInterval(fetchStatsFromAPI, timerInterval * 1000);
    return () => clearInterval(interval);
  }, [isTimerLoaded, isAutoRefresh, timerInterval]);

  // ServiceLocations - daha stabil ve performanslı hale getirme
  const serviceLocations = useMemo<ServiceLocation[]>(() => {
    if (!isInitialDataLoaded) return [];
    
    const machines = machineStore.getAllMachines();
    if (machines.length === 0) return [];

    console.log('🔄 Recalculating serviceLocations');

    const locations = machines
      .filter(machine => {
        // Geçerli koordinatlara sahip makineleri filtrele
        const hasValidCoords = machine.lat && machine.long && 
                              !isNaN(Number(machine.lat)) && 
                              !isNaN(Number(machine.long));
        
        const matchesFilter = selectedFilters.length === 0 || 
                             selectedFilters.includes(machine.type);
        
        return hasValidCoords && matchesFilter;
      })
      .map(machine => {
        const statValue = deviceStats[machine.id];
        const isActive = parseActiveStatus(statValue);

        return {
          id: machine.id,
          type: machine.subtype === "Develon" ? "Develon" : machine.type || "",
          name: machine.name,
          latitude: Number(machine.lat),
          longitude: Number(machine.long),
          visible: true,
          hours: String(machine.totalWorkingHours || '0'),
          contact: machine.serialNo || '',
          maintenance: machine.model || '',
          operator: machine.user_fullname || '',
          state: isActive,
          deviceName: machine.deviceName || machine.name
        };
      });

    console.log('📍 ServiceLocations created:', locations.length, 'locations');
    return locations;
  }, [
    machineStore.machines, 
    selectedFilters, 
    deviceStats, 
    parseActiveStatus, 
    isInitialDataLoaded
  ]);

  useEffect(() => {
  setMapKey(prev => prev + 1);
}, [serviceLocations]);

  // Map marker click handler
  const handleMapMarkerClick = useCallback((id: number | string) => {
    const clickedDevice = originalDeviceData.find(device => device.id === id);

    if (clickedDevice) {
      const serial = clickedDevice.serialNo;
      handleSearchChange(serial);
    }
  }, [originalDeviceData, handleSearchChange]);

  const handleMapClick = useCallback(() => {
    handleSearchChange("");
  }, [handleSearchChange]);

  // Debug için effect
  useEffect(() => {
    console.log('🗺️ Map will render with:', {
      locationsCount: serviceLocations.length,
      filters: selectedFilters,
      mapKey: mapKey,
      isInitialDataLoaded
    });
  }, [serviceLocations, selectedFilters, mapKey, isInitialDataLoaded]);

  return (
    <div className="flex w-full h-full pb-[20px]">
      <div className="flex flex-col min-w-[1184px] mr-[47px]">
        <GeneralTitle title={t("generalMachinesPage.headers.fleet")} />
        <SearchArea
          searchText={searchText}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
        <div className="h-4" />
{/* 


        <InfoBar
          weeklyData={{
            totalWorkTime: totalWorking7Days,
            oldWorkTime: oldWorking7Days,
            fuelUsed: totalFuel7Days,
            fuelRate: oldFuel7Days,
            rolantiWork: totalIdle7Days / (1000 * 60 * 60),
            oldRolanti: oldIdle7Days / (1000 * 60 * 60),
          }}
          monthlyData={{
            totalWorkTime: totalWorking30Days,
            oldWorkTime: oldWorking30Days,
            fuelUsed: totalFuel30Days,
            fuelRate: oldFuel30Days,
            rolantiWork: totalIdle30Days / (1000 * 60 * 60),
            oldRolanti: oldIdle30Days / (1000 * 60 * 60),
          }}
        />

 */}

         <InfoBar
          weeklyData={{
            totalWorkTime: totalWorking7Days,
            oldWorkTime: oldWorking7Days,
            fuelUsed: totalFuel7Days,
            fuelRate: oldFuel7Days,
            rolantiWork: 9.48,
            oldRolanti: 11.20,
          }}
          monthlyData={{
            totalWorkTime: totalWorking30Days,
            oldWorkTime: oldWorking30Days,
            fuelUsed: totalFuel30Days,
            fuelRate: oldFuel30Days,
            rolantiWork: 49.20,
            oldRolanti: 55.30,
          }}
        />

        <div className="h-4" />
        <MachineList deviceData={deviceData} />
      </div>

      <div className="w-full min-w-[440px]">
        <GeneralTitle title={t("generalMachinesPage.headers.map")} />
        <div className="w-full h-[750px] p-2 bg-white dark:bg-gray10 rounded-[10px] overflow-hidden drop-shadow-[2px_2px_4px_#00000026]">
          {isInitialDataLoaded ? (
            <GoogleMaps
              key={`map-${mapKey}-${serviceLocations.length}`}
              serviceLocations={serviceLocations}
              onMarkerClick={handleMapMarkerClick}
              onClick={handleMapClick}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-gray-500">Loading map...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(Vehicles);