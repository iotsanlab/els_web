import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import QuickTrans from "../../components/Home/QuickTrans";
import SumBar from "../../components/Home/SumBar";
import GeneralTitle from "../../components/Title/GeneralTitle";
import WeatherSwiper from "../../components/Home/Weather/WeatherSwiper";
import FilterCheckbox from "../../components/Home/filterCheckbox";
import ManualBarChart from "../../components/ManuelBar";
import ManuelDonut from "../../components/ManuelDonut";
import ResponsiveTest from "../../components/ResponsiveTest";
import getMachineImage from "../../components/GetImage";
import deviceAttributes from "../../store/DeviceAttributes";
import deviceWorkStore from "../../store/DeviceTelemetry";
import { userStore } from "../../store/UserStore";
import { getFavList, getRecentMachineList, getUserId, getTimerSetting } from "../../services/auth";
import AiChatWidget from "../../components/AiChatWidget";
import { refreshStatusOnly } from "../../hooks/useDeviceInitialization";

const allCheckedOptions = ["AE15", "EL12", "VM6"];

// subtype bazlı statik idle değerleri (render başına yeniden oluşmasın diye modül seviyesinde)
const weeklyIdleValues: Record<string, number> = {
  AE15: 4.5,
  EL12: 3.2,
  VM6: 1.7,
};

const monthlyIdleValues: Record<string, number> = {
  AE15: 23.9,
  EL12: 16.4,
  VM6: 8.9,
};

interface FormattedData {
  value: number;
  dayName: string;
  dayNum: number;
  date?: string;
}

interface DonutData {
  activeWorking: number;  // saat cinsinden
  idle: number;           // saat cinsinden
  workingTime: number;    // yüzde cinsinden
}

function generateDummyChartData(count: number): FormattedData[] {
  const weekdays = ["pzt", "sal", "çar", "per", "cum", "cmt", "paz"];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // zamanı sıfırla

  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (count - index - 1)); // <-- bugün dahil

    return {
      value: 0,
      dayName: weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1],
      dayNum: date.getDate(),
      date: date.toISOString().split("T")[0],
    };
  });
}

// donut için yüzdelik hesaplama
function calculateWorkingPercentage(workingHour: number, idleHour: number): number {
  const total = workingHour + idleHour;
  if (total === 0) return 0;
  return (workingHour / total) * 100;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const [workingBarChartWeekly, setWorkingBarChartWeekly] = useState<FormattedData[]>([]);
  const [workingBarChartMonthly, setWorkingBarChartMonthly] = useState<FormattedData[]>([]);

  const [fuelBarChartWeekly, setFuelBarChartWeekly] = useState<FormattedData[]>([]);
  const [fuelBarChartMonthly, setFuelBarChartMonthly] = useState<FormattedData[]>([]);

  const [totalWorkingHour, setTotalWorkingHour] = useState<number>(0); // son 30 günün toplamı (donutta kullanılıyor)
  const [last7Working, setLast7Working] = useState<number>(0);

  const [last7idle, setLast7Idle] = useState<number>(0);
  const [last30idle, setLast30Idle] = useState<number>(0);

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const isRefreshing = useRef(false);

  const [timerInterval, setTimerInterval] = useState<number | null>(null); // null = henüz yüklenmedi

  const [checkedOptions, setCheckedOptions] = useState<string[]>(allCheckedOptions);

  const [selectedFuelOption, setSelectedFuelOption] = useState(0);
  const [selectedWorkOption, setSelectedWorkOption] = useState(0);
  const [selectedDonutOption, setSelectedDonutOption] = useState(0);

  const [favoriteItems, setFavoriteItems] = useState<{ imageSrc?: string; id: number }[]>([]);
  const [recentItems, setRecentItems] = useState<{ imageSrc?: string; id: number }[]>([]);

  // Timer ayarını kullanıcı tercihinden al
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const uid = await getUserId();
        if (!uid) return;
        const timerValue = await getTimerSetting(uid);
        setTimerInterval(timerValue ?? 30); // Varsayılan 30 saniye
      } catch (error) {
        console.error('Timer setting fetch error:', error);
        setTimerInterval(30); // Hata durumunda 30 saniye
      }
    };
    fetchTimer();
  }, []);

  // Sadece aktif/pasif durumu yenileyen hafif interval
  useEffect(() => {
    // Timer ayarı yüklenene kadar başlatma
    if (timerInterval === null) return;

    const interval = setInterval(async () => {
      // Eğer zaten bir refresh işlemi devam ediyorsa, yeni istek atma
      if (isRefreshing.current) return;

      isRefreshing.current = true;
      try {
        await refreshStatusOnly(); // Sadece stat (aktif/pasif) durumu çeker
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Status refresh failed:', error);
      } finally {
        isRefreshing.current = false;
      }
    }, timerInterval * 1000);
    return () => clearInterval(interval);
  }, [timerInterval]);

  // Saate göre selamlama
  const getGreetingByTime = useCallback((name: string): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return `${t("homePage.headers.morning")} ${name}`;
    } else if (hour >= 12 && hour < 18) {
      return `${t("homePage.headers.afternoon")} ${name}`;
    } else if (hour >= 18 && hour < 22) {
      return `${t("homePage.headers.evening")} ${name}`;
    } else {
      return `${t("homePage.headers.night")} ${name}`;
    }
  }, [t]);

  const handleFilterBoxChange = useCallback((selected: string[]) => {
    setCheckedOptions(selected);
  }, []);

  // AĞIR HESAPLAMA: sadece filtre ya da cihaz listesi değişince çalışır.
  // (Eski versiyon refreshTrigger'a bağlıydı; bu yüzden sadece stat yenilemesi
  //  yapan her tikte tüm günlük toplamlar gereksiz yere baştan hesaplanıyordu.)
  useEffect(() => {
    const optionsToUse = checkedOptions.length > 0 ? checkedOptions : Object.keys(weeklyIdleValues);

    const total30 = deviceWorkStore.getDailyFormatted("DailyPlatformHours", 31, optionsToUse);
    const total7 = deviceWorkStore.getDailyFormatted("DailyPlatformHours", 7, optionsToUse);

    const total30Working = total30.reduce((acc, item) => acc + item.value, 0);
    const total7Working = total7.reduce((acc, item) => acc + item.value, 0);

    setTotalWorkingHour(total30Working);
    setLast7Working(total7Working);

    // haftalık / aylık idle
    setLast7Idle(deviceWorkStore.getDailySummary("DailyGroundHours", 7, checkedOptions));
    setLast30Idle(deviceWorkStore.getDailySummary("DailyGroundHours", 31, checkedOptions));

    setWorkingBarChartWeekly(total7);

    const dummy30 = generateDummyChartData(31);
    const completed = dummy30.map(d => total30.find(r => r.date === d.date) ?? d);
    setWorkingBarChartMonthly(completed);

    setFuelBarChartWeekly(deviceWorkStore.getDailyFormatted("DailyEnergyConsumption", 7, optionsToUse));
    setFuelBarChartMonthly(deviceWorkStore.getDailyFormatted("DailyEnergyConsumption", 30, optionsToUse));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedOptions, deviceWorkStore.all.length]);

  // justLoggedIn kontrolü
  useEffect(() => {
    const justLoggedIn = localStorage.getItem("justLoggedIn");
    if (justLoggedIn === "true") {
      localStorage.removeItem("justLoggedIn");
      window.location.reload();
    }
  }, []);

  // Favoriler & son kullanılanlar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = await getUserId();
        userStore.setUserId(uid);
        if (!uid) return;

        const recents = await getRecentMachineList(uid);
        if (recents) {
          const mappedRecents = recents
            .filter(r => r.id)
            .map(machine => ({
              id: machine.id,
              imageSrc: getMachineImage(machine.isTelehandlerV2 ? 'Telehandler_v2' : machine.type, "sm", machine.subtype),
            }));
          setRecentItems(mappedRecents);
        }

        const favs = await getFavList(uid);
        if (!favs) return;

        const mapped = favs
          .filter(f => f.id)
          .map(fav => ({
            id: fav.id,
            imageSrc: getMachineImage(fav.isTelehandlerV2 ? 'Telehandler_v2' : fav.type, "sm", fav.subtype),
          }));
        setFavoriteItems(mapped);
      } catch (err) {
        console.error("Recent machines alınamadı:", err);
      }
    };

    fetchData();
  }, []);

  // ---- Sayım değerleri: render başına değil, sadece ilgili veriler değişince hesaplanır ----

  // Filtreye uyan toplam cihaz sayısı (SumBar + ManualBarChart aynı değeri kullanır)
  const filteredDeviceCount = useMemo(() => {
    return deviceWorkStore.all.filter(device => {
      if (checkedOptions.length === 0) return true;
      return checkedOptions.includes(device.subtype);
    }).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedOptions, deviceWorkStore.all.length]);

  // Aktif cihaz sayısı (stat'a bağlı olduğu için refreshTrigger'da yeniden hesaplanır)
  const filteredActiveDeviceCount = useMemo(() => {
    return deviceWorkStore.all
      .filter(device => checkedOptions.length === 0 || checkedOptions.includes(device.subtype))
      .filter(device => deviceWorkStore.getTelemetry(device.id, "stat")?.at(-1)?.value === 1)
      .length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedOptions, deviceWorkStore.all.length, refreshTrigger]);

  // Bakımı yaklaşan cihaz sayısı
  const lowMaintenance = useMemo(() => {
    return deviceAttributes.all.filter(([, attrs]) => {
      const remaining = attrs.find(a => a.key === "remainingHoursToMaintenance")?.value;
      return remaining !== null && remaining !== undefined && remaining < 50;
    }).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceAttributes.all.length, refreshTrigger]);

  // Dummy fallback verileri sabit referansla (her render'da yeniden üretilmesin)
  const dummy7 = useMemo(() => generateDummyChartData(7), []);
  const dummy31 = useMemo(() => generateDummyChartData(31), []);

  // Donut verileri
  const weeklyDonutData: DonutData = useMemo(() => ({
    activeWorking: last7Working,
    idle: last7idle,
    workingTime: calculateWorkingPercentage(last7Working, last7idle),
  }), [last7Working, last7idle]);

  const monthlyDonutData: DonutData = useMemo(() => ({
    activeWorking: totalWorkingHour,
    idle: last30idle,
    workingTime: calculateWorkingPercentage(totalWorkingHour, last30idle),
  }), [totalWorkingHour, last30idle]);

  return (
    <>
      <ResponsiveTest />

      <div className="flex w-full home-page-container">
        <div className="flex flex-col justify-center h-full   w-[1184px] mr-[47px]">
          <GeneralTitle title={getGreetingByTime("")} />

          <div className="bg-white dark:bg-gray10 w-full h-[479px] pt-[20px] pr-[20px] pb-[10px] pl-[20px] items-start justify-start flex flex-col rounded-[10px] drop-shadow-[4px_4px_4px_#00000026]">

            <FilterCheckbox
              options={allCheckedOptions}
              type2={false}
              onChange={handleFilterBoxChange}
            />
            <div className="h-[15px]"></div>

            <div className="flex items-center">

              <ManuelDonut
                weeklyData={weeklyDonutData}
                monthlyData={monthlyDonutData}
                onSelectOption={setSelectedDonutOption}
                selectedOption={selectedDonutOption}
              />

              <div className="w-[4px] h-[220px] flex bg-gray1 dark:bg-gray9 rounded-[4px] mx-[8px]"></div>

              <ManualBarChart
                sampleDataWeekly={fuelBarChartWeekly.length > 0 ? fuelBarChartWeekly : dummy7}
                sampleDataMonthly={fuelBarChartMonthly.length > 0 ? fuelBarChartMonthly : dummy31}
                title={t("global.fuelGraphTitle")}
                type="blue"
                onSelectOption={setSelectedWorkOption}
                selectedOption={selectedWorkOption}
                idealConsumption={7}
                machineCount={filteredDeviceCount}
                isIdealConsumption={true}
              />

              <div className="w-[4px] h-[220px] flex bg-gray1 dark:bg-gray9 rounded-[4px] mx-[8px]"></div>

              <ManualBarChart
                sampleDataWeekly={workingBarChartWeekly.length > 0 ? workingBarChartWeekly : dummy7}
                sampleDataMonthly={workingBarChartMonthly.length > 0 ? workingBarChartMonthly : dummy31}
                title={t("global.workingGraphTitle")}
                type="orange"
                onSelectOption={setSelectedFuelOption}
                selectedOption={selectedFuelOption}
              />

            </div>
            <div className="w-[1100px] h-[3px] flex bg-gray1 dark:bg-gray9 rounded-[4px] my-[13px]"></div>

            <SumBar value1={0} value2={lowMaintenance} value3={filteredDeviceCount} value4={filteredActiveDeviceCount} />

          </div>

          <div className="items-start justify-start w-full my-4 ">
            <GeneralTitle title={t("homePage.headers.quickOp")} />
            <div className="drop-shadow-[2px_2px_4px_#00000026] w-full">

              <QuickTrans
                recentItems={recentItems}
                bookmarks={favoriteItems}
              />

            </div>
          </div>
        </div>


        <div className="flex flex-col h-full w-[440px] mb-[10px]">
          <GeneralTitle title={t("homePage.headers.weather")} />
          <WeatherSwiper />

          <div className="mt-[10px]">
            <AiChatWidget />
          </div>
        </div>
      </div>

    </>
  );
};

export default observer(HomePage);