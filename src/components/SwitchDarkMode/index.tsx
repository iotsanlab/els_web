import React from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { Switch } from "@headlessui/react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useLocation } from "react-router-dom";

const SwitchDarkMode: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const handleToggle = () => {
    toggleDarkMode();

    // Ekran "MapScreen" ise refresh yap
    if (location.pathname === "/Map") {
      // Sayfayı yeniden yükle
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-2 mx-2 min-w-[135px] justify-center">
      <div className="min-w-[32px] min-h-[32px]">
        {!isDarkMode && <SvgIcons iconName="Sunny" fill="white" />}
      </div>

      <Switch
        checked={isDarkMode}
        onChange={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full border-2 border-white bg-transparent px-[24px] hover:border-white focus:outline-none focus:ring-0" 
      >
        <span className="sr-only">Use setting</span>
        <span
          className={`${
            isDarkMode ? "translate-x-1" : "-translate-x-5"
          } h-4 w-4 min-w-4 transform rounded-full transition bg-white`}
        />
      </Switch>

      <div className="min-w-[32px] min-h-[32px]">
        {isDarkMode && <SvgIcons iconName="Moon" fill="white" />}
      </div>
    </div>
  );
};

export default SwitchDarkMode;
