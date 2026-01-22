import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useDarkMode } from "../../context/DarkModeContext";
import totalWorkingHoursPDF from "../../assets/totalWorkingHours.pdf";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ReportProps {
  id: number;
  name: string;
  type: string;
  timePeriod: string;
  createdTime: string;
  source: string[];
}

const ReportBar = ({
  report,
  index,
  isSelected,
  handleClick
}: {
  report: ReportProps;
  index: number;
  isSelected: boolean;
  handleClick: () => void;
}) => {
  const navigation = useNavigate();
  const rowBackground = index % 2 === 0 ? "bg-white dark:bg-gray9" : "bg-gray1 dark:bg-gray10";
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const handleClickPDF = () => {
    console.log("report.id", report);
    const url = `/vehicle_document/${report.id}`;  // Açılacak sayfa URL'si
    window.open(url, '_blank'); // '_blank' ile yeni sekmede açılır
  };
  

  return (
    <div className={`h-[60px] w-full ${rowBackground} flex items-center`}>
      <div
        className="h-full w-10 flex items-center justify-end border-b-[0.5px] border-b-gray2 dark:border-b-gray8 cursor-pointer"
        onClick={handleClick}
      >
        <div className="w-[20px] h-[20px] rounded-[10px] border-[2px] border-gray6 flex items-center justify-center">
          {isSelected && <SvgIcons iconName="Tick" fill={isDarkMode ? "#FFF" : "#111"} />}
        </div>
      </div>
      <div className="h-full w-96 items-center flex pl-3 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        <span className="text-gray6 font-inter font-bold text-[12px] tracking-wide">{report.name}</span>
      </div>
      <div className="h-full w-64 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        <span className="text-gray6 font-inter font-medium text-[12px] tracking-wide">{report.type == "hours" ? t("global.schema1") : t("global.schema2") }</span>
      </div>
      <div className="h-full w-48 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        <span className="text-gray6 font-inter font-medium text-[12px] tracking-wide">{report.timePeriod}</span>
      </div>
      <div className="h-full w-32 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        <span className="text-gray6 font-inter font-medium text-[12px] tracking-wide">{report.createdTime}</span>
      </div>
      <div className="h-full min-w-48 flex-grow items-start justify-center flex flex-col pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
        {report.source.slice(0, 2).map((source, idx) => (
          <span key={idx} className="text-gray6 font-inter font-medium text-[12px] tracking-wide">
            {source} 
            
          </span>
        ))} {report.source.length > 3 && <span className="text-gray6 font-inter font-medium text-[12px] tracking-wide">{t("reportsPage.sourceMore", { count: report.source.length - 3 })}</span>}
      </div>
      <div className="h-full min-w-[44px] max-w-[100px] items-center flex border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8 items-center justify-center cursor-pointer"
        onClick={() => handleClickPDF()}
      >
        <SvgIcons iconName="ArrowRightFigma" fill={isDarkMode ? "#5D6974" : "#E5E8EB"} />
      </div>
      
    </div>
  );
};

export default ReportBar;
