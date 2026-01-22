import { useState } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import FilterCheckbox from "../Home/filterCheckbox";
import { useTranslation } from 'react-i18next';

interface SearchAreaProps {
  onSearchChange?: (searchText: string) => void;
  onFilterChange?: (selectedFilters: string[]) => void;
}

const SearchArea = ({ onSearchChange, onFilterChange }: SearchAreaProps) => {
  const {t} = useTranslation();
  const checkboxOptions = [ "AE15", "EL12", "VM6"];
  const { isDarkMode } = useDarkMode();
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleFilterChange = (selected: string[]) => {
    setSelectedFilters(selected);
    if (onFilterChange) {
      onFilterChange(selected);
    }
  };

  return (
    <div className="h-32 w-full bg-white dark:bg-gray10  drop-shadow-[2px_2px_4px_#00000026] rounded-[10px] p-[20px]">
      <div className="flex items-center mb-2">
        <div className="grid w-full grid-cols-1">
          <input
            id="account-number"
            name="account-number"
            type="text"
            placeholder={t("global.seriModel")}
            value={searchText}
            onChange={handleSearchChange}
            className="col-start-1 border border-gray4 row-start-1 block w-full rounded-[10px] bg-white dark:bg-gray10 dark:border-gray8 dark:text-gray8 py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray4 placeholder:font-inter focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pr-9 sm:text-sm/6"
          />
          <div className="self-center col-start-1 row-start-1 mr-3 text-gray-400 rounded-full cursor-pointer size-5 justify-self-end hover:bg-slate-100">
            <SvgIcons iconName="Search" fill={isDarkMode ? '#5D6974' : '#B9C2CA'} />
          </div>
        </div>

      </div>

      <FilterCheckbox 
        options={checkboxOptions} 
        onChange={handleFilterChange}
        selectedOptions={selectedFilters}
        type2={true}
      />
    </div>
  );
};

export default SearchArea;
