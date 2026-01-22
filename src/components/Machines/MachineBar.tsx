import { SvgIcons } from "../../assets/icons/SvgIcons";
import getMachineImage from "../GetImage";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

// Attribute tipi
interface Attribute {
  key: string;
  value: any;
}

// Machine tipi
interface Machine {
  attributes: Attribute[];
  type: string;
  subtype: string;
  serialNo: string;
  model: string;
  active: number;
  warnings: number;
  fuel_level: string;
  totalWorkingHours: string;
  remaining_for_service: string;
  location: string;
  long: string;
  lat: string;
  isTelehandlerV2: boolean;
}

const MachineBar = ({ machine, index, handleClick }: { machine: Machine; index: number; handleClick: () => void }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const rowBackground = index % 2 === 0 ? "bg-white dark:bg-gray9" : "bg-gray1 dark:bg-gray10";

  return (
    <div className={`h-24  ${rowBackground} flex items-center `}>
      <div className="h-full  w-[130px] items-center flex pl-3 lg:pl-[8px] border-b-[0.5px] border-b-gray2 dark:border-b-gray8 cursor-pointer"
        onClick={handleClick}>
        <img
          src={getMachineImage(machine?.isTelehandlerV2 ? 'Telehandler_v2' : machine.type, "sm", machine.subtype)}
          alt={machine.type}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="h-full  w-[120px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8 cursor-pointer"
        onClick={handleClick}>
        <span className="text-xs lg:text-[10px] font-bold tracking-wide text-gray8 font-inter dark:text-white">{machine.serialNo}</span>
      </div>
      <div className="h-full w-[90px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8">
        <span className="text-[11px] font-medium tracking-wide text-gray6 font-inter">{machine.type}</span>
      </div>
      <div className="h-full w-[90px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8">
        <span
          className={`${machine.model.length > 10 ? "text-[9px]" : "text-xs"
            } font-medium tracking-wide text-gray6 font-inter`}
        >
          {machine.model}
        </span>
      </div>

      <div className="h-full w-[90px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8">
        <div className={`w-[12px] h-[12px] rounded-[10px] mr-2 ${machine.active == 1 ? "bg-statusGreen" : "bg-gray6"} `}></div>
        <span className="text-xs font-medium tracking-wide text-gray6 font-inter">{ machine.active == 1 ? t("global.active") : t("global.close")}</span>
      </div>
      <div
        className="h-full w-[90px] items-center justify-center flex border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8"
        onClick={() => machine.warnings > 0 && navigation("/Warning")}
      >
        <span className={`text-xs font-medium tracking-wide text-gray6 font-inter ${machine.warnings > 0 ? "bg-statusRed px-[10px] py-[2px] rounded-[10px] text-white cursor-pointer" : "bg-transparent"}`}>{machine.warnings > 0 ? `${machine.warnings} ${machine.warnings.length > 1 ? t("global.warnings") : t("global.warning")}` : "-"}</span>
      </div>
     
      <div className="h-full w-[120px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8">
        <span className="text-xs font-medium tracking-wide text-gray6 font-inter">{parseFloat(machine.totalWorkingHours).toFixed(2)} {t("global.hour")}</span>
      </div>
      <div className="h-full w-[130px] items-center flex pl-3 lg:pl-[8px] border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8">
        <span className="text-xs font-medium tracking-wide text-gray6 font-inter">{machine.remaining_for_service ? machine.remaining_for_service + " " + t("global.hour") : "-"} </span>
      </div>
      <div
        onClick={() => navigation(`/map?lat=${machine.lat}&long=${machine.long}&machineSerialNo=${machine.serialNo}`)}
        className="h-full w-[80px] flex flex-grow items-center justify-start border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 hover:bg-gray-100 dark:border-gray8 cursor-pointer"
      >
        <div className="w-[10px]"></div>
        <SvgIcons iconName="Map" fill="#8B96A2" />
        <div className="w-[2px]"></div>
        <span className="text-xs font-medium tracking-wide text-gray6 font-inter min-w-[120px]">{machine.location}, {t("global.turkey")}</span>
        <SvgIcons iconName="ExtLink" fill="#8B96A2" />
      </div>
      <div
        className="h-full w-[44px]  flex items-center justify-center border-l-[0.5px] border-l-gray2 border-b-[0.5px] border-b-gray2 dark:border-gray8 hover:bg-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        <SvgIcons iconName="ArrowRightFigma" fill="#E5E8EB" />
      </div>



    </div>
  );
};

export default MachineBar;