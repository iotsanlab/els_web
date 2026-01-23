import { SvgIcons } from "../../assets/icons/SvgIcons";
import GeneralTitle from "../../components/Title/GeneralTitle";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { 
  getTimerSetting, 
  saveTimerSetting, 
  getUserId, 
  saveAiChatSetting, 
  getAiChatSetting,
  getWeatherCities,
  saveWeatherCities,
  getMachineSpecificSettings,
  saveMachineSpecificSettings
} from "../../services/auth";
import SwitchUI from "../../components/Switch";
import serviceExc from "../../assets/service/serviceExc.png";
import serviceBackhoe from "../../assets/service/serviceBackhoe.png";
import serviceTele from "../../assets/service/serviceTele.png";
import serviceExcWhite from "../../assets/service/serviceExcWhite.png";
import serviceBackhoeWhite from "../../assets/service/serviceBackhoeWhite.png";
import serviceTeleWhite from "../../assets/service/serviceTeleWhite.png";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  updateAssetAlarmSettings,
  getAssetAlarmSettings
} from "../../services/alarms";
import { getAssetIDByUserId } from "../../data/Assets";

const CITIES: { id: number; name: string; value?: string }[] = [
    { id: 1, name: "Adana" },
    { id: 2, name: "Adıyaman" },
    { id: 3, name: "Afyonkarahisar" },
    { id: 4, name: "Ağrı" },
    { id: 5, name: "Amasya" },
    { id: 6, name: "Ankara" },
    { id: 7, name: "Antalya" },
    { id: 8, name: "Artvin" },
    { id: 9, name: "Aydın" },
    { id: 10, name: "Balıkesir" },
    { id: 11, name: "Bilecik" },
    { id: 12, name: "Bingöl" },
    { id: 13, name: "Bitlis" },
    { id: 14, name: "Bolu" },
    { id: 15, name: "Burdur" },
    { id: 16, name: "Bursa" },
    { id: 17, name: "Çanakkale" },
    { id: 18, name: "Çankırı" },
    { id: 19, name: "Çorum" },
    { id: 20, name: "Denizli" },
    { id: 21, name: "Diyarbakır" },
    { id: 22, name: "Edirne" },
    { id: 23, name: "Elazığ" },
    { id: 24, name: "Erzincan" },
    { id: 25, name: "Erzurum" },
    { id: 26, name: "Eskişehir" },
    { id: 27, name: "Gaziantep" ,value: "Antep"},
    { id: 28, name: "Giresun" },
    { id: 29, name: "Gümüşhane" },
    { id: 30, name: "Hakkâri" },
    { id: 31, name: "Hatay" },
    { id: 32, name: "Isparta" },
    { id: 33, name: "Mersin" },
    { id: 34, name: "İstanbul" ,value: "Istanbul"},
    { id: 35, name: "İzmir" ,value: "Izmir"},
    { id: 36, name: "Kars" },
    { id: 37, name: "Kastamonu" },
    { id: 38, name: "Kayseri" },
    { id: 39, name: "Kırklareli" },
    { id: 40, name: "Kırşehir" },
    { id: 41, name: "Kocaeli" },
    { id: 42, name: "Konya" },
    { id: 43, name: "Kütahya" },
    { id: 44, name: "Malatya" },
    { id: 45, name: "Manisa" },
    { id: 46, name: "Kahramanmaraş" },
    { id: 47, name: "Mardin" },
    { id: 48, name: "Muğla" },
    { id: 49, name: "Muş" },
    { id: 50, name: "Nevşehir" },
    { id: 51, name: "Niğde" },
    { id: 52, name: "Ordu" },
    { id: 53, name: "Rize" },
    { id: 54, name: "Sakarya" },
    { id: 55, name: "Samsun" },
    { id: 56, name: "Siirt" },
    { id: 57, name: "Sinop" },
    { id: 58, name: "Sivas" },
    { id: 59, name: "Tekirdağ" },
    { id: 60, name: "Tokat" },
    { id: 61, name: "Trabzon" },
    { id: 62, name: "Tunceli" },
    { id: 63, name: "Şanlıurfa" },
    { id: 64, name: "Uşak" },
    { id: 65, name: "Van" },
    { id: 66, name: "Yozgat" },
    { id: 67, name: "Zonguldak" },
    { id: 68, name: "Aksaray" },
    { id: 69, name: "Bayburt" },
    { id: 70, name: "Karaman" },
    { id: 71, name: "Kırıkkale" },
    { id: 72, name: "Batman" },
    { id: 73, name: "Şırnak" },
    { id: 74, name: "Bartın" },
    { id: 75, name: "Ardahan" },
    { id: 76, name: "Iğdır" },
    { id: 77, name: "Yalova" },
    { id: 78, name: "Karabük" },
    { id: 79, name: "Kilis" },
    { id: 80, name: "Osmaniye" },
    { id: 81, name: "Düzce" }
].sort((a, b) => a.name.localeCompare(b.name)); // Alfabetik sıralama

const SettingsPage = () => {
    const { t } = useTranslation();
    const { isDarkMode } = useDarkMode();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Timer ayarları
    const [initialDelay, setInitialDelay] = useState<number>(1);
    const [selectedDelay, setSelectedDelay] = useState(1);
    const [userID, setUserID] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Hava durumu ayarları
    const [initialWeatherCities, setInitialWeatherCities] = useState<number[]>([]);
    const [selectedWeatherCities, setSelectedWeatherCities] = useState<number[]>([]);
    const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState(false);
    const [weatherSearchTerm, setWeatherSearchTerm] = useState("");
    const [weatherSaveStatus, setWeatherSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [isWeatherLoading, setIsWeatherLoading] = useState(false);

    // Bildirim ayarları
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
            speedLimitLogging: false,
            bypassCountLogging: false,
        },
        excavator: {},
        backhoeloader: {}
    });

    const [isNotificationLoading, setIsNotificationLoading] = useState(false);

    // AI Chat Widget ayarı
    const [aiChatEnabled, setAiChatEnabled] = useState(false);
    const [isAiChatLoading, setIsAiChatLoading] = useState(false);

    // Değişiklik kontrolü
    const hasChanges = selectedDelay !== initialDelay;
    const hasWeatherChanges = JSON.stringify(selectedWeatherCities.sort()) !== JSON.stringify(initialWeatherCities.sort());

    // Dropdown dışına tıklama kontrolü
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsWeatherDropdownOpen(false);
                setWeatherSearchTerm("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // User ID'yi al
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserId();
                if (response) {
                    setUserID(response);
                    console.log("userID", userID, "res", response);
                }
            } catch (err) {
                console.error("user id hatası:", err);
            }
        };

        fetchData();
    }, []);

    // Timer, AI Chat ve Weather ayarlarını yükle
    useEffect(() => {
        const fetchSettings = async () => {
            if (!userID) return;

            try {
                // Timer ayarını yükle
                const timerValue = await getTimerSetting(userID);
                const aiChatValue = await getAiChatSetting(userID);
                console.log("timerValue", timerValue, "aiChatValue", aiChatValue);
                
                if (timerValue !== null) {
                    setInitialDelay(timerValue);
                    setSelectedDelay(timerValue);
                }

                // AI Chat ayarını yükle
                if (aiChatValue !== null) {
                    setAiChatEnabled(aiChatValue);
                }
                
                // Hava durumu şehirlerini yükle
                const weatherCities = await getWeatherCities(userID);
                if (weatherCities && weatherCities.length > 0) {
                    const cityIds = weatherCities
                        .map((cityName: string) => CITIES.find(c => c.name === cityName || c.value === cityName)?.id)
                        .filter((id): id is number => id !== undefined);
                    setInitialWeatherCities(cityIds);
                    setSelectedWeatherCities(cityIds);
                }
            } catch (error) {
                console.error("Ayarlar alınırken hata:", error);
            }
        };

        fetchSettings();
    }, [userID]);

    // Alarm ayarlarını yükle
    useEffect(() => {
        loadAlarmSettings();
    }, []);

    // Makine özel ayarlarını yükle
    useEffect(() => {
        const fetchMachineSettings = async () => {
            if (!userID) return;

            try {
                const settings = await getMachineSpecificSettings(userID);
                if (settings) {
                    setMachineSpecificSettings(prev => ({
                        ...prev,
                        ...settings
                    }));
                }
            } catch (error) {
                console.error("Makine özel ayarları alınırken hata:", error);
            }
        };

        fetchMachineSettings();
    }, [userID]);

    const loadAlarmSettings = async () => {
        try {
            setIsNotificationLoading(true);
            const assetId = await getAssetIDByUserId() || "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f";
            const response = await getAssetAlarmSettings(assetId);
            if (response && Object.keys(response).length > 0) {
                setAlarmSettings(prev => ({
                    ...prev,
                    ...response
                }));
            }
        } catch (error) {
            console.error("❌ Alarm ayarları yüklenirken hata:", error);
        } finally {
            setIsNotificationLoading(false);
        }
    };

    const handleToggleChange = async (key: keyof typeof alarmSettings, value: boolean) => {
        const updatedSettings = { ...alarmSettings, [key]: value };
        setAlarmSettings(updatedSettings);

        const assetId = await getAssetIDByUserId() || "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f";

        try {
            setIsNotificationLoading(true);
            await updateAssetAlarmSettings(assetId, updatedSettings);
        } catch (error) {
            console.error("❌ Alarm ayarı güncellenirken hata:", error);
            setAlarmSettings(alarmSettings);
            alert("Alarm ayarı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsNotificationLoading(false);
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
            setIsNotificationLoading(true);
            // Makine özel ayarları kaydet
            if (userID) {
                await saveMachineSpecificSettings(userID, updatedSettings);
                console.log(`✅ ${machineType} ${settingKey} ayarı güncellendi:`, value);
            }
        } catch (error) {
            console.error("❌ Makine özel ayarı güncellenirken hata:", error);
            setMachineSpecificSettings(machineSpecificSettings);
            alert("Makine özel ayarı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsNotificationLoading(false);
        }
    };

    // AI Chat Widget ayarını güncelleme
    const handleAiChatToggle = async (value: boolean) => {
        try {
            setIsAiChatLoading(true);
            await saveAiChatSetting(userID, value);
            setAiChatEnabled(value);
            console.log(`✅ AI Chat Widget ${value ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`);
        } catch (error) {
            console.error("❌ AI Chat ayarı güncellenirken hata:", error);
            setAiChatEnabled(!value);
            alert("AI Chat ayarı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsAiChatLoading(false);
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

    const filteredCities = CITIES.filter(city => {
        const searchLower = weatherSearchTerm.toLowerCase();
        const cityNameLower = city.name.toLowerCase();
        // İstanbul için özel kontrol (hem İstanbul hem de Istanbul)
        const matchesSearch = cityNameLower.includes(searchLower) ||
            (city.name === "İstanbul" && "istanbul".includes(searchLower));
        return matchesSearch && !selectedWeatherCities.includes(city.id);
    });

    const handleDelayChange = (newDelay: number) => {
        setSelectedDelay(newDelay);
        setSaveStatus('idle');
    };

    const handleSave = async () => {
        if (!userID || !hasChanges) return;

        setSaveStatus('saving');
        setIsLoading(true);

        try {
            const success = await saveTimerSetting(userID, selectedDelay);
            if (success) {
                setInitialDelay(selectedDelay);
                setSaveStatus('success');
                setTimeout(() => {
                    setSaveStatus('idle');
                }, 2000);
            } else {
                setSaveStatus('error');
                setTimeout(() => {
                    setSaveStatus('idle');
                }, 3000);
            }
        } catch (error) {
            console.error("Kaydetme sırasında hata:", error);
            setSaveStatus('error');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedDelay(initialDelay);
        setSaveStatus('idle');
    };

    // Hava durumu fonksiyonları
    const handleAddWeatherCity = (cityId: number) => {
        if (selectedWeatherCities.length < 5 && !selectedWeatherCities.includes(cityId)) {
            setSelectedWeatherCities([...selectedWeatherCities, cityId]);
            setWeatherSearchTerm("");
            setIsWeatherDropdownOpen(false);
            setWeatherSaveStatus('idle');
        }
    };

    const handleRemoveWeatherCity = (cityId: number) => {
        setSelectedWeatherCities(selectedWeatherCities.filter(id => id !== cityId));
        setWeatherSaveStatus('idle');
    };

    const handleWeatherSave = async () => {
        if (!userID || !hasWeatherChanges) return;

        setWeatherSaveStatus('saving');
        setIsWeatherLoading(true);

        try {
            // Şehir ID'lerini şehir isimlerine çevir (value varsa value, yoksa name)
            const weatherCitiesName = selectedWeatherCities
                .map(cityId => {
                    const city = CITIES.find(c => c.id === cityId);
                    return city?.value || city?.name;
                })
                .filter((name): name is string => name !== undefined);

            const success = await saveWeatherCities(userID, weatherCitiesName);

            if (success) {
                setInitialWeatherCities([...selectedWeatherCities]);
                setWeatherSaveStatus('success');
                setTimeout(() => {
                    setWeatherSaveStatus('idle');
                }, 2000);
            } else {
                setWeatherSaveStatus('error');
                setTimeout(() => {
                    setWeatherSaveStatus('idle');
                }, 3000);
            }
        } catch (error) {
            console.error("Hava durumu kaydetme sırasında hata:", error);
            setWeatherSaveStatus('error');
            setTimeout(() => {
                setWeatherSaveStatus('idle');
            }, 3000);
        } finally {
            setIsWeatherLoading(false);
        }
    };

    const handleWeatherCancel = () => {
        setSelectedWeatherCities([...initialWeatherCities]);
        setWeatherSaveStatus('idle');
    };

    const getSaveStatusMessage = () => {
        switch (saveStatus) {
            case 'saving':
                return {
                    text: t("global.saving", "Saving..."),
                    icon: "Loading",
                    color: "text-blue-600"
                };
            case 'success':
                return {
                    text: t("global.saved", "Saved successfully!"),
                    icon: "Check",
                    color: "text-green-600"
                };
            case 'error':
                return {
                    text: t("global.saveError", "Save failed. Try again."),
                    icon: "Warning",
                    color: "text-red-600"
                };
            default:
                return null;
        }
    };

    const getWeatherSaveStatusMessage = () => {
        switch (weatherSaveStatus) {
            case 'saving':
                return {
                    text: t("global.saving", "Saving..."),
                    icon: "Loading",
                    color: "text-blue-600"
                };
            case 'success':
                return {
                    text: t("global.saved", "Saved successfully!"),
                    icon: "Check",
                    color: "text-green-600"
                };
            case 'error':
                return {
                    text: t("global.saveError", "Save failed. Try again."),
                    icon: "Warning",
                    color: "text-red-600"
                };
            default:
                return null;
        }
    };

    const statusMessage = getSaveStatusMessage();
    const weatherStatusMessage = getWeatherSaveStatusMessage();

    return (
        <div className="w-[1184px] max-h-full flex flex-col">
            <GeneralTitle title={t("profileModal.settings")} />
            <div className="w-full flex-1 bg-white dark:bg-gray10 flex flex-col p-[20px] rounded-[10px] drop-shadow-[2px_2px_4px_#00000026] overflow-y-auto">

                {/* Data Update Frequency Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        {t("global.dataUpdateFrequency")}
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("global.selectUpdateFrequency")}
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {t("global.updateFrequencyDesc", "Choose how often the dashboard data should refresh automatically")}
                                </p>

                                {/* Radio Button Style Options */}
                                <div className="grid grid-cols-5 gap-3 max-w-2xl">
                                    {[1, 2, 4, 5, 10].map((sec) => (
                                        <div
                                            key={sec}
                                            onClick={() => handleDelayChange(sec)}
                                            className={`
                                                relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200
                                                ${selectedDelay === sec
                                                    ? 'border-mstYellow bg-mstYellow/10 dark:bg-mstYellow/20'
                                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                                                }
                                                hover:shadow-md
                                            `}
                                        >
                                            {/* Selection Indicator Circle */}
                                            <div className="absolute top-2 right-2">
                                                <div className={`
                                                    w-4 h-4 rounded-full border-2 transition-all duration-200
                                                    ${selectedDelay === sec
                                                        ? 'border-mstYellow bg-mstYellow'
                                                        : 'border-gray-300 dark:border-gray-500 bg-transparent'
                                                    }
                                                `}>
                                                    {selectedDelay === sec && (
                                                        <div className="w-full h-full rounded-full flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="pt-2">
                                                <div className={`
                                                    text-2xl font-bold mb-1 transition-colors duration-200 ${selectedDelay === sec ? 'text-mstYellow' : 'text-gray-900 dark:text-white'}`}>
                                                    {sec}
                                                </div>
                                                <div className={`text-sm font-medium transition-colors duration-200 ${selectedDelay === sec ? 'text-mstYellow/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {t("global.second")}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Save/Cancel Buttons */}
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex-1">
                                        {/* Save Status Message */}
                                        {statusMessage && (
                                            <div className={`flex items-center ${statusMessage.color}`}>
                                                <SvgIcons
                                                    iconName={statusMessage.icon}
                                                    fill="currentColor"
                                                    className={`w-4 h-4 mr-2 ${saveStatus === 'saving' ? 'animate-spin' : ''}`}
                                                />
                                                <span className="text-sm font-medium">
                                                    {statusMessage.text}
                                                </span>
                                            </div>
                                        )}

                                        {!statusMessage && hasChanges && (
                                            <div className="flex items-center text-amber-600">
                                                <SvgIcons iconName="Warning" fill="currentColor" className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">
                                                    {t("global.unsavedChanges")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={!hasChanges || isLoading}
                                            className={`
                                                px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200
                                                ${hasChanges && !isLoading
                                                    ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {t("global.cancel")}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={!hasChanges || isLoading || !userID}
                                            className={`
                                                px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                                                ${hasChanges && !isLoading && userID
                                                    ? 'bg-mstYellow text-white hover:bg-mstYellow/90 shadow-sm hover:shadow-md'
                                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center">
                                                    <SvgIcons iconName="Loading" fill="currentColor" className="w-4 h-4 mr-2 animate-spin" />
                                                    {t("global.saveloading")}
                                                </div>
                                            ) : (
                                                t("global.save")
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weather Settings Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        {t("global.weatherSettings")}
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("global.selectCities", "Select Cities")}
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {t("global.weatherCitiesDesc", "Choose up to 5 cities to display weather information on your dashboard")}
                                </p>

                                <div className="relative mb-4" ref={dropdownRef}>
                                    <div
                                        className={`
                                            w-full max-w-md px-4 py-3 border-2 rounded-lg transition-all duration-200
                                            ${selectedWeatherCities.length >= 5
                                                ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                                                : isWeatherDropdownOpen
                                                    ? 'border-mstYellow bg-white dark:bg-gray-700 shadow-md'
                                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 cursor-text'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <input
                                                type="text"
                                                value={weatherSearchTerm}
                                                onChange={(e) => setWeatherSearchTerm(e.target.value)}
                                                onFocus={() => {
                                                    if (selectedWeatherCities.length < 5) {
                                                        setIsWeatherDropdownOpen(true);
                                                    }
                                                }}
                                                placeholder={
                                                    selectedWeatherCities.length >= 5
                                                        ? t("global.maxCitiesReached", "Maximum 5 cities selected")
                                                        : t("global.searchCities", "Search cities...")
                                                }
                                                disabled={selectedWeatherCities.length >= 5}
                                                className={`
                                                    w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                                                    ${selectedWeatherCities.length >= 5 ? 'cursor-not-allowed' : ''}
                                                `}
                                            />

                                            <div className="flex-shrink-0 cursor-pointer" onClick={() => {
                                                if (selectedWeatherCities.length < 5) {
                                                    setIsWeatherDropdownOpen(!isWeatherDropdownOpen);
                                                }
                                            }}>
                                                <SvgIcons iconName="Search" fill="#dedede" />
                                            </div>

                                        </div>
                                    </div>

                                    {isWeatherDropdownOpen && selectedWeatherCities.length < 5 && (
                                        <div className="absolute z-10 w-full max-w-md mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {filteredCities.length > 0 ? (
                                                filteredCities.map((city) => (
                                                    <div
                                                        key={city.id}
                                                        onClick={() => handleAddWeatherCity(city.id)}
                                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors duration-200"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{city.name}</span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                ({city.id.toString().padStart(2, '0')})
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                                                    {t("global.noCitiesFound", "No cities found")}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedWeatherCities.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {t("global.selectedCities")} ({selectedWeatherCities.length}/5)
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedWeatherCities.map((cityId) => {
                                                const city = CITIES.find(c => c.id === cityId);
                                                return (
                                                    <div
                                                        key={cityId}
                                                        className="flex items-center gap-2 px-3 py-2 bg-mstYellow/10 dark:bg-mstYellow/20 border border-mstYellow/30 rounded-lg text-mstYellow"
                                                    >
                                                        <SvgIcons iconName="MapPin" fill="currentColor" className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{city?.name}</span>
                                                        <div
                                                            onClick={() => handleRemoveWeatherCity(cityId)}
                                                            className="ml-2 text-black cursor-pointer "
                                                            title={t("global.removeCity")}>
                                                            x
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex-1">
                                        {/* Save Status Message */}
                                        {weatherStatusMessage && (
                                            <div className={`flex items-center ${weatherStatusMessage.color}`}>
                                                <SvgIcons
                                                    iconName={weatherStatusMessage.icon}
                                                    fill="currentColor"
                                                    className={`w-4 h-4 mr-2 ${weatherSaveStatus === 'saving' ? 'animate-spin' : ''}`}
                                                />
                                                <span className="text-sm font-medium">
                                                    {weatherStatusMessage.text}
                                                </span>
                                            </div>
                                        )}

                                        {!weatherStatusMessage && hasWeatherChanges && (
                                            <div className="flex items-center text-amber-600">
                                                <SvgIcons iconName="Warning" fill="currentColor" className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">
                                                    {t("global.unsavedChanges")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleWeatherCancel}
                                            disabled={!hasWeatherChanges || isWeatherLoading}
                                            className={`
                                                px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200
                                                ${hasWeatherChanges && !isWeatherLoading
                                                    ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {t("global.cancel")}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleWeatherSave}
                                            disabled={!hasWeatherChanges || isWeatherLoading || !userID}
                                            className={`
                                                px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                                                ${hasWeatherChanges && !isWeatherLoading && userID
                                                    ? 'bg-mstYellow text-white hover:bg-mstYellow/90 shadow-sm hover:shadow-md'
                                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {isWeatherLoading ? (
                                                <div className="flex items-center">
                                                    <SvgIcons iconName="Loading" fill="currentColor" className="w-4 h-4 mr-2 animate-spin" />
                                                    {t("global.saveloading")}
                                                </div>
                                            ) : (
                                                t("global.save")
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bildirim Ayarları */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        {t("notifPage.title2")}
                    </h3>

                    {/* Global Bildirim Ayarları */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
                      
                        {isNotificationLoading ? (
                            <div className="text-center text-sm text-gray-500 mb-2">
                                {t("global.saveloading")}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const key = `alarm${i}` as keyof typeof alarmSettings;
                                    return (
                                        <div key={i} className="flex items-center justify-between w-full py-2">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[500px]">
                                                {t(`notifPage.toggle${i}`)}
                                            </p>
                                            <SwitchUI
                                                isChecked={alarmSettings[key]}
                                                onChange={(val) => handleToggleChange(key, val)}
                                                disabled={isNotificationLoading}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                  

                    {/* Diğer Ayarlar */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                            {t("global.otherSettings")}
                        </h4>

                        {/* AI Chat Widget */}
                        <div className="flex items-center justify-between w-full py-3">
                            <div className="flex flex-col max-w-[600px]">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("global.aiChatWidget")}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {t("global.aiChatWidgetDesc")}
                                </p>
                            </div>
                            <SwitchUI
                                isChecked={aiChatEnabled}
                                onChange={handleAiChatToggle}
                                disabled={isAiChatLoading}
                            />
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
