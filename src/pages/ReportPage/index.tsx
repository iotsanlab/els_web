import GeneralTitle from "../../components/Title/GeneralTitle";
import ReportSearch from "../../components/Report/ReportSearchArea";
import ReportList from "../../components/Report/ReportList";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ReportData } from "./type";
import { reportStore } from "../../store/ReportStore";
import { observer } from "mobx-react-lite";

// ReportForm veri tipi
interface ReportFormData {
  reportName: string;
  reportType: string;
  dateRange: string;
  selectedMachines: any[];
}

const ReportPage = observer(() => {
  const { t, i18n } = useTranslation();
  const [allReports, setAllReports] = useState<ReportData[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    options: string[];
    searchValue: string;
  }>({ options: [], searchValue: "" });

  const handleAddReport = (formData: ReportFormData) => {
    const report = {
      id: String(Date.now()), // Benzersiz ID için timestamp kullan
      reportName: formData.reportName,
      reportType: formData.reportType,
      timeRange: {
        startDate: formData.dateRange.split(" - ")[0],
        endDate: formData.dateRange.split(" - ")[1]
      },
      selectedMachines: formData.selectedMachines
    };
    
    // Raporu ReportStore'a ekle
    reportStore.addReport(report);
    
    // UI'ı güncelle
    refreshReportList();
  };

  const handleDelete = () => {
    // Seçili raporları sil
    selectedReports.forEach(id => {
      reportStore.removeReport(id);
    });
    
    // UI'ı güncelle
    refreshReportList();
    
    // Seçimi temizle
    setSelectedReports([]);
  };

  // Store'dan en son raporları al ve UI'ı güncelle
  const refreshReportList = () => {
    const reportsFromStore = reportStore.getAllReports();
    
    const mappedReports = reportsFromStore.map((report) => ({
      id: parseInt(report.id, 10),
      name: report.reportName,
      type: report.reportType,
      timePeriod: `${report.timeRange.startDate} - ${report.timeRange.endDate}`,
      createdTime: new Date().toLocaleDateString(),
      source: report.selectedMachines.map((machine) => machine.label),
      formData: report.selectedMachines,
    }));
    
    setAllReports(mappedReports);
    
    // Aktif filtreler varsa uygula
    if (activeFilters.options.length > 0 || activeFilters.searchValue) {
      applyFilters(mappedReports, activeFilters.options, activeFilters.searchValue);
    } else {
      setReports(mappedReports);
    }
  };

  const applyFilters = (data: ReportData[], options: string[], searchValue: string) => {
    let filteredData = [...data];
  
    if (searchValue && searchValue.trim() !== "") {
      const searchLower = searchValue.toLowerCase();
  
      filteredData = filteredData.filter((report) => {
        if (report.name.toLowerCase().includes(searchLower)) {
          return true;
        }
  
        if (report.type.toLowerCase().includes(searchLower)) {
          return true;
        }
  
        if (report.formData && report.formData.length > 0) {
          return report.formData.some((machine) => {
            return (
              (machine.label && machine.label.toLowerCase().includes(searchLower)) ||
              (machine.model && machine.model.toLowerCase().includes(searchLower)) ||
              (machine.serialNo && machine.serialNo.toLowerCase().includes(searchLower)) ||
              (machine.type && machine.type.toLowerCase().includes(searchLower))
            );
          });
        }
  
        return false;
      });
    }
  
    if (options && options.length > 0) {
      filteredData = filteredData.filter((report) => {
        if (!report.formData || report.formData.length === 0) {
          return false;
        }
  
        return report.formData.some((machine) => {
          return machine.type && options.includes(machine.type);
        });
      });
    }
  
    setReports(filteredData);
  };
  
  const handleSearch = (selectedOptions: string[], searchValue: string) => {
    setActiveFilters({ options: selectedOptions, searchValue });
    
    if ((selectedOptions.length === 0 || !selectedOptions) && (!searchValue || searchValue.trim() === "")) {
      setReports(allReports);
    } else {
      applyFilters(allReports, selectedOptions, searchValue);
    }
  };

  // Store'daki rapor verisi yüklendiğinde veya değiştiğinde UI'ı güncelle
  useEffect(() => {
    if (reportStore.isLoaded) {
      refreshReportList();
    }
  }, [reportStore.isLoaded, reportStore.reports.length]);
  
  return (
    <div className="flex flex-col overflow-x-auto min-w-[1340px] pr-4 w-full h-full">
      <GeneralTitle title={t("reportsPage.reportTitle")} />
      <ReportSearch
        onSelect={handleSearch}
        onAddReport={handleAddReport}
        onDelete={handleDelete}
      />

      <div className="h-4"></div>

      <GeneralTitle title={t("reportsPage.reports")} />

      <ReportList
        reports={reports}
        onSelect={(selectedOptions) => {
          setSelectedReports(selectedOptions);
        }}
      />
    </div>
  );
});

export default ReportPage;
