import React, { useEffect, useState, useRef } from "react";
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
import { getFavList, getRecentMachineList, getUserId } from "../../services/auth";
import AiChatWidget from "../../components/AiChatWidget";
import { refreshAllTelemetry } from "../../hooks/useDeviceInitialization";

const allCheckedOptions = [ "AE15", "EL12", "VM6"];

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


const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const [workingBarChartWeekly, setWorkingBarChartWeekly] = useState<FormattedData[]>([]);
  const [workingBarChartMonthly, setWorkingBarChartMonthly] = useState<FormattedData[]>([]);

  const [fuelBarChartWeekly, setFuelBarChartWeekly] = useState<FormattedData[]>([]);
  const [fuelBarChartMonthly, setFuelBarChartMonthly] = useState<FormattedData[]>([]);

  const [totalWorkingHour, setTotalWorkingHour] = useState<number>(0); //bu son 30 günün toplamını veriyor (donutta kullanıyoruz direkt)
  const [last7Working, setLast7Working] = useState<number>(0);

  const [last7idle, setLast7Idle] = useState<number>(0);
  const [last30idle, setLast30Idle] = useState<number>(0);
  
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const isRefreshing = useRef(false);

  // Her saniye API'den veri çekerek chart datalarını güncellemek için interval
  useEffect(() => {
    const interval = setInterval(async () => {
      // Eğer zaten bir refresh işlemi devam ediyorsa, yeni istek atma
      if (isRefreshing.current) return;
      
      isRefreshing.current = true;
      try {
        await refreshAllTelemetry();
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Telemetry refresh failed:', error);
      } finally {
        isRefreshing.current = false;
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //donut için yüzdelik hesaplama fonksiyonu
  function calculateWorkingPercentage(workingHour: number, idleHour: number): number {
    const active = workingHour;
    const idle = idleHour;

    const total = active + idle;
    if (total === 0) return 0;
    return ((active / total) * 100);
  }

  //Saate göre selamlama fonksiyonu
  const getGreetingByTime = (name: string): string => {
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
  };

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



//test commit



  const [checkedOptions, setCheckedOptions] = useState<string[]>(allCheckedOptions);

  const handleFilterBoxChange = (selected: string[]) => {
    setCheckedOptions(selected);
  };

 // tür bazlı statik idle değerleri
const weeklyIdleValues: Record<string, number> = {
  Telehandler: 1.7,
  Backhoeloader: 3.2,
  Excavator: 4.5,
};

// aylık statik idle değerleri
const monthlyIdleValues: Record<string, number> = {
  Telehandler: 8.9,
  Backhoeloader: 16.4,
  Excavator: 23.9,
};

useEffect(() => {
  const optionsToUse = checkedOptions.length > 0 ? checkedOptions : Object.keys(weeklyIdleValues);


  const total30 = deviceWorkStore.getDailyFormatted("DailyWorkingHours", 31, optionsToUse)
  const total7 = deviceWorkStore.getDailyFormatted("DailyWorkingHours", 7, optionsToUse)

  const total30Working = total30.reduce((acc, item) => acc + item.value, 0);
  const total7Working = total7.reduce((acc, item) => acc + item.value, 0);

  setTotalWorkingHour(total30Working);
  setLast7Working(total7Working);



  // haftalık idle
  const idleTime = deviceWorkStore.getDailySummary("DailyIdleHours", 7, checkedOptions);
  const idle7 = optionsToUse.reduce((acc, type) => acc + (weeklyIdleValues[type] || 0), 0);
  setLast7Idle(idleTime);

  // aylık idle
  const idleTime30 = deviceWorkStore.getDailySummary("DailyIdleHours", 31, checkedOptions);
  const idle30 = optionsToUse.reduce((acc, type) => acc + (monthlyIdleValues[type] || 0), 0);
  setLast30Idle(idleTime30);

  setWorkingBarChartWeekly(total7);
  const rawWorking = total30;
  const dummy30 = generateDummyChartData(31);
  const completed = dummy30.map(d => {
    const found = rawWorking.find(r => r.date === d.date);
    return found ? found : d;
  });
  setWorkingBarChartMonthly(completed);
  setFuelBarChartWeekly(deviceWorkStore.getDailyFormatted("DailyFuelCons", 7, optionsToUse));
  setFuelBarChartMonthly(deviceWorkStore.getDailyFormatted("DailyFuelCons", 30, optionsToUse));
}, [checkedOptions, deviceWorkStore.all.length, refreshTrigger]);



{/* 
    useEffect(() => {
    const total30 = deviceWorkStore.getDailySummary("DailyWorkingHours", 31, checkedOptions);
    const idle30 = deviceWorkStore.getDailySummary("idleTime", 31, checkedOptions);
    const total7 = deviceWorkStore.getDailySummary("DailyWorkingHours", 7, checkedOptions);
    const idle7 = deviceWorkStore.getDailySummary("idleTime", 7, checkedOptions);

    setTotalWorkingHour(total30);
    //setLast30Idle(idle30 / (1000 * 60 * 60));
        setLast30Idle(65.1);

    setLast7Working(total7);
//    setLast7Idle(idle7 / (1000 * 60 * 60));
        setLast7Idle(9.86);


    setWorkingBarChartWeekly(deviceWorkStore.getDailyFormatted("DailyWorkingHours", 7, checkedOptions));
    const rawWorking = deviceWorkStore.getDailyFormatted("DailyWorkingHours", 31, checkedOptions);
    const dummy30 = generateDummyChartData(31);
    const completed = dummy30.map(d => {
      const found = rawWorking.find(r => r.date === d.date);
      return found ? found : d;
    });
    setWorkingBarChartMonthly(completed);
    setFuelBarChartWeekly(deviceWorkStore.getDailyFormatted("DailyFuelCons", 7, checkedOptions));
    setFuelBarChartMonthly(deviceWorkStore.getDailyFormatted("DailyFuelCons", 30, checkedOptions));
  }, [checkedOptions, deviceWorkStore.all.length]);
  */}


  //donut grafiği data 
  const weeklyDonutData: DonutData = {
    activeWorking: last7Working,
    idle: last7idle,
    workingTime: calculateWorkingPercentage(last7Working, last7idle),
  };

  const monthlyDonutData: DonutData = {
    activeWorking: totalWorkingHour,
    idle: last30idle,
    workingTime: calculateWorkingPercentage(totalWorkingHour, last30idle),
  };

  // Sum Bar fonksiyonları
  function getFilteredDeviceCount(): number {
    return deviceWorkStore.all.filter(device => {
      // checkedOptions boşsa tüm cihazlar dahil edilir
      if (checkedOptions.length === 0) return true;
      return checkedOptions.includes(device.type);
    }).length;
  }


  function getFilteredActiveDeviceCount(): number {
    return deviceWorkStore.all
      .filter(device => {
        // checkedOptions boşsa tüm cihazlar dahil edilir
        if (checkedOptions.length === 0) return true;
        return checkedOptions.includes(device.type);
      })
      .filter(device => {
        const latestStatusValue = deviceWorkStore.getTelemetry(device.id, "stat")?.at(-1)?.value;
        return latestStatusValue === 1;
      })
      .length;
  }


  function lowMaintenanceCount(): number {
    const result = deviceAttributes.all.map(([id, attrs]) => {
      const remaining = attrs.find(a => a.key === "remainingHoursToMaintenance")?.value;
      return {
        deviceId: id,
        remainingHours: remaining
      };
    });
    const count = result.filter(entry => entry.remainingHours !== null && entry.remainingHours < 50).length;

    return count;
  }

  const [selectedFuelOption, setSelectedFuelOption] = useState(0);
  const [selectedWorkOption, setSelectedWorkOption] = useState(0);
  const [selectedDonutOption, setSelectedDonutOption] = useState(0);


  useEffect(() => {
    const justLoggedIn = localStorage.getItem("justLoggedIn");

    if (justLoggedIn === "true") {
      localStorage.removeItem("justLoggedIn"); 
      window.location.reload(); 
    }
  }, []);

  const [favoriteItems, setFavoriteItems] = useState<{ imageSrc?: string; id: number }[]>([]);
  const [recentItems, setRecentItems] = useState<{ imageSrc?: string; id: number }[]>([]);

  //--favoriler
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
                sampleDataWeekly={fuelBarChartWeekly.length > 0 ? fuelBarChartWeekly : generateDummyChartData(7)}
                sampleDataMonthly={fuelBarChartMonthly.length > 0 ? fuelBarChartMonthly : generateDummyChartData(31)}
                title={t("global.fuelGraphTitle") }
                type="blue"
                onSelectOption={setSelectedWorkOption}
                selectedOption={selectedWorkOption}
              />

              <div className="w-[4px] h-[220px] flex bg-gray1 dark:bg-gray9 rounded-[4px] mx-[8px]"></div>

              <ManualBarChart

                sampleDataWeekly={workingBarChartWeekly.length > 0 ? workingBarChartWeekly : generateDummyChartData(7)}
                sampleDataMonthly={workingBarChartMonthly.length > 0 ? workingBarChartMonthly : generateDummyChartData(31)}
                title={t("global.workingGraphTitle")}
                type="orange"
                onSelectOption={setSelectedFuelOption}
                selectedOption={selectedFuelOption}

              />


            </div>
            <div className="w-[1100px] h-[3px] flex bg-gray1 dark:bg-gray9 rounded-[4px] my-[13px]"></div>

            <SumBar value1={0} value2={lowMaintenanceCount()} value3={getFilteredDeviceCount()} value4={getFilteredActiveDeviceCount()} />

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
