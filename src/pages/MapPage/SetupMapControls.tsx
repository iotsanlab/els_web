import { useEffect, useState, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useTranslation } from "react-i18next";

const SetupMapControls = () => {
  const map = useMap();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("roadmap");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mapTypes = [
    { id: "roadmap", label: t("map.roadmap") || "Harita" },
    { id: "hybrid", label: t("map.satellite") || "Uydu" },
    { id: "terrain", label: t("map.terrain") || "Arazi" },
  ];

  useEffect(() => {
    if (!map) return;
    map.setOptions({ mapTypeControl: false });
  }, [map]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectType = (typeId: string) => {
    if (map) {
      map.setMapTypeId(typeId);
      setSelectedType(typeId);
    }
    setIsOpen(false);
  };

  const currentLabel = mapTypes.find(type => type.id === selectedType)?.label || mapTypes[0].label;

  return (
    <div 
      ref={dropdownRef}
      className="absolute z-10 top-2 right-2"
    >
      {/* Ana buton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-5 py-3 bg-white dark:bg-gray10 text-gray10 dark:text-white text-sm font-medium shadow-md hover:bg-gray-50 transition-colors border border-gray3"
        style={{ borderRadius: '2px' }}
      >
        {currentLabel}
        <svg 
          className="w-3 h-3 ml-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown menü */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-0 bg-white dark:bg-gray10 shadow-lg overflow-hidden min-w-[100px] border border-gray3"
          style={{ borderRadius: '2px' }}
        >
          {mapTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className="w-full px-3 py-2 text-left text-sm bg-white dark:bg-gray10 hover:bg-gray1 transition-colors flex items-center gap-2 text-gray10"
            >
              {/* Checkbox ikonu */}
              {selectedType === type.id ? (
                <svg className="w-4 h-4 text-gray10 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="w-4 h-4 text-gray10 dark:text-white" />
              )}
              <span className="text-gray10 dark:text-white">{type.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetupMapControls;