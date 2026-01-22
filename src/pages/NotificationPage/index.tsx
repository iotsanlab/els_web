import SwitchUI from "../../components/Switch";
import SearchArea from "../../components/Machines/SearchArea";
import GeneralTitle from "../../components/Title/GeneralTitle";
import serviceExc from "../../assets/service/serviceExc.png";
import serviceBackhoe from "../../assets/service/serviceBackhoe.png";
import serviceTele from "../../assets/service/serviceTele.png";
import serviceExcWhite from "../../assets/service/serviceExcWhite.png";
import serviceBackhoeWhite from "../../assets/service/serviceBackhoeWhite.png";
import serviceTeleWhite from "../../assets/service/serviceTeleWhite.png";
import { useDarkMode } from "../../context/DarkModeContext";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  updateAssetAlarmSettings,
  getAssetAlarmSettings,
  ackKnowledgeAlarm
} from "../../services/alarms";
import { useEffect, useState } from "react";
import { NotificationData } from "../../data/NotificationData";
import i18n from "../../context/i18n";
import { useNotification } from '../../hooks/useNotification';
import { getAssetIDByUserId } from "../../data/Assets";


const getNotificationMessage = (alarmId: number | string, lang: string): string => {
  const matched = NotificationData.find(item => String(item.id) === String(alarmId));
  if (!matched) return lang === "en" ? "Unknown notification" : "Bilinmeyen bildirim";
  return lang === "en" ? matched.name_en : matched.name_tr;
};


const NotificationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  let [searchParams] = useSearchParams();




  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<"all" | "acknowledged" | "unacknowledged">("all");

  const {
  alarms,
  isLoading: isLoadingAlarms,
  currentPage,
  totalPages,
  totalElements,
  handlePageChange,
  handlePrevPage,
  handleNextPage,
  refetch,
  updateAlarmAcknowledgement,
  removeAlarmFromList,
  getUnacknowledgedAlarms
} = useNotification({
  pageSize: 10,
  autoRefresh: true,
  refreshInterval: 30000, // veya timerInterval * 1000
  acknowledgedFilter: acknowledgedFilter,
  deviceId: searchParams.get('deviceId') || undefined
});

  // Filter değiştiğinde sayfayı sıfırla
  const handleAcknowledgedFilterChange = (filter: "all" | "acknowledged" | "unacknowledged") => {
    setAcknowledgedFilter(filter);
    handlePageChange(0); // İlk sayfaya dön
  };

  // Alarm onaylama
  const handleAcknowledgeAlarm = async (alarmId: string) => {
    try {
      // Backend'e onaylama isteği gönder
      await ackKnowledgeAlarm(alarmId);
      console.log(t("notifPage.ackSuccess"));
      
      // Frontend'de anında güncelle
      if (acknowledgedFilter === "unacknowledged") {
        // Eğer "Onaylanmamış" filtresindeyse, alarmı listeden kaldır
        removeAlarmFromList(alarmId);
      } else if (acknowledgedFilter === "all") {
        // Eğer "Tümü" filtresindeyse, sadece durumu güncelle
        updateAlarmAcknowledgement(alarmId);
      }
      
      // Backend'den güncel veriyi al (arka planda)
      setTimeout(() => {
        refetch();
      }, 500);
      
    } catch (error) {
      console.error("Alarm onaylama hatası:", error);
      alert(t("notifPage.ackError"));
    }
  };

  // Tüm alarmları toplu onaylama
  const handleAcknowledgeAll = async () => {
    const unacknowledgedAlarms = getUnacknowledgedAlarms();
    
    if (unacknowledgedAlarms.length === 0) {
      alert(t("notifPage.noUnacknowledgedAlarms"));
      return;
    }

    // Onay iste
    const confirmed = window.confirm(
      t("notifPage.ackAllConfirm", { count: unacknowledgedAlarms.length })
    );
    
    if (!confirmed) return;

    try {
      setIsLoading(true);
      
      // Tüm onaylanmamış alarmları sırayla onayla
      const promises = unacknowledgedAlarms.map(alarm => 
        ackKnowledgeAlarm(alarm.id)
      );
      
      await Promise.all(promises);
      
      alert(t("notifPage.ackAllSuccess", { count: unacknowledgedAlarms.length }));
      
      // Listeyi yenile
      setTimeout(() => {
        refetch();
      }, 500);
      
    } catch (error) {
      console.error("Toplu alarm onaylama hatası:", error);
      alert(t("notifPage.ackError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination states
  const pageSize = 10;

  // Global alarm settings
  const [alarmSettings, setAlarmSettings] = useState({
    alarm1: false,
    alarm2: false,
    alarm3: false,
    alarm4: false,
    alarm5: false,
  });

  // Makine tipi özel ayarlar
  const [machineSpecificSettings, setMachineSpecificSettings] = useState({
    telehandler: {
      speedLimitLogging: false, // TLH makine hızı 34 km/hr geçtiği zaman loglama
      bypassCountLogging: false, // TLH makine de bypass anahtarına basılma sayısı tutulması
    },
    excavator: {
      // Gelecekte excavator için özel ayarlar eklenebilir
    },
    backhoeloader: {
      // Gelecekte backhoeloader için özel ayarlar eklenebilir
    }
  });

  useEffect(() => {
    loadAlarmSettings();
   
    loadMachineSpecificSettings();
  }, [alarms]);

  const loadAlarmSettings = async () => {
    try {
      setIsLoading(true);
      const assetId = await getAssetIDByUserId() || "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f";
      const response = await getAssetAlarmSettings(assetId);

      if (response && Object.keys(response).length > 0) {
        setAlarmSettings(prev => ({
          ...prev,
          ...response
        }));
      } else {
      }

    } catch (error) {
      console.error("❌ Alarm ayarları yüklenirken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMachineSpecificSettings = async () => {
    try {
      // Burada makine tipi özel ayarları yüklemek için API çağrısı yapılabilir
      // Şimdilik localStorage veya state'te tutuyoruz
    } catch (error) {
      console.error("❌ Makine özel ayarları yüklenirken hata:", error);
    }
  };

  const handleToggleChange = async (key: keyof typeof alarmSettings, value: boolean) => {

    const updatedSettings = { ...alarmSettings, [key]: value };
    setAlarmSettings(updatedSettings);

    try {
      setIsLoading(true);
      const assetId = await getAssetIDByUserId() || "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f";
      const result = await updateAssetAlarmSettings(assetId, updatedSettings);
    } catch (error) {
      console.error("❌ Alarm ayarı güncellenirken hata:", error);

      // Hata durumunda state'i geri al
      setAlarmSettings(alarmSettings);
      alert("Alarm ayarı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMachineSpecificToggleChange = async (
    machineType: keyof typeof machineSpecificSettings,
    settingKey: string,
    value: boolean
  ) => {
    const updatedSettings = {
      ...machineSpecificSettings,
      [machineType]: {
        ...machineSpecificSettings[machineType],
        [settingKey]: value
      }
    };
    
    setMachineSpecificSettings(updatedSettings);

    try {
      setIsLoading(true);
      // Burada makine tipi özel ayarları güncellemek için API çağrısı yapılabilir
      // await updateMachineSpecificSettings(machineType, updatedSettings[machineType]);
      
      console.log(`${machineType} ${settingKey} ayarı güncellendi:`, value);
      
    } catch (error) {
      console.error("❌ Makine özel ayarı güncellenirken hata:", error);
      
      // Hata durumunda state'i geri al
      setMachineSpecificSettings(machineSpecificSettings);
      alert("Makine özel ayarı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderServiceImage = (service: string) => {
    switch (service) {
      case "Backhoeloader":
        return isDarkMode ? serviceBackhoeWhite : serviceBackhoe;
      case "Excavator":
        return isDarkMode ? serviceExcWhite : serviceExc;
      case "Telehandler":
        return isDarkMode ? serviceTeleWhite : serviceTele;
      default:
        return serviceTele;
    }
  };

  const getStatusColor = (alarmId: string) => {
    console.log("alarmId", alarmId);
    const matched = NotificationData.find(item => String(item.id) === String(alarmId));

    switch (matched?.severity) {
      case "CRITICAL":
        return "#FF0000";
      case "MAJOR":
        return "#FF0000";
      case "MINOR":
        return "#FFA500";
      case "WARNING":
        return "#FFA500";
      default:
        return "#FF0000";
    }
};

  // Pagination butonlarını render etme
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`text-sm rounded-md  ${currentPage === i
              ? 'bg-mstYellow text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

  // Filtrelenmiş Alarmlar (acknowledged filtreleme backend'de yapılıyor, frontend'de sadece search ve machineType)
  const filteredAlarms = alarms.filter((alarm) => {
    const matchSearch = alarm.rawSeriNo
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(alarm.machineType);

    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-1">
      <div className="w-full">
        <GeneralTitle title={t("notifPage.title1")} />

        {/* Search ve Filter */}
        <SearchArea
          searchText={searchText}
          onSearchChange={setSearchText}
          onFilterChange={setSelectedFilters}
        />

        <div className="h-4"></div>

        {/* Acknowledged Filter Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleAcknowledgedFilterChange("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                acknowledgedFilter === "all"
                  ? "bg-mstYellow text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {t("notifPage.filterAll")}
            </button>
            <button
              onClick={() => handleAcknowledgedFilterChange("acknowledged")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                acknowledgedFilter === "acknowledged"
                  ? "bg-mstYellow text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {t("notifPage.filterAcknowledged")}
            </button>
            <button
              onClick={() => handleAcknowledgedFilterChange("unacknowledged")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                acknowledgedFilter === "unacknowledged"
                  ? "bg-mstYellow text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {t("notifPage.filterUnacknowledged")}
            </button>
          </div>

          {/* Tümünü Onayla Butonu */}
          <button
            onClick={handleAcknowledgeAll}
            disabled={isLoading || getUnacknowledgedAlarms().length === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isLoading || getUnacknowledgedAlarms().length === 0
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-md"
            }`}
          >
            <SvgIcons
              iconName="CheckFill"
              className="w-[16px] h-[16px]"
              fill="currentColor"
            />
            {getUnacknowledgedAlarms().length > 0 ? t("notifPage.ackAllBtn") : t("notifPage.ackedAllBtn")}
            {getUnacknowledgedAlarms().length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {getUnacknowledgedAlarms().length}
              </span>
            )}
          </button>
        </div>

        {/* Loading indicator */}
        {isLoadingAlarms && (
          <div className="text-center py-4">
            <span className="text-gray-500">{t("global.loading") || "Yükleniyor..."}</span>
          </div>
        )}

        <div>
          <div className="w-full bg-white dark:bg-gray10 drop-shadow-[2px_2px_4px_#00000026] rounded-[10px] px-[20px] font-inter">
            <table className="min-w-full divide-y divide-gray1 dark:divide-gray9">
              <tbody className="divide-y divide-gray-200">
                {filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="divide-x divide-gray1 dark:divide-gray9">
                    {/* Onaylama Butonu Kolonu */}
                    <td className="py-4 px-4 text-sm font-medium text-center whitespace-nowrap">
                      {alarm.acknowledged ? (
                        <div className="flex items-center justify-center gap-2">
                          <SvgIcons
                            iconName="CheckFill"
                            className="w-[20px] h-[20px]"
                            fill="#10B981"
                          />
                          <span className="text-[12px] text-green-600 dark:text-green-400 font-medium">
                            {t("notifPage.acknowledged")}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAcknowledgeAlarm(alarm.id)}
                          className="px-3 py-1.5 text-[12px] font-medium text-white bg-mstYellow hover:bg-yellow-600 rounded-md transition-colors"
                        >
                          {t("notifPage.acknowledge")}
                        </button>
                      )}
                    </td>
                    <td className="py-4 pl-4 pr-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap">
                      <span className="text-gray4 dark:text-gray6 text-[14px] font-medium">
                        {alarm.name}
                      </span>
                    </td>
                    <td className="flex items-center w-full gap-2 p-4 text-sm text-gray-500 whitespace-nowrap">
                      <SvgIcons
                        iconName="Warning"
                        className="w-[24px]"
                        fill={`${getStatusColor(alarm.details?.id)}`}
                      />

                      <img
                        className="max-w-[48px]"
                        src={renderServiceImage(alarm.machineType)}
                        alt={alarm.machineType}
                      />
                      <div
                        className="flex flex-col w-full gap-1 cursor-pointer"
                        onClick={() => navigate("/vehicle/" + alarm.deviceId)}
                      >
                        <span className="text-gray10 dark:text-gray1 text-[14px] font-semibold">
                          {alarm.seriNo} <span className="font-medium">{t("global.vehicNum")}</span>
                          {getNotificationMessage(alarm.alarmTypeId, i18n.language)}
                        </span>
                      </div>
                      <div onClick={() => navigate(`/Services`)}>
                        <SvgIcons
                          iconName="ArrowRight"
                          fill={isDarkMode ? "#8B96A2" : "#B9C2CA"}
                          className="w-[16px] h-[16px] cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredAlarms.length === 0 && !isLoadingAlarms && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      {t("global.noFilterResult")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <>
              <div className="text-sm text-gray-700 dark:text-gray-300 my-2 pl-[10px]">
                {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements}
              </div>
              <div className="flex flex-col items-center mt-4">


                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <div
                    onClick={currentPage === 0 ? undefined : handlePrevPage}
                    className={currentPage === 0 ? "cursor-not-allowed" : "cursor-pointer"}
                  >
                    <SvgIcons
                      iconName="LeftArrow"
                      fill={currentPage === 0 ? (isDarkMode ? "#4B5563" : "#D1D5DB") : (isDarkMode ? "#9CA3AF" : "#6B7280")}
                      className="w-[20px] h-[20px]"
                    />
                  </div>

                  {renderPaginationButtons()}

                  <div
                    onClick={currentPage >= totalPages - 1 ? undefined : handleNextPage}
                    className={currentPage >= totalPages - 1 ? "cursor-not-allowed" : "cursor-pointer"}
                  >
                    <SvgIcons
                      iconName="ArrowRight"
                      fill={currentPage >= totalPages - 1 ? (isDarkMode ? "#4B5563" : "#D1D5DB") : (isDarkMode ? "#9CA3AF" : "#6B7280")}
                      className="w-[20px] h-[20px]"
                    />
                  </div>
                </div>
              </div></>

          )}
        </div>
      </div>

      {/* Sağ Panel */}
    
    </div>
  );
};

export default NotificationPage;