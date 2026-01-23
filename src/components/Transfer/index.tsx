import { useEffect, useState } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import machineParametersByType from "../../data/MachineParameters";
import { MachineParameter } from "../../utils/machine";
import { useTranslation } from "react-i18next";
interface TransferProps {
  availableItemsList?: string[];
  selectedItemsList?: string[];
  onItemsChange?: (availableItemsList: string[], selectedItemsList: string[]) => void;
  machineType?: string;
  subtype?: string;
}

interface Item {
  name: string;
  parameter: string;
}

const Transfer = ({
  availableItemsList = [],
  selectedItemsList = [],
  onItemsChange,
  machineType = "Excavator",
  subtype
}: TransferProps) => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

useEffect(() => {
  // Subtype kontrolü ile doğru parametre listesini al (USA ve Develon için özel durum)
  let parameters: MachineParameter[] = [];
  if (subtype === "Develon") {
    parameters = machineParametersByType["Develon"] || [];
  } else if (subtype === "USA") {
    parameters = machineParametersByType["USA"] || [];
  } else {
    parameters = machineParametersByType[machineType] || [];
  }

  const availableItems = availableItemsList.map((parameter: string) => {
    const machineParameter = parameters.find((p: MachineParameter) => p.parameter === parameter);
    return {
      name: t(machineParameter?.lang_key || "") || "",
      parameter: parameter || ""
    };
  }).filter(item => item.parameter);

  const selectedItems = selectedItemsList.map((parameter: string) => {
    const machineParameter = parameters.find((p: MachineParameter) => p.parameter === parameter);
    return {
      name: t(machineParameter?.lang_key || "") || "",
      parameter: parameter || ""
    };
  }).filter(item => item.parameter);

  setAvailableItems(availableItems);
  setSelectedItems(selectedItems);
}, [availableItemsList, selectedItemsList, machineType, subtype]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleAddItem = (item: Item) => {
    if (!item || !item.parameter) return;
    
    const newAvailableItems = availableItems.filter((i) => i.parameter !== item.parameter);
    const newSelectedItems = [...selectedItems, item];
    
    setAvailableItems(newAvailableItems);
    setSelectedItems(newSelectedItems);

    console.log(newAvailableItems, newSelectedItems, 'newAvailableItems, newSelectedItems', 'transfer add item');
    
    if (onItemsChange) {
      const newAvailableItemsList = newAvailableItems.map((item: Item) => item.parameter);
      const newSelectedItemsList = newSelectedItems.map((item: Item) => item.parameter);
      onItemsChange(newAvailableItemsList, newSelectedItemsList);
    }
  };

  const handleRemoveItem = (item: Item) => {
    if (!item || !item.parameter) return;
    
    const newSelectedItems = selectedItems.filter((i) => i.parameter !== item.parameter);
    const newAvailableItems = [...availableItems, item];
    
    setSelectedItems(newSelectedItems);
    setAvailableItems(newAvailableItems);

    console.log(newAvailableItems, newSelectedItems, 'newAvailableItems, newSelectedItems', 'transfer remove item');
    
    if (onItemsChange) {
      console.log(newAvailableItems, newSelectedItems, 'newAvailableItems, newSelectedItems');
      const newAvailableItemsList = newAvailableItems.map((item: Item) => item.parameter);
      const newSelectedItemsList = newSelectedItems.map((item: Item) => item.parameter);
      onItemsChange(newAvailableItemsList, newSelectedItemsList);
    }
  };

  const filteredAvailableItems = availableItems.filter((item: Item) =>
    item.parameter && item.name && 
    (item.parameter.toLowerCase().includes(searchText.toLowerCase()) || 
     item.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="flex flex-col w-full h-full mt-[20px]">
      <div className="grid w-full grid-cols-1">
        <input
          id="account-number"
          name="account-number"
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder={t("machineInfoPage.treeSelectCard.search")}
          className="col-start-1 border border-gray4 row-start-1 block w-full rounded-[10px] bg-white dark:bg-gray10 dark:border-gray8 dark:text-gray8 py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray4 placeholder:font-inter focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pr-9 sm:text-sm/6"
        />
        <div className="self-center col-start-1 row-start-1 mr-3 text-gray-400 rounded-full cursor-pointer size-5 justify-self-end hover:bg-slate-100">
          <SvgIcons
            iconName="Search"
            fill={isDarkMode ? "#5D6974" : "#B9C2CA"}
          />
        </div>
      </div>

      <div className="flex items-center justify-between h-full py-[20px] max-h-[600px]">
        <div className="max-w-[340px] h-full bg-gray2 dark:bg-gray9 rounded-[10px] flex flex-col w-full">
          <span className="text-gray6 dark:text-gray4 text-left py-[12px] px-[37px] font-[700] text-[20px] font-inter leading-relaxed tracking-wide">
            {t("machineInfoPage.treeSelectCard.availableParameters")}
          </span>
          <div className="flex flex-col gap-2 p-2 overflow-y-auto">
            {filteredAvailableItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-2 py-1 transition-colors rounded-[10px] group hover:bg-gray3 dark:hover:bg-gray8"
                onClick={() => handleAddItem(item)}
              >
                <SvgIcons
                  className="transition-opacity duration-300 opacity-0 cursor-pointer group-hover:opacity-100"
                  iconName="AddNew"
                  fill={isDarkMode ? "#5D6974" : "#28333E"}
                />
                <span className="text-gray10 group-hover:font-[700] dark:text-gray3 font-[500] text-[16px] font-inter leading-relaxed tracking-wide cursor-pointer">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
            <SvgIcons
              iconName="Transfer"
              fill={isDarkMode ? "#5D6974" : "#B9C2CA"}
              className="transform rotate-0"
            />
        </div>

        <div className="max-w-[340px] h-full bg-gray2 dark:bg-gray9 rounded-[10px] flex flex-col w-full">
          <span className="text-gray6 dark:text-gray4 text-left py-[12px] px-[37px] font-[700] text-[20px] font-inter leading-relaxed tracking-wide">
            {t("machineInfoPage.treeSelectCard.existParameters")}
          </span>
          <div className="flex flex-col gap-2 p-2 overflow-y-auto">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-2 py-1 transition-colors rounded-[10px] group hover:bg-gray3 dark:hover:bg-gray8"
                onClick={() => handleRemoveItem(item)}
              >
                <SvgIcons
                    className="transition-opacity duration-300 opacity-0 cursor-pointer group-hover:opacity-100"
                  iconName="Remove"
                  fill={isDarkMode ? "#5D6974" : "#28333E"}
                />
                <span className="text-gray10 group-hover:font-[700] dark:text-gray3 font-[500] text-[16px] font-inter leading-relaxed tracking-wide cursor-pointer">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
