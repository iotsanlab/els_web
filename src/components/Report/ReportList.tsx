import { SvgIcons } from "../../assets/icons/SvgIcons";
import { useState } from "react";
import ReportBar from "./ReportBar";
import { useDarkMode } from "../../context/DarkModeContext";
import { useTranslation } from 'react-i18next';
import { ReportData } from "../../pages/ReportPage/type";

interface ReportListProps {
  reports: ReportData[];
  onSelect: (selectedOptions: string[]) => void;
}

const ReportList = ({ reports, onSelect }: ReportListProps) => {
  const [selectedReports, setSelectedReports] = useState<number[]>([]); 
  const [selectAll, setSelectAll] = useState<boolean>(false); 
  const { isDarkMode } = useDarkMode();
  const {t} = useTranslation();

  

  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedReports([]); 
      onSelect([]);
    } else {
      setSelectedReports(reports.map((report) => report.id));
      onSelect(reports.map((report) => report.id.toString()));
    }
    setSelectAll(!selectAll); 
    
    console.log(selectAll);
  };

  const handleSelectReport = (id: number) => {
    let updatedSelectedReports: number[];
    if (selectedReports.includes(id)) {
      updatedSelectedReports = selectedReports.filter((reportId) => reportId !== id);
    } else {
      updatedSelectedReports = [...selectedReports, id]; 
    }
    setSelectedReports(updatedSelectedReports);

   
    if (updatedSelectedReports.length !== reports.length) {
      setSelectAll(false);
    }
  
    else {
      setSelectAll(true);
    }


    onSelect(updatedSelectedReports.map((reportId) => reportId.toString()));
  };

  return (
    <div className="h-[500px] w-full bg-white dark:bg-gray10 drop-shadow-[2px_2px_4px_#00000026] rounded-[10px] overflow-hidden">
      <div className="h-[35px] w-full bg-white dark:bg-gray10 flex items-center">
    
        <div
          className="w-10 h-full border-b-[0.5px] border-b-gray2 dark:border-b-gray8 flex items-center justify-end cursor-pointer"
          onClick={handleSelectAll}
        >
          <div onClick={handleSelectAll} className="w-[20px] h-[20px] rounded-[10px] border-[2px] border-gray10 dark:border-gray8 flex items-center justify-center">
          {selectAll && <SvgIcons iconName="Tick" fill={isDarkMode ? "#FFF" : "#111"}/>}

          </div>
        </div>

    
        <div className="h-full w-96 items-center flex pl-3 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray4 dark:text-gray8 font-inter font-medium text-[12px] tracking-wide">{t("reportsPage.reportName")}</span>
        </div>
        <div className="h-full w-64 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray4 dark:text-gray8 font-inter font-medium text-[12px] tracking-wide">{t("reportsPage.reportType")}</span>
        </div>
        <div className="h-full w-48 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray4 dark:text-gray8 font-inter font-medium text-[12px] tracking-wide">{t("reportsPage.time")}</span>
        </div>
        <div className="h-full w-32 items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray4 dark:text-gray8 font-inter font-medium text-[12px] tracking-wide">{t("reportsPage.createdTime")}</span>
        </div>
        <div className="h-full min-w-48 flex-grow items-center flex pl-3 border-l-[0.5px] border-l-gray2 dark:border-l-gray8 border-b-[0.5px] border-b-gray2 dark:border-b-gray8">
          <span className="text-gray4 dark:text-gray8 font-inter font-medium text-[12px] tracking-wide">{t("reportsPage.source")}</span>
        </div>
      </div>

    
      <div className="overflow-y-auto h-[calc(500px-48px)]">
        {reports.map((report, index) => (
          <>
          
              <ReportBar
            key={report.id}
            report={report}
            index={index}
            isSelected={selectedReports.includes(report.id)} 
            handleClick={() => handleSelectReport(report.id)} 
          />
          </>
        ))}
      </div>
    </div>
  );
};

export default ReportList;
