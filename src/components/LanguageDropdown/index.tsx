import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import i18n from "../../context/i18n";
import { useState } from "react";
interface LanguageDropdownProps {
  setLanguage?: (language: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  setLanguage,
}) => {

  const [languageState, setLanguageState] = useState<string>(localStorage.getItem("language") || "tr");

  const handleLanguageChange = (language: string) => {
    setLanguage?.(language);
    i18n.changeLanguage(language);
    // localStorage'a kaydet
    localStorage.setItem("language", language);
    setLanguageState(language);
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className={"bg-transparent border-none p-0 flex items-center justify-center hover:border-white focus:outline-none focus:ring-0"}>
        <div className="flex items-center gap-1">
          <SvgIcons iconName="Language" fill="white" />
          <span className="text-white text-[16px] font-inter font-bold tracking-[1.38px]">
            {languageState.toUpperCase()}
          </span>
        </div>
      </MenuButton>

      <MenuItems className="absolute right-0 z-50 w-56 mt-2 bg-white rounded-[10px] shadow-lg top-full ring-1 ring-black/5 focus:outline-none">
        <MenuItem>
          <div
            className="flex items-center gap-1 px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleLanguageChange("tr")}
          >
            <span className="text-black text-[16px] font-inter font-bold tracking-[1.38px]">
              TR
            </span>
          </div>
        </MenuItem>
        <MenuItem>
          <div
            className="flex items-center gap-1 px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleLanguageChange("en")}
          >
            <span className="text-black text-[16px] font-inter font-bold tracking-[1.38px]">
              EN
            </span>
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default LanguageDropdown;
