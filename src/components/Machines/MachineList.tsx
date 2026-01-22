import MachineBar from "./MachineBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { updateRecentMachineList } from "../../services/favService";
import { getUserId } from "../../services/auth";
import { useState } from "react";

interface Attribute {
  key: string;
  value: any;
}

interface MachineProps {
  attributes: Attribute[];
  type: string;
  serialNo: string;
  model: string;
  active: number;
  warnings: number;
  fuel_level: string;
  totalWorkingHours: string;
  remaining_for_service: string;
  location: string;
  id: string;
  long: string;
  lat: string;
  deviceName: string;
}

interface Props {
  deviceData: MachineProps[];
}

type SortType = 'none' | 'status' | 'workingHours';
type SortDirection = 'asc' | 'desc';

const MachineList: React.FC<Props> = ({ deviceData }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const [sortType, setSortType] = useState<SortType>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleMachineClick = async (device: { id: string; deviceName: string; type: string, isTelehandlerV2: boolean, subtype: string }) => {
    const selectedMachine = {
      id: device.id,
      type: device.type,
      model: device.deviceName,
      isTelehandlerV2: device.isTelehandlerV2,
      subtype: device.subtype
    };

    const uid = await getUserId();
    if (!uid) return;

    await updateRecentMachineList(uid, selectedMachine);
    navigation("/vehicle/" + device.id);
  };

  const isDeviceActive = (val: any): boolean => {
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val === 1;
    if (typeof val === "string") {
      const normalized = val.toLowerCase().trim();
      return ["true", "1", "aktif", "active"].includes(normalized);
    }
    return false;
  };

  const parseWorkingHours = (hours: string): number => {
    if (!hours) return 0;
    // "1234.5 hours" formatından sadece sayıyı çıkar
    const match = hours.toString().match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const handleSort = (type: SortType) => {
    if (sortType === type) {
      // Aynı sütuna tıklandıysa direction değiştir
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Farklı sütuna tıklandıysa yeni type set et ve desc yap
      setSortType(type);
      setSortDirection('desc');
    }
  };

  const getSortedData = () => {
    if (sortType === 'none') return deviceData;

    const sorted = [...deviceData].sort((a, b) => {
      if (sortType === 'status') {
        const aActive = isDeviceActive(a.active);
        const bActive = isDeviceActive(b.active);
        const comparison = Number(bActive) - Number(aActive);
        return sortDirection === 'desc' ? comparison : -comparison;
      }
      
      if (sortType === 'workingHours') {
        const aHours = parseWorkingHours(a.totalWorkingHours);
        const bHours = parseWorkingHours(b.totalWorkingHours);
        const comparison = bHours - aHours;
        return sortDirection === 'desc' ? comparison : -comparison;
      }
      
      return 0;
    });

    return sorted;
  };


  const sortedDeviceData = getSortedData();

  return (
    <div className="w-full bg-white dark:bg-gray10 custom-shadow rounded-[10px] overflow-hidden">
      <div className="flex items-center w-full h-12 bg-gray4">
        <div className="h-full w-[130px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex pl-2 lg:pl-3 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.pic")}
          </span>
        </div>
        
        <div className="h-full w-[120px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.seri")}
          </span>
        </div>
        
        <div className="h-full w-[90px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.type")}
          </span>
        </div>
        
        <div className="h-full w-[90px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.model")}
          </span>
        </div>
        
        {/* Durum Sütunu - Sıralanabilir */}
        <div
          className={`h-full w-[90px] items-center ${
            sortType === 'status' 
              ? 'bg-blue-50 dark:bg-blue-900/10' 
              : 'bg-white dark:bg-gray10'
          } dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray9 transition-colors`}
          onClick={() => handleSort('status')}
        >
          <div className="flex items-center justify-between w-full pr-2">
            <span className="text-xs font-medium tracking-wide truncate select-none text-gray6 font-inter">
              {t("generalMachinesPage.secondWidget.stat")}
            </span>
            <span className={`ml-1 text-xs transition-colors ${
              sortType === 'status' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-400 group-hover:text-gray-600'
            }`}>
              {sortType === 'status' ? (sortDirection === 'desc' ? '↓' : '↑') : '↕'}
            </span>
          </div>
        </div>
        
        <div className="h-full w-[90px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.service")}
          </span>
        </div>
        
        <div className="h-full w-[90px] items-center bg-white dark:bg-gray10 dark:border-gray8 pl-1 flex border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter ">
            {t("generalMachinesPage.secondWidget.fuelLvl")}
          </span>
        </div>
        
        {/* Çalışma Süresi Sütunu - Sıralanabilir */}
        <div
          className={`h-full w-[120px] items-center ${
            sortType === 'workingHours' 
              ? 'bg-blue-50 dark:bg-blue-900/10' 
              : 'bg-white dark:bg-gray10'
          } dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray9 transition-colors`}
          onClick={() => handleSort('workingHours')}
        >
          <div className="flex items-center justify-between w-full pr-2">
            <span className="text-xs font-medium tracking-wide truncate select-none text-gray6 font-inter">
              {t("generalMachinesPage.secondWidget.workTime")}
            </span>
            <span className={`ml-1 text-xs transition-colors ${
              sortType === 'workingHours' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-400 group-hover:text-gray-600'
            }`}>
              {sortType === 'workingHours' ? (sortDirection === 'desc' ? '↓' : '↑') : '↕'}
            </span>
          </div>
        </div>
        
        <div className="h-full w-[130px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex justify-center border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2">
          <span className="text-xs font-medium tracking-wide text-center truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.remHourMain")}
          </span>
        </div>
        
        <div className="h-full flex-grow lg:w-[110px] items-center bg-white dark:bg-gray10 dark:border-gray8 flex pl-2 lg:pl-3 border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 min-w-0">
          <span className="text-xs font-medium tracking-wide truncate text-gray6 font-inter">
            {t("generalMachinesPage.secondWidget.pos")}
          </span>
        </div>
      </div>

      {/* Makinelerin listesi */}
      <div className="overflow-y-auto h-[calc(500px-38px)] scrollbar-hidden-vertical">
        {sortedDeviceData.map((device, index) => (
          <MachineBar
            key={device.id || index}
            machine={{
              ...device,
              attributes: device.attributes || [],
            }}
            index={index}
            handleClick={() => handleMachineClick(device)}
          />
        ))}
      </div>
    </div>
  );
};

export default MachineList;