import WarningBar from "./WarningBar";
import { useTranslation } from 'react-i18next';

interface Warnings {
  warning_name_2: string;
  warning_type: string;
  warning_code: string;
  warning_date: string;
  description: string;
  source: string;
}

interface MachineProps {
  type: string;
  subtype?: string | undefined;
  serialNo: string;
  model: string;
  warnings: Warnings[];
  fuel_level: string;
  totalWorkingHours: number;
  remaining_for_service: string;
  location: string;
  lat: number;
  long: number;
}

interface Props {
  deviceData: MachineProps[];
}

const WarningList: React.FC<Props> = ({ deviceData }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white dark:bg-gray10 drop-shadow-[2px_2px_4px_#00000026] rounded-[10px] overflow-hidden">
      <div className="h-12 w-full bg-white dark:bg-gray10 flex items-center">
        <div className="w-12 h-full bg-white dark:bg-gray10 border-b-[0.5px] border-b-gray2 dark:border-b-gray8 border-r-[0.5px] border-r-gray2 dark:border-r-gray8"></div>
        <div className="h-full w-32 items-center bg-white dark:bg-gray10 flex pl-3 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("generalMachinesPage.secondWidget.pic")}</span>
        </div>
        <div className="h-full w-32 items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("generalMachinesPage.secondWidget.seri")}</span>
        </div>
        <div className="h-full w-24 items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("warningPage.machineType")}</span>
        </div>
        <div className="h-full w-24 items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("generalMachinesPage.secondWidget.model")}</span>
        </div>
        <div className="h-full w-[110px] items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("generalMachinesPage.secondWidget.workTime")}</span>
        </div>
        <div className="h-full w-24 items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("generalMachinesPage.secondWidget.stat")}</span>
        </div>
        <div className="h-full w-48 items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("generalMachinesPage.secondWidget.pos")}</span>
        </div>
        <div className="h-full w-36 items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray6 font-inter font-medium text-xs tracking-wide">{t("warningPage.nearestService")}</span>
        </div>
        <div className="h-full flex-grow items-center bg-white dark:bg-gray10 flex pl-3 border-l-[0.5px] border-x-gray2 dark:border-x-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        </div>
      </div>

      {/* Makinelerin listesi */}
      <div className="overflow-y-auto max-h-full pb-[70px] drop-shadow-[0px_4px_4px_#00000026]">
        {deviceData.length === 0 ? (
          <div className="h-20 flex items-center justify-center">
          </div>
        ) : (
          deviceData.map((device, index) => (
            <WarningBar
              key={`${device.serialNo}-${index}`}
              machine={device}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WarningList;