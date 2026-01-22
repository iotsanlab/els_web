import { useState } from "react";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import getMachineImage from "../GetImage";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

interface Warnings {
  warning_name_2: string;
  warning_type: string;
  warning_code: string;
  warning_date: string;
  description: string;
  source: string;
}

interface Machine {
  type: string;
  subtype: string;
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

const WarningBar = ({ machine, index }: { machine: Machine; index: number }) => {
  const { t } = useTranslation();
  const rowBackground = index % 2 === 0 ? "bg-white dark:bg-gray9" : "bg-gray1 dark:bg-gray10";
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className={`h-24 w-full ${rowBackground} flex items-center`}>
        <div
          className="h-full w-12 flex items-center justify-center border-r-[0.5px] border-x-gray2 dark:border-x-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8 hover:bg-gray-100 dark:hover:bg-gray8 cursor-pointer"
          onClick={() => setOpenModal(!openModal)}
        >
          <SvgIcons 
            iconName={openModal ? "UpArrow" : "DownArrow"} 
            fill="#8B96A2" 
          />
        </div>
        
        <div className="h-full w-32 items-center flex border-b-[0.5px] border-b-gray2 dark:border-b-gray8 select-none">
          <img
            src={getMachineImage(machine.type, "sm", machine.subtype)}
            alt={machine.type}
            className="object-contain w-full h-full"
          />
        </div>
        
        <div className="h-full w-32 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-xs font-bold tracking-wide text-gray8 dark:text-white font-inter">
            {machine.serialNo}
          </span>
        </div>
        
        <div className="h-full w-24 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
            {machine.type}
          </span>
        </div>
        
        <div className="h-full w-24 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
            {machine.model}
          </span>
        </div>
        
        <div className="h-full w-[110px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8">
          <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
            {Number(machine.totalWorkingHours).toFixed(2)} {t("global.hour")}
          </span>
        </div>
        
        <div
          className="cursor-pointer h-full w-24 items-center justify-center flex border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8 dark:border-gray8"
          onClick={() => setOpenModal(!openModal)}
        >
          <span className={`text-xs font-medium tracking-wide text-gray6 font-inter ${
            machine.warnings.length > 0 
              ? "bg-statusRed px-3 py-[2px] rounded-[10px] text-white" 
              : "bg-transparent"
          }`}>
            {machine.warnings.length > 0 ? `${machine.warnings.length} ${t("global.warning")}` : "-"}
          </span>
        </div>

        <div
          onClick={() => navigate(`/Map?lat=${machine.lat}&long=${machine.long}&machineSerialNo=${machine.serialNo}`)}
          className="h-full w-48 items-center justify-start flex border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8 hover:bg-gray-100 dark:hover:bg-gray8 cursor-pointer"
        >
          <div className="w-[10px]"></div>
          <SvgIcons iconName="Map" fill="#8B96A2" />
          <div className="w-[2px]"></div>
          <span className="text-xs font-medium tracking-wide text-gray6 font-inter min-w-[115px]">
            {machine.location}, {t("global.turkey")}
          </span>
          <SvgIcons iconName="ExtLink" fill="#8B96A2" />
        </div>

        <div
          onClick={() => navigate(`/Map?lat=${machine.lat}&long=${machine.long}&fromWarning=true`)}
          className="h-full w-36 flex items-center justify-start pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8 hover:bg-gray-100 dark:hover:bg-gray8 cursor-pointer"
        >
          <SvgIcons iconName="Ambulance" fill="#8B96A2" />
          <span className="mx-4 text-xs font-medium tracking-wide text-gray6 font-inter">
            {t("warningPage.nearestService")}
          </span>
        </div>

        <div className="h-full w-48 flex-grow items-center justify-start flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        </div>
      </div>

      {/* Warning Details Modal */}
      {openModal && machine.warnings.length > 0 && (
        <div className="h-full lg:mb-[10px] flex flex-col lg:ml-[120px] drop-shadow-[2px_2px_4px_#00000026]">
          {/* Header */}
          <div className="flex bg-gray1 dark:bg-gray10">
            <div className="lg:w-[100px] lg:h-[40px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
              <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                {t("reportsPage.source")}
              </span>
            </div>
            <div className="lg:w-[100px] lg:h-[40px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
              <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                {t("warningPage.errorType")}
              </span>
            </div>
            <div className="lg:w-[100px] lg:h-[40px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
              <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                {t("warningPage.errorCode")}
              </span>
            </div>
            <div className="lg:w-[100px] lg:h-[40px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
              <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                {t("warningPage.errorTime")}
              </span>
            </div>
            <div className="lg:min-w-[100px] lg:h-[40px] items-center justify-start flex lg:pl-[8px]">
              <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                {t("global.description")}
              </span>
            </div>
          </div>

          {/* Warning Rows */}
          {machine.warnings.map((warning, warningIndex) => (
            <div key={warningIndex} className="flex bg-white dark:bg-gray9">
              <div className="lg:w-[100px] lg:h-[60px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
                <span className="text-xs font-bold tracking-wide text-gray6 font-inter">
                  {warning.source}
                </span>
              </div>
              <div className="lg:w-[100px] lg:h-[60px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
                <span className="text-xs font-bold tracking-wide text-gray6 font-inter">
                  {warning.warning_type}
                </span>
              </div>
              <div className="lg:w-[100px] lg:h-[60px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
                <span className="text-xs font-bold tracking-wide text-gray6 font-inter">
                  {warning.warning_code}
                </span>
              </div>
              <div className="lg:w-[100px] lg:h-[60px] border-r-[0.5px] border-gray2 dark:border-gray8 items-center justify-start flex lg:pl-[8px]">
                <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                  {warning.warning_date}
                </span>
              </div>
              <div className="lg:min-w-[100px] lg:h-[60px] items-center justify-start flex lg:pl-[8px]">
                <span className="text-xs font-medium tracking-wide text-gray6 font-inter">
                  {warning.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarningBar;