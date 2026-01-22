
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import FilterCheckbox from "../Home/filterCheckbox";
import { useEffect, useState } from "react";
import AddReportModal from "../Modal/AddReportModal";
import { useTranslation } from 'react-i18next';

interface CheckboxItem {
  id: string;
  label: string;
  checked: boolean;
  children?: CheckboxItem[];
}
interface ReportSearchProps {
  onSelect: (selectedOptions: string[], searchValue: string) => void;
  onAddReport: (formData: ReportFormData) => void;
  onDelete?: () => void;
}

interface ReportFormData {
  reportName: string;
  reportType: string;
  dateRange: string;
  selectedMachines: CheckboxItem[];
}

const ReportSearch = ({ onSelect, onAddReport, onDelete }: ReportSearchProps) => {
  const {t} = useTranslation();


  const checkboxOptions = ["Backhoeloader","Telehandler", "Excavator"];

  const { isDarkMode } = useDarkMode();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);



  useEffect(() => {
    onSelect(selectedOptions, searchValue);
  }, [selectedOptions, searchValue]);


  const handleAddReport = (formData: ReportFormData) => {
    onAddReport(formData);
  };

  return (
    <div className="h-[72px] w-full flex  bg-white dark:bg-gray10 rounded-[10px] p-[20px] items-center justify-center drop-shadow-[2px_2px_4px_#00000026]">
        <div className="flex h-10 w-80 items-center justify-center bg-mstYellow mr-4 rounded-[10px] cursor-pointer"
        onClick={() => setIsTransferModalOpen(true)}
        >
                <span className="text-sm font-bold text-center text-white font-inter">+ {t("reportsPage.create")}</span>
            </div>

             <div className="flex items-center justify-between h-10 mr-4">
           {/* 
            <SvgIcons iconName="ExportIcon" fill="#B9C2CA"/>
            <div className="w-2"></div>*/}
            
            <div className="cursor-pointer" onClick={() => onDelete && onDelete()}>
              <SvgIcons iconName="DeleteIcon" fill="#B9C2CA"/>
            </div>

            </div>
      <div className="flex items-center w-full">
        <div className="grid w-full grid-cols-1 bg-white dark:bg-gray10" >
          <input
            id="account-number"
            name="account-number"
            type="text"
            placeholder={t("global.seriModel")}
            onChange={(e) => setSearchValue(e.target.value)}
            className="col-start-1 border border-gray4 row-start-1 block w-full rounded-[10px] bg-white dark:bg-gray10 dark:border-gray8 dark:text-gray8 py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray4 placeholder:font-inter focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pr-9 sm:text-sm/6"
          />

        </div>

        <div className="px-[10px]">
          <SvgIcons iconName="Search" fill={isDarkMode ? '#5D6974' : '#B9C2CA'} />
        </div>
      </div>

      <FilterCheckbox options={checkboxOptions} type2={true} onChange={(selected) => setSelectedOptions(selected)} />

      <AddReportModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
        //availableItemsList={availableItems} 
        //selectedItemsList={selectedItems} 
        //onItemsChange={handleSelectedItemsChange}
        //onSave={handleTransferSave}
        onSubmit={(formData) => handleAddReport(formData)}
      />

        

    </div>
  );
};

export default ReportSearch;
