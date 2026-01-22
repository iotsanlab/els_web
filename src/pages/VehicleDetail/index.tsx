import { useEffect, useState, useMemo } from "react";
import InfoMenu from "../../components/InfoMenu/InfoMenu";
import { useParams } from "react-router-dom";
import GeneralTitle from "../../components/Title/GeneralTitle";
import StatisticsSwiper from "../../components/Swiper";
import Dropdown from "../../components/Dropdown";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { MachineParameter } from "../../utils/machine";
import TransferModal from "../../components/Modal/TransferModal";
import GoogleMaps from "../../components/GoogleMaps";
import { useTranslation } from "react-i18next";
import deviceAttributes from "../../store/DeviceAttributes";
import deviceWorkStore from "../../store/DeviceTelemetry";
import { observer } from "mobx-react";
import { getValuesTimeSeries } from "../../services/telemetry";
import paramStore from "../../store/ParamStore";
import machineParametersByType from "../../data/MachineParameters";
import { useMachineWarnings } from "../../components/WarningReturnComponent";
import { getUserId, getTimerSetting } from "../../services/auth";
import { useNotification } from "../../hooks/useNotification";
import DraggableSensorGrid from './DraggableSensorGrid';
import { useNavigate } from "react-router-dom";
import ParameterChartModal from "../../components/ParameterChartModal";

type Telemetry = { ts: number; value: number };

type TelemetryData = {
  DailyWorkingHours?: Telemetry[];
  DailyFuelCons?: Telemetry[];
  idleTime?: Telemetry[];
  ECOHOURDaily?: Telemetry[];
  standart?: Telemetry[];
  power?: Telemetry[];
  powerplus?: Telemetry[];
  UreaTankLevel?: Telemetry[];

  status?: Telemetry[];
  lat?: Telemetry[]; // ← eklendi
  long?: Telemetry[]; // ← eklendi
  FuelLevel?: Telemetry[];
};
interface Attribute {
  key: string;
  value: any;
}

interface MachineProps {
  attributes: Attribute[];
  type: string;
  SeriNo: string;
  model: string;
  active: string;
  warnings: Array<any>[];
  fuel_level: string;
  totalWorkingHours: string;
  remaining_for_service: string;
  location: string;
  id: string;
  opName?: string;
  hourlyAverageFuelConsumpiton?: string;
  lat?: number;
  long?: number;
  AveFuelCons?: number;
}

const VehicleDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const machineList = deviceAttributes.all;
  const navigation = useNavigate();

  const [vehicle, setVehicle] = useState<any>();
  const [vehicleID, setVehicleID] = useState<any>();

  const [totalWorkingHours, setTotalWorkingHours] = useState<number>(0);
  const [totalFuelConsumption, setTotalFuelConsumption] = useState<number>(0);

  const [beforeTotalWorkingHours, setBeforeTotalWorkingHours] = useState<number>(0);
  const [beforeTotalFuelConsumption, setBeforeTotalFuelConsumption] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [timerInterval, setTimerInterval] = useState(1);
  const [userID, setUserID] = useState("");
  const [isTimerLoaded, setIsTimerLoaded] = useState(false); // Timer yüklenme durumu

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

  const options = [t("global.weekly"), t("global.monthly")];

  const [parameterLoading, setParameterLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const selectedMac = machineList.find(([machineId]) => machineId === id);

    if (selectedMac) {
      setVehicle(selectedMac); // bu, [id, attributes[]] olacak
      setVehicleID(id);
    }
  }, [id, machineList]);

  useEffect(() => {
    if (!vehicle?.id || !vehicle?.type || !isAutoRefresh) return;

    const fetchLocationFromAPI = async () => {
      try {
        const locationData = await getValuesTimeSeries("DEVICE", vehicle.id, ['latitude', 'longitude']);

        const lat = locationData.latitude?.at(-1)?.value;
        const long = locationData.longitude?.at(-1)?.value;

        if (lat && long) {
          setVehicle(prev => ({
            ...prev,
            lat: parseFloat(lat),
            long: parseFloat(long)
          }));
        }
      } catch (error) {
        console.error("Konum bilgisi alınırken hata:", error);
      }
    };

    fetchLocationFromAPI(); // İlk çağrı

    const interval = setInterval(fetchLocationFromAPI, timerInterval * 1000);

    return () => clearInterval(interval);
  }, [vehicle?.id, vehicle?.type, isAutoRefresh, timerInterval]);


  useEffect(() => {
    if (!id) return;

    const selectedEntry = deviceAttributes.all.find(
      ([deviceId]) => deviceId === id
    );
    if (!selectedEntry) return;

    const [deviceId, attrs] = selectedEntry;

    const getAttr = (key: string) =>
      attrs.find((a) => a.key === key)?.value ?? "";

    const singleMapped: MachineProps = {
      //  attributes: attrs,
      type: getAttr("Type"),
      SeriNo: getAttr("SeriNo"),
      model: getAttr("Model"),
      isTelehandlerV2Image: getAttr("isTelehandlerV2Image"),
      subtype: getAttr("Subtype"),
      active: deviceWorkStore.getTelemetry(deviceId, "stat").at(-1)?.value,
      warnings: [[]],
      instantFuel: deviceWorkStore.getTelemetry(deviceId, "EngFuelRate").at(-1)?.value,
      totalWorkingHours: deviceWorkStore.getTelemetry(deviceId, "EngineTotalHours").at(-1)?.value,
      totalUsedFuel: deviceWorkStore.getTelemetry(deviceId, "EngTotalFuelUsed").at(-1)?.value,
      remaining_for_service: getAttr("remainingHoursToMaintenance").toString(),
      location: deviceWorkStore.getCity(deviceId),
      id: deviceId,
      opName: getAttr("opName"),
      hourlyAverageFuelConsumpiton: getAttr("hourlyAverageFuelConsumpiton"),
      lat: deviceWorkStore.getTelemetry(deviceId, "latitude").at(-1)?.value,
      long: deviceWorkStore.getTelemetry(deviceId, "longitude").at(-1)?.value,
      AveFuelCons: getAttr("AveFuelCons"),
      last30EngHours: getAttr("last30EngHours"),
      last60EngHours: getAttr("last60EngHours"),
      last30FuelCons: getAttr("last30FuelCons"),
      last60FuelCons: getAttr("last60FuelCons"),
      deviceName: getAttr("deviceName"),
      def: getAttr("Type") == "Telehandler" ? deviceWorkStore.getTelemetry(deviceId, "ADBlue").at(-1)?.value : deviceWorkStore.getTelemetry(deviceId, "UreaTankLevel").at(-1)?.value

    };

    setVehicle(singleMapped);
  }, [id, deviceAttributes.all]);

  useEffect(() => {
    if (!id) return;

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const sum = (key: keyof TelemetryData, from: number, to: number) =>
      deviceWorkStore
        .getTelemetry(id, key)
        .filter((e) => e.ts >= from && e.ts < to)
        .reduce((acc, e) => acc + e.value, 0);

    if (selectedOption === 0) {
      // Haftalık
      const from = now - 7 * MS_PER_DAY;
      const beforeFrom = now - 14 * MS_PER_DAY;

      const fuel = sum("DailyFuelCons", from, now);
      const prevFuel = sum("DailyFuelCons", beforeFrom, from);

      const work = sum("DailyWorkingHours", from, now);
      const prevWork = sum("DailyWorkingHours", beforeFrom, from);

      setTotalFuelConsumption(+fuel.toFixed(1));
      setBeforeTotalFuelConsumption(+prevFuel.toFixed(1));
      setTotalWorkingHours(+work.toFixed(1));
      setBeforeTotalWorkingHours(+prevWork.toFixed(1));
    }

    if (selectedOption === 1) {
      const last30working = parseFloat(vehicle.last30EngHours || "0");
      const last60working = parseFloat(vehicle.last60EngHours || "0");
      const prevMonthWorking = last60working - last30working;

      setTotalWorkingHours(+last30working.toFixed(1));
      setBeforeTotalWorkingHours(+prevMonthWorking.toFixed(1));

      const last30fuel = parseFloat(vehicle.last30FuelCons || "0");
      const last60fuel = parseFloat(vehicle.last60FuelCons || "0");
      const prevMonthFuel = last60fuel - last30fuel;

      setTotalFuelConsumption(+last30fuel.toFixed(1));
      setBeforeTotalFuelConsumption(+prevMonthFuel.toFixed(1));

    }
  }, [selectedOption, id]);

  const handleChange = (index: number) => {
    setSelectedOption(index);
  };

  //-- parametreler

  const flattenTelemetryData = (
    data: Record<string, { ts: number; value: any }[]>
  ): Record<string, { value: any; ts: number | null }> => {
    const result: Record<string, { value: any; ts: number | null }> = {};

    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        const lastItem = data[key][data[key].length - 1];
        result[key] = { value: lastItem.value, ts: lastItem.ts };
      } else {
        result[key] = { value: null, ts: null };
      }
    }

    return result;
  };

  // Parametre listesini almak için yardımcı fonksiyon
  const getParameterKeys = (vehicleType: string, subtype?: string): string[] => {
    if (subtype === "USA") {
      return machineParametersByType["USA"]?.map((p) => p.parameter) || [];
    }
    if (subtype === "Develon") {
      return machineParametersByType["Develon"]?.map((p) => p.parameter) || [];
    }
    return machineParametersByType[vehicleType]?.map((p) => p.parameter) || [];
  };

  // Sensor data oluşturmak için yardımcı fonksiyon
  const createSensorBoxData = (
    selectedItems: string[],
    flatData: Record<string, any>,
    vehicleType: string,
    subtype?: string
  ): MachineParameter[] => {
    let parameterList: MachineParameter[] = [];
    if (subtype === "Develon") {
      parameterList = machineParametersByType["Develon"] || [];
    } else if (subtype === "USA") {
      parameterList = machineParametersByType["USA"] || [];
    } else {
      parameterList = machineParametersByType[vehicleType] || [];
    }

    return selectedItems
      .map((item: string) => {
        const parameter = parameterList?.find((p) => p.parameter === item);
        if (!parameter) return null;

        const ts = flatData[item]?.ts;
        const formattedDate = ts
          ? new Date(ts).toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "—";

        return {
          ...parameter,
          value: flatData[item] ?? 0,
          lastUpdateTime: formattedDate,
        };
      })
      .filter(Boolean) as MachineParameter[];
  };

  const fetchData = async () => {
    try {
      setParameterLoading(true);

      // Develon subtype kontrolü ile parametre listesini al
      const allParamKeys = getParameterKeys(vehicle.type, vehicle.subtype);

      if (allParamKeys.length === 0) {
        console.warn("Parametre listesi bulunamadı:", vehicle.type, vehicle.subtype);
        return;
      }

      const response = await getValuesTimeSeries("DEVICE", id, allParamKeys);
      const flatData = flattenTelemetryData(response);
      setTelemetryData(flatData);

      // Default parametreler
      const DEFAULT_PARAMETERS = [
        "EngineTotalHours",
        "EngTotalFuelUsed",
        "AkuGerilimi",
        "Ext Voltage",
        "EngCoolTemp",
        "EngineCoolantTemp",
        "AmbAirTemp",
        "RPM",
      ];

      // Kullanıcının kayıtlı seçimini al veya default kullan
      let selectedFromStore: string[] = [];
      const tempSelection = paramStore.getSelection(userID, id);

      if (tempSelection && tempSelection.length > 0) {
        // Kayıtlı seçimleri kullan, ancak mevcut parametrelerle filtrele
        selectedFromStore = tempSelection.filter((p) => allParamKeys.includes(p));
      } else {
        // Default parametreleri kullan
        selectedFromStore = DEFAULT_PARAMETERS.filter((p) =>
          allParamKeys.includes(p)
        );
      }

      const remaining = allParamKeys.filter(
        (k) => !selectedFromStore.includes(k)
      );

      setSelectedItems(selectedFromStore);
      setAvailableItems(remaining);

      // Sensor data'yı oluştur
      const sensorBoxData = createSensorBoxData(
        selectedFromStore,
        flatData,
        vehicle.type,
        vehicle.subtype
      );

      setSensorData(sensorBoxData);
    } catch (err) {
      console.error("API çağrısı başarısız:", err);
    } finally {
      setParameterLoading(false);
    }
  };

  const [telemetryData, setTelemetryData] = useState<Record<string, any>>({});
  const machineType = vehicle?.type;

  useEffect(() => {
    if (!id || !vehicle?.type || !userID) return;
    let intervalId: NodeJS.Timeout;

    const fetchDataPeriod = async () => {
      console.log("NEW DATA");
      try {
        // Develon subtype kontrolü ile parametre listesini al
        const allParamKeys = getParameterKeys(vehicle.type, vehicle.subtype);

        if (allParamKeys.length === 0) return;

        const response = await getValuesTimeSeries("DEVICE", id, allParamKeys);
        const flatData = flattenTelemetryData(response);
        setTelemetryData(flatData);

        // Default parametreler
        const DEFAULT_PARAMETERS = [
          "EngineTotalHours",
          "EngTotalFuelUsed",
          "AkuGerilimi",
          "Ext Voltage",
          "EngCoolTemp",
          "EngineCoolantTemp",
          "AmbAirTemp",
          "RPM",
        ];

        let selectedFromStore: string[] = [];
        const tempSelection = paramStore.getSelection(userID, id);

        if (tempSelection && tempSelection.length > 0) {
          selectedFromStore = tempSelection.filter((p) => allParamKeys.includes(p));
        } else {
          selectedFromStore = DEFAULT_PARAMETERS.filter((p) =>
            allParamKeys.includes(p)
          );
        }

        const remaining = allParamKeys.filter(
          (k) => !selectedFromStore.includes(k)
        );

        setSelectedItems(selectedFromStore);
        setAvailableItems(remaining);

        const sensorBoxData = createSensorBoxData(
          selectedFromStore,
          flatData,
          vehicle.type,
          vehicle.subtype
        );

        setSensorData(sensorBoxData);
      } catch (err) {
        console.error("API çağrısı başarısız:", err);
      }
    };

    fetchData();

    if (isAutoRefresh && isTimerLoaded) {
      intervalId = setInterval(fetchDataPeriod, timerInterval * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, vehicle?.type, vehicle?.subtype, userID, isAutoRefresh, timerInterval, isTimerLoaded]);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sensorData, setSensorData] = useState<MachineParameter[]>([]);
  const [backupSelectedItems, setBackupSelectedItems] = useState<string[]>([]);
  const [backupAvailableItems, setBackupAvailableItems] = useState<string[]>(
    []
  );
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  const openInfoModal = (parameter: string) => {
    setSelectedParameter(parameter);
    console.log("openInfoModal", parameter);
    setShowInfoModal(true);
  };
  const handleSelectedItemsChange = (
    availableItems: string[],
    selectedItems: string[]
  ) => {
    setAvailableItems(availableItems);
    setSelectedItems(selectedItems);
  };
  const handleTransferCancel = () => {
    setSelectedItems(backupSelectedItems);
    setAvailableItems(backupAvailableItems);
    setIsTransferModalOpen(false);
    setIsAutoRefresh(true);
  };

  const handleTransferSave = (
    selectedItemsList: string[],
    availableItemsList: string[]
  ) => {
    setSelectedItems(selectedItemsList);
    setAvailableItems(availableItemsList);
    setIsTransferModalOpen(false);
    setIsAutoRefresh(true);

    // ⬇️ paramStore'a kayıt
    if (userID && id) {
      paramStore.setSelection(userID, id, selectedItemsList);
    }

    // Develon subtype kontrolü ile doğru parametre listesini al veya USA
    let parameterList: MachineParameter[] = [];
    if (vehicle?.subtype === "Develon") {
      parameterList = machineParametersByType["Develon"] || [];
    } else if (vehicle?.subtype === "USA") {
      parameterList = machineParametersByType["USA"] || [];
    } else {
      parameterList = machineParametersByType[machineType] || [];
    }


    const newSensorData = selectedItemsList
      .map((item: string) => {
        const parameter = parameterList?.find(
          (parameter: MachineParameter) => parameter.parameter === item
        );
        if (!parameter) return null;

        return {
          ...parameter,
          value: telemetryData[item] ?? 0,
          lastUpdateTime: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      })
      .filter(Boolean);

    setSensorData(newSensorData as MachineParameter[]);
  };

  const openTransferModal = () => {
    setBackupSelectedItems([...selectedItems]);
    setBackupAvailableItems([...availableItems]);
    setIsTransferModalOpen(true);
    setIsAutoRefresh(false);
  };

  useEffect(() => {
    setIsAutoRefresh(!isTransferModalOpen);
  }, [isTransferModalOpen]);

  const serviceLocations = useMemo(() => {
    if (!vehicle?.lat || !vehicle?.long) return [];

    return [
      {
        id: vehicle?.id,
        type: vehicle?.subtype === "Develon" ? "Develon" : vehicle?.type || "",
        name: vehicle?.model,
        latitude: Number(vehicle?.lat),
        longitude: Number(vehicle?.long),
        hours: String(vehicle?.totalWorkingHours),
        contact: vehicle?.SeriNo,
        maintenance: vehicle?.model,
        operator: vehicle?.opName,
        visible: true,
        state: vehicle.active,
      },
    ];
  }, [
    vehicle?.lat,
    vehicle?.long,
    vehicle?.type,
    vehicle?.model,
    vehicle?.totalWorkingHours,
    vehicle?.SeriNo,
    vehicle?.opName,
  ]);

  const warnings = useMachineWarnings(vehicleID);

  useEffect(() => {
    if (!isTransferModalOpen) return;

    // Eğer parametreler hazır değilse manuel olarak yeniden çağır
    if (
      selectedItems.length === 0 &&
      availableItems.length === 0 &&
      vehicle?.type &&
      userID &&
      id
    ) {
      console.log(
        "TransferModal açıkken veriler eksikti, fetch yeniden tetiklendi."
      );
      fetchData();
    }
  }, [isTransferModalOpen]);

  const { alarms: vehicleAlarms, isLoading: isVehicleAlarmsLoading } = useNotification({
    autoRefresh: true,
    pageSize: 100,
    deviceId: vehicleID
  });


  const handleSensorOrderChange = (newOrder: MachineParameter[]) => {
    setSensorData(newOrder);

    // Yeni sıralamayı paramStore'a kaydet
    const newOrderedParams = newOrder.map(sensor => sensor.parameter);
    if (userID && id) {
      paramStore.setSelection(userID, id, newOrderedParams);
    }
  };

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <p className="text-gray-400">Makina bulunamadı </p>
        <p className="text-gray-400">Lütfen cache temizliği yapın.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full grid-cols-12 overflow-none ">
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
        warnings={warnings}
        deviceWarnings={vehicleAlarms.filter((alarm) => alarm.subtype !== "Develon" || alarm.cleared !== true || alarm.acknowledged !== true)} // ✅ Yeni prop
        deviceName={vehicle?.deviceName}
      />

      <div className="flex flex-col w-full h-full col-span-10 pt-4 pb-8 overflow-y-auto pl-[30px] pr-[110px] ">
        <div className="flex w-full h-[1/2]">
          <div className="flex flex-col h-full w-[65%] min-w-[860px] min-h-[410px] mr-[47px]">
            <GeneralTitle title={t("machineInfoPage.labels.weeklySummary")} />
            <div className="bg-white  dark:bg-gray10 w-full h-full overflow-hidden items-start justify-start flex flex-col rounded-[10px] drop-shadow-[2px_2px_4px_#00000026]">
              <StatisticsSwiper
                deviceId={vehicle?.id}
                machineType={vehicle?.subtype ? vehicle?.subtype : vehicle?.type}
              />
            </div>
          </div>

          <div className="flex flex-col h-full w-[35%] ">
            <GeneralTitle title={t("machineInfoPage.labels.location")} />
            <div className="w-full h-full min-w-[440px] min-h-[410px] p-1 bg-white dark:bg-gray10 flex  rounded-[10px] drop-shadow-[2px_2px_4px_#00000026]">
              {vehicle && vehicle.lat && vehicle.long ? (
                <>
                  <GoogleMaps
                    className="w-full h-full overflow-auto rounded-[10px]"
                    serviceLocations={serviceLocations}
                    extraZoom={16}
                  />
                  <div className="bg-white dark:bg-gray9 p-1 absolute right-2 top-2 rounded-[10px] "
                    onClick={() => navigation(`/map?lat=${vehicle.lat}&long=${vehicle.long}&machineSerialNo=${vehicle.SeriNo}`)}
                  >
                    <div
                      id="zoom-out"
                      className="w-[32px] h-[32px]  bg-gray1 dark:bg-gray7 rounded-[10px]  flex items-center justify-center cursor-pointer dark:bg-gray8 "

                    >
                      <SvgIcons
                        iconName="FullScreen"
                        fill={"#B9C2CA"}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="text-gray4">Konum bilgisi yüklenemedi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex  w-full h-[1/2] mt-[10px]">
          <div className="flex flex-col h-full w-[65%]  min-w-[860px] mr-[47px]">
            <GeneralTitle title={t("machineInfoPage.labels.machineInfo")} />
            {parameterLoading == false ? (
              <DraggableSensorGrid
                sensorData={sensorData}
                telemetryData={telemetryData}
                onSensorOrderChange={handleSensorOrderChange}
                onAddClick={() => openTransferModal()}
                onTranslation={(key: string) => t(key)}
                openInfoModal={(parameter: string) => openInfoModal(parameter)}
                
              />
            ) : (
              <div>
                <span>parametreler yükleniyor</span>
              </div>
            )}
          </div>

          <div className="flex flex-col h-full w-[35%] min-w-[440px] min-h-[410px]">
            <GeneralTitle title={t("machineInfoPage.labels.usage")} />
            <div className="bg-white dark:bg-gray10 w-full h-full max-h-[440px] p-4 items-start justify-start flex flex-col rounded-[10px] drop-shadow-[2px_2px_4px_#00000026]">
              <div className="flex items-center justify-end w-full bg-white dark:bg-gray10">
                <Dropdown
                  options={options}
                  selectedIndex={selectedOption}
                  onChange={(value) => handleChange(value)}
                />
              </div>

              <div className="mt-4  w-full h-[30%] flex items-center justify-start">
                <div className="h-full w-[20%] bg-white dark:bg-gray10 flex items-start justify-center">
                  {" "}
                  <SvgIcons iconName="WorkingTime" fill="#5D6974" />{" "}
                </div>
                <div className="h-full w-[80%] bg-white dark:bg-gray10 flex flex-col items-start justify-start">
                  <p className="text-base font-medium leading-normal tracking-wide text-gray4 font-inter">
                    {t("machineInfoPage.usageCard.work")}
                  </p>
                  <div className="flex items-center justift-start">
                    <p className="text-3xl font-bold leading-normal tracking-wide text-gray8 font-inter">
                      {totalWorkingHours}{" "}
                      {t("machineInfoPage.infoWidget.def_unit")}
                    </p>
                    {totalWorkingHours < beforeTotalWorkingHours ? (
                      <SvgIcons iconName="DownRate" fill="#E84747" />
                    ) : (
                      <SvgIcons iconName="UpRate" fill="#5EB044" />
                    )}
                  </div>
                  <p className="text-base font-medium leading-normal tracking-wide text-gray4 font-inter">
                    {t("machineInfoPage.usageCard.before", {
                      time: beforeTotalWorkingHours,
                    })}{" "}
                    {selectedOption == 0 ? t("global.week") : t("global.month")}
                  </p>
                </div>
              </div>

              <div className="mt-4 w-full h-[30%] flex items-center justify-start">
                <div className="h-full w-[20%] bg-white dark:bg-gray10 flex items-start justify-center">
                  {" "}
                  <SvgIcons iconName="FuelLarge" fill="#5D6974" />{" "}
                </div>
                <div className="h-full w-[80%] bg-white dark:bg-gray10 flex flex-col items-start justify-start">
                  <p className="text-base font-medium leading-normal tracking-wide text-gray4 font-inter">
                    {t("machineInfoPage.usageCard.fuel")}
                  </p>
                  <div className="flex items-center justift-start">
                    <p className="text-3xl font-bold leading-normal tracking-wide text-gray8 font-inter">
                      {totalFuelConsumption} Lt.
                    </p>
                    {totalFuelConsumption < beforeTotalFuelConsumption ? (
                      <SvgIcons iconName="DownRate" fill="#5EB044" />
                    ) : (
                      <SvgIcons iconName="UpRate" fill="#E84747" />
                    )}
                  </div>
                  <p className="text-base font-medium leading-normal tracking-wide text-gray4 font-inter">
                    {t("machineInfoPage.usageCard.before", {
                      time: beforeTotalFuelConsumption,
                    })}{" "}
                    {selectedOption == 0 ? t("global.week") : t("global.month")}
                  </p>
                </div>
              </div>

              <div className="mt-4 w-full h-[30%] flex items-center justify-start">
                <div className="h-full w-[20%] bg-white dark:bg-gray10 flex items-start justify-center">
                  {" "}
                  <SvgIcons iconName="Def" fill="#5D6974" />{" "}
                </div>
                <div className="h-full w-[80%] bg-white dark:bg-gray10 flex flex-col items-start justify-start">
                  <p className="text-base font-medium leading-normal tracking-wide text-gray4 font-inter">
                    {t("machineInfoPage.usageCard.def")}
                  </p>
                  <div className="flex items-center justift-start">
                    <p className="text-3xl font-bold leading-normal tracking-wide text-gray8 font-inter">
                      {vehicle.def >= 0 ? vehicle.def?.toFixed(2) + "%" : "-"}
                    </p>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={handleTransferCancel}
        availableItemsList={availableItems}
        selectedItemsList={selectedItems}
        onItemsChange={handleSelectedItemsChange}
        onSave={handleTransferSave}
        machineType={vehicle?.subtype ? vehicle?.subtype : vehicle?.type}
        subtype={vehicle?.subtype}
      />

      <ParameterChartModal
        deviceId={id ?? ""}
        machineType={vehicle?.subtype ? vehicle?.subtype : vehicle?.type}
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        parameterName={selectedParameter ?? ""}
      />
    </div>
  );
};

export default observer(VehicleDetail);