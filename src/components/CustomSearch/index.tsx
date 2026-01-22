import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { observer } from "mobx-react";
import deviceAttributes from "../../store/DeviceAttributes";
import deviceWorkStore from "../../store/DeviceTelemetry";
import deviceWarningStore from "../../store/Warnings";
import { useTranslation } from "react-i18next";

interface MachineResult {
  id: string;
  serialNo: string;
  model: string;
  type: string;
  deviceName: string;
  location: string;
}

const CustomSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<MachineResult[]>([]);
  const [allMachines, setAllMachines] = useState<MachineResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Makine verilerini hazırlama
  useEffect(() => {
    if (!deviceAttributes.all || deviceAttributes.all.length === 0) return;

    const mappedMachines: MachineResult[] = deviceAttributes.all.map(([id, attrs]) => {
      const getAttr = (key: string) => attrs.find(a => a.key === key)?.value ?? "";
      const warningCount = deviceWarningStore.warningCountsByDevice[id] || 0;

      // Son stat değerini kontrol et
      const lastStat = deviceWorkStore.getTelemetry(id, "stat").at(-1)?.value;
      const isActive = lastStat ? Number(lastStat) > 0 : false;

      return {
        id,
        serialNo: getAttr("SeriNo"),
        model: getAttr("Model"),
        type: getAttr("Type"),
        deviceName: getAttr("deviceName") || getAttr("Model"),
        location: deviceWorkStore?.getCity(id) ?? "",
        active: isActive,
        warnings: warningCount,
      };
    });

    setAllMachines(mappedMachines);
}, [deviceAttributes.all, deviceWorkStore.getCity]); // cities mobx observable ise re-render olur

  // Arama fonksiyonu
  const performSearch = useCallback((searchText: string) => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    const lowerSearch = searchText.toLowerCase();

    const filtered = allMachines.filter(machine =>
      machine.serialNo.toLowerCase().includes(lowerSearch) ||
      machine.model.toLowerCase().includes(lowerSearch) ||
      machine.type.toLowerCase().includes(lowerSearch) ||
      machine.deviceName.toLowerCase().includes(lowerSearch) ||
      machine.location.toLowerCase().includes(lowerSearch)
    );

    // En fazla 8 sonuç göster
    setSearchResults(filtered.slice(0, 8));
    setIsLoading(false);
  }, [allMachines]);

  // Input değişikliği
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    performSearch(value);
  };

  // Arama kutusunu aç/kapat
  const handleSearchClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Makine satırına tıklama
  const handleMachineClick = (machineId: string) => {
    navigate(`/vehicle/${machineId}`);
    setIsExpanded(false);
    setInputValue("");
    setSearchResults([]);
  };

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setInputValue("");
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ESC tuşu ile kapat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
        setInputValue("");
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full md:w-auto" ref={searchRef}>
      {/* Arama Kutusu */}
      <div
        className={`flex items-center h-9 rounded-full px-3 transition-all duration-300 ${isExpanded ? 'w-64 border-2 border-white bg-white/10' : 'w-9 bg-transparent'
          } cursor-pointer`}
        onClick={handleSearchClick}
      >
        {/* Search Icon */}
        <div className="flex-shrink-0">
          <SvgIcons iconName="Search" fill="white" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={`bg-transparent text-white placeholder-white/70 outline-none px-2 transition-all duration-300 ${isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          placeholder={t("global.searchPlaceholder")}
        />

        {/* Clear Button */}
        {isExpanded && inputValue && (
          <div
            className="flex-shrink-0 cursor-pointer hover:bg-white/20 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              setInputValue("");
              setSearchResults([]);
              inputRef.current?.focus();
            }}
          >
            <SvgIcons iconName="Close" fill="white" className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Arama Sonuçları Dropdown */}
      {isExpanded && (searchResults.length > 0 || isLoading || inputValue.trim()) && (
        <div className="absolute top-10 left-0 w-80 bg-white dark:bg-gray10 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="text-gray-500 text-sm">
                {t("generalMachinesPage.searching", "Searching...")}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 font-medium">
                  {t("global.searchResult")} ({searchResults.length})
                </span>
              </div>
              {searchResults.map((machine) => (
                <div
                  key={machine.id}
                  className="
                  flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  onClick={() => handleMachineClick(machine.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {machine.deviceName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {machine.serialNo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">

                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          {machine.type}
                        </span>
                       {/* 
                        {machine.location && (
                          <span className="text-xs text-gray-500">
                            {machine.location}
                          </span>
                        )}
                        */}
                      </div>
                      <SvgIcons
                        iconName="RightArrow"
                        fill="#B9C2CA"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </>
          ) : inputValue.trim() ? (
            <div className="px-4 py-8 text-center">
              <SvgIcons iconName="Search" fill="#9CA3AF" className="w-8 h-8 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {t("global.noFound")}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {t("global.tryDiff")}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default observer(CustomSearch);
