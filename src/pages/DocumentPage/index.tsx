import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import styles from "./style";
import ReactApexChart from "react-apexcharts";
import PDFTable from "./table";
import PDFTableFuel from "./tableFuel";
import DailyWorkingTable, { TableRow } from "./dailyWorkingTable";
import { reportStore } from "../../store/ReportStore";
import { ReportData as BaseReportData } from "../ReportPage/type";
import { useTranslation } from "react-i18next";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { getValuesTimeSeries, getValuesAttributes } from "../../services/telemetry";
import { userStore } from "../../store/UserStore";
import { getUserInfos } from "../../services/auth";

// Google Fonts Roboto yükle
const loadGoogleFont = () => {
  if (!document.getElementById("google-font-roboto")) {
    const link = document.createElement("link");
    link.id = "google-font-roboto";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }
};

// Print stil inject
const injectPrintStyles = () => {
  const applyStyles = () => {
    let style = document.getElementById("document-page-print-styles") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "document-page-print-styles";
      document.head.appendChild(style);
    }
    // Her seferinde yeniden yaz — Firefox cache sorununu önler
    style.textContent = `
      @page { size: A4 landscape; margin: 1mm; }

      @media print {
        *, *::before, *::after {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body { margin: 0; padding: 0; background: #fff !important; }
        .doc-print-btn { display: none !important; }
        .doc-scroll-container { 
          background: #fff !important; 
          overflow: visible !important; 
          height: auto !important; 
          padding: 0 !important;
        }
        .doc-page {
          box-shadow: none !important;
          margin: 0 !important;
          border-radius: 0 !important;
          page-break-after: always;
          width: 100% !important;
          min-height: auto !important;
          max-width: none !important;
        }
        .doc-page:last-child { page-break-after: auto; }
      }
    `;
  };

  applyStyles();
  // Firefox her print öncesi stili yeniden okur
  window.addEventListener("beforeprint", applyStyles);
};

// API timeseries yanıtı
type TimeSeriesResponse = Record<string, Array<{ ts: number; value: string }>>;
type AttributesResponse = Array<{ key?: string; value?: string }>;

interface MachineData {
  id: number;
  name: string;
  serialNo: string;
  model: string;
  type: string;
  workingHours?: Array<{ ts: number; value: number; date: string }>;
  fuelConsumption?: Array<{ ts: number; value: number; date: string }>;
  totalEnergyFallback?: number;
}

interface ExtendedReportData extends BaseReportData {
  reportName: string;
  selectedMachines: Array<{
    id: number;
    label: string;
    serialNo: string;
    model: string;
    type: string;
  }>;
  timeRange?: {
    startDate: string;
    endDate: string;
  };
  reportType: string;
  createdTime: string;
}

interface InfoCardData {
  reportType: string;
  dateRange: string;
  creator: string;
  creationDate: string;
  reportDuration: string;
  totalWorkingHours: string;
}

// ---- Sayfa stilleri ----
const pageContainerStyle: React.CSSProperties = {
  background: "#d6d6d6",
  minHeight: "100vh",
  height: "100vh",
  overflowY: "auto",
  padding: "0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 32,
};

const a4PageStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "210mm",
  background: "#fff",
  boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
  borderRadius: 4,
  padding: "7px 10px",
  boxSizing: "border-box",
  fontFamily: "Roboto, sans-serif",
  color: "#000",
  position: "relative",
};

const printBtnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 32,
  right: 32,
  zIndex: 1000,
  background: "#005A9C",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "12px 28px",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(0,90,156,0.3)",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const DocumentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [report, setReport] = useState<ExtendedReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [machineData, setMachineData] = useState<MachineData[]>([]);
  const [infoCardData, setInfoCardData] = useState<InfoCardData>({
    reportType: "",
    dateRange: "",
    creator: "",
    creationDate: "",
    reportDuration: "",
    totalWorkingHours: "",
  });

  // Google Fonts ve print stilleri yükle
  useEffect(() => {
    loadGoogleFont();
    injectPrintStyles();
  }, []);

  const timestampToDate = useCallback((timestamp: number): string => {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const dateToTimestamp = useCallback((dateStr: string, isEndDate: boolean = false): number => {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date.getTime();
  }, []);

  const fetchMachineData = useCallback(async (
    machineId: number,
    startDate: string,
    endDate: string
  ): Promise<MachineData | null> => {
    try {
      const startTs = dateToTimestamp(startDate, false);
      const endTs = dateToTimestamp(endDate, true);
      const machineInfo = report?.selectedMachines.find(m => m.id === machineId);
      if (!machineInfo) return null;

      const deviceNameAttr = (await getValuesAttributes("DEVICE", machineId.toString(), ["deviceName"])) as AttributesResponse;
      const deviceName = deviceNameAttr.find((a) => a.key === "deviceName")?.value ?? machineInfo.label ?? "";

      if (report?.reportType === "hours") {
        const workingHoursData = (await getValuesTimeSeries(
          "DEVICE", machineId.toString(), ["DailyWorkingHours"], startTs, endTs, true
        )) as unknown as TimeSeriesResponse;

        const workingHours = (workingHoursData?.DailyWorkingHours ?? []).map((item: { ts: number; value: string }) => ({
          ts: item.ts,
          value: parseFloat(String(item.value)),
          date: timestampToDate(item.ts)
        }));

        return { ...machineInfo, name: deviceName, workingHours };
      }

      if (report?.reportType === "fuel" || report?.reportType === "performance") {
        const [energyData, workingHoursData] = await Promise.all([
          getValuesTimeSeries("DEVICE", machineId.toString(), ["DailyEnergyConsumption", "TotalEnergyConsumption"], startTs, endTs, true) as unknown as Promise<TimeSeriesResponse>,
          getValuesTimeSeries("DEVICE", machineId.toString(), ["DailyWorkingHours"], startTs, endTs, true) as unknown as Promise<TimeSeriesResponse>,
        ]);

        const fuelConsumption = ((energyData as TimeSeriesResponse)?.DailyEnergyConsumption ?? []).map((item: { ts: number; value: string }) => ({
          ts: item.ts,
          value: parseFloat(String(item.value)),
          date: timestampToDate(item.ts),
        }));

        const workingHours = ((workingHoursData as TimeSeriesResponse)?.DailyWorkingHours ?? []).map((item: { ts: number; value: string }) => ({
          ts: item.ts,
          value: parseFloat(String(item.value)),
          date: timestampToDate(item.ts),
        }));

        // TotalEnergyConsumption: birikimli sayaç → son-ilk farkı fallback olarak sakla
        const totalEnergyRaw = ((energyData as TimeSeriesResponse)?.TotalEnergyConsumption ?? []);
        let totalEnergyFallback = 0;
        if (totalEnergyRaw.length > 0) {
          const first = parseFloat(String(totalEnergyRaw[0].value));
          const last = parseFloat(String(totalEnergyRaw[totalEnergyRaw.length - 1].value));
          totalEnergyFallback = last > first ? last - first : last;
        }

        return { ...machineInfo, fuelConsumption, name: deviceName, workingHours, totalEnergyFallback };
      }

      return null;
    } catch (error) {
      console.error(`Makine ${machineId} verisi çekilemedi:`, error);
      return null;
    }
  }, [report, dateToTimestamp, timestampToDate]);

  const fetchAllMachinesData = useCallback(async () => {
    if (!report?.selectedMachines || !report?.timeRange) return;
    setLoading(true);
    try {
      const promises = report.selectedMachines.map(machine =>
        fetchMachineData(machine.id, report.timeRange!.startDate, report.timeRange!.endDate)
      );
      const results = await Promise.all(promises);
      const validResults = results.filter(result => result !== null) as MachineData[];
      setMachineData(validResults);
      setLoading(false);
    } catch (error) {
      console.error('Makine verileri çekilemedi:', error);
      setLoading(false);
    }
  }, [report, fetchMachineData]);

  useEffect(() => {
    const fetchReport = () => {
      const allReports = reportStore.getAllReports();
      const fetchedReport = allReports.find(
        (report) => report.id.toString() === id
      );
      setReport(fetchedReport as unknown as ExtendedReportData);
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (report) {
      fetchAllMachinesData();
    }
  }, [report, fetchAllMachinesData]);

  useEffect(() => {
    if (!report) return;

    const fetchCreatorEmail = async () => {
      try {
        const userInfos = await getUserInfos();
        const creatorEmail = userInfos.email || "";
        fillInfoCard(creatorEmail);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
        fillInfoCard(userStore.email ?? "");
      }
    };

    const fillInfoCard = (creator: string) => {
      const startDate = report.timeRange?.startDate;
      const endDate = report.timeRange?.endDate;
      const dateRangeStr = startDate && endDate ? `${startDate} - ${endDate}` : "";

      let reportDurationStr = "";
      if (startDate && endDate) {
        const start = dateToTimestamp(startDate, false);
        const end = dateToTimestamp(endDate, false);
        const days = Math.max(0, Math.ceil((end - start) / (24 * 60 * 60 * 1000))) + 1;
        reportDurationStr = `${days} ${t("documentPage.days", "gün")}`;
      }

      const totalHours = machineData.reduce(
        (acc, machine) => acc + (machine.workingHours?.reduce((sum, item) => sum + item.value, 0) ?? 0),
        0
      );

      setInfoCardData({
        reportType: report.reportType ?? "",
        dateRange: dateRangeStr,
        creator,
        creationDate: report.createdTime ?? new Date(parseInt(id ?? "", 10) || Date.now()).toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        reportDuration: reportDurationStr,
        totalWorkingHours: totalHours.toFixed(2),
      });
    };

    fetchCreatorEmail();
  }, [report, machineData, dateToTimestamp, t]);

  const generateDateRange = useCallback((startDate?: string, endDate?: string): string[] => {
    const dates: string[] = [];
    if (startDate && endDate) {
      const start = new Date(startDate.split('.').reverse().join('-'));
      const end = new Date(endDate.split('.').reverse().join('-'));
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateStr = currentDate.toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        dates.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return dates;
  }, []);

  const handleWorkingFormatData = useCallback(() => {
    if (!report || !machineData.length) return { columns: [], rows: [] };

    const sortedMachines = [...machineData]
      .map((machine) => ({
        machine,
        totalHours: machine.workingHours?.reduce((acc, item) => acc + item.value, 0) || 0,
      }))
      .sort((a, b) => b.totalHours - a.totalHours);

    const rows = sortedMachines.map(({ machine, totalHours }, index) => {
        if (totalHours > 0) {
            return {
                rowNumber: (index + 1).toString(),
                machineName: machine.name,
                class: "Excavator",
                model: machine.model,
                serialNumber: machine.serialNo,
                totalWorkHours: totalHours.toFixed(2),
            };
        }
        return null;
    }).filter(row => row !== null);

    const columns = [
      { key: "rowNumber", header: "No", style: { width: 30, flexGrow: 0, flexBasis: 30 } as React.CSSProperties },
      { key: "machineName", header: t("documentPage.machineName") },
      { key: "class", header: "Makine Tipi" },
      { key: "model", header: "Makine Modeli" },
      { key: "serialNumber", header: t("documentPage.serialNumber") },
      { key: "totalWorkHours", header: t("documentPage.totalWorkingHours") },
    ];

    return { columns, rows };
  }, [report, machineData, t]);

  const handleFuelFormatData = () => {
    if (!report || !machineData.length) return { columns: [], rows: [] };

    const sortedMachines = [...machineData]
      .map((machine) => {
        const dailySum = machine.fuelConsumption?.reduce((acc, item) => acc + item.value, 0) ?? 0;
        const totalEnergy = dailySum > 0 ? dailySum : (machine.totalEnergyFallback ?? 0);
        const totalHours = machine.workingHours?.reduce((acc, item) => acc + item.value, 0) || 0;
        return { machine, totalEnergy, totalHours };
      })
      .sort((a, b) => b.totalEnergy - a.totalEnergy);

    const rows = sortedMachines.map(({ machine, totalEnergy, totalHours }, index) => {
      const avgEnergy = totalHours > 0 ? (totalEnergy / totalHours) : 0;
      return {
        rowNumber: (index + 1).toString(),
        machineName: machine.name,
        class: machine.type || "EL12",
        model: machine.model,
        serialNumber: machine.serialNo,
        totalFuel: totalEnergy.toFixed(2) + ' kWh',
        avgFuel: avgEnergy.toFixed(2) + ' kWh',
      };
    });

    const columns = [
      { key: "rowNumber", header: "No", style: { width: 30, flexGrow: 0, flexBasis: 30 } as React.CSSProperties },
      { key: "machineName", header: t("documentPage.machineName") },
      { key: "serialNumber", header: t("documentPage.serialNumber") },
      { key: "class", header: t("documentPage.class") },
      { key: "model", header: t("documentPage.model") },
      { key: "totalFuel", header: t("documentPage.totalEnergy") },
      { key: "avgFuel", header: t("documentPage.avgEnergy") },
    ];

    return { columns, rows };
  };

  const handlePerformanceFormatData = () => {
    if (!report || !machineData.length) return { columns: [], rows: [] };

    const machinesWithMetrics = machineData
      .map((machine) => {
        const dailySum = machine.fuelConsumption?.reduce((acc, item) => acc + item.value, 0) ?? 0;
        const totalEnergy = dailySum > 0 ? dailySum : (machine.totalEnergyFallback ?? 0);
        const totalHours = machine.workingHours?.reduce((acc, item) => acc + item.value, 0) || 0;
        const avgEnergy = totalHours > 0 ? totalEnergy / totalHours : 0;
        return { machine, totalEnergy, totalHours, avgEnergy };
      })
      .filter((item) => item.totalHours > 0)
      .sort((a, b) => {
        if (a.avgEnergy === 0 && b.avgEnergy === 0) return 0;
        if (a.avgEnergy === 0) return 1;
        if (b.avgEnergy === 0) return -1;
        return a.avgEnergy - b.avgEnergy;
      });

    const rows = machinesWithMetrics.map(
      ({ machine, totalEnergy, totalHours, avgEnergy }, index) => ({
        rowNumber: (index + 1).toString(),
        machineName: machine.name,
        class: machine.type || "EL12",
        model: machine.model,
        serialNumber: machine.serialNo,
        totalWorkHours: totalHours.toFixed(2).replace('.', ',') + " " + t("global.h"),
        totalFuel: totalEnergy.toFixed(2).replace('.', ',') + " kWh",
        avgFuel: avgEnergy.toFixed(2).replace('.', ',') + " kWh",
      })
    );

    const columns = [
      { key: "rowNumber", header: "No", style: { width: 30, flexGrow: 0, flexBasis: 30 } as React.CSSProperties },
      { key: "machineName", header: t("documentPage.machineName") },
      { key: "class", header: t("documentPage.class") },
      { key: "model", header: t("documentPage.model") },
      { key: "serialNumber", header: t("documentPage.serialNumber") },
      { key: "totalWorkHours", header: t("documentPage.totalWorkingHours") },
      { key: "totalFuel", header: t("documentPage.totalEnergy") },
      { key: "avgFuel", header: t("documentPage.avgEnergy") },
    ];

    return { columns, rows };
  };

  const handleDailyWorkingFormatData = useCallback(
    (type: "working" | "fuel"): { dates: string[]; values: number[] } => {
      if (!report || !machineData.length) return { dates: [], values: [] };

      const dateRange = generateDateRange(report.timeRange?.startDate, report.timeRange?.endDate);
      const aggregatedData: { [date: string]: number } = {};
      dateRange.forEach(date => { aggregatedData[date] = 0; });

      machineData.forEach(machine => {
        const source = type === "working" ? machine.workingHours : machine.fuelConsumption;
        if (source) {
          source.forEach(item => {
            if (aggregatedData.hasOwnProperty(item.date)) {
              aggregatedData[item.date] += item.value;
            }
          });
        }
      });

      return {
        dates: dateRange,
        values: dateRange.map(date => parseFloat(aggregatedData[date].toFixed(1)))
      };
    },
    [report, machineData, generateDateRange]
  );

  const CHART_WIDTH = 760;
  const CHART_HEIGHT = 380;

  const getChartOptions = useCallback((): ApexCharts.ApexOptions => {
    if (!report || !machineData.length) return {};

    const isPerformance = report.reportType === "performance";
    const chartData = handleDailyWorkingFormatData(
      report.reportType === "hours" ? "working" : "fuel"
    );
    const isHours = report.reportType === "hours";
    const barColor = isHours ? "#FFD335" : "#4A90E2";
    const dateCount = chartData.dates.length;

    return {
      chart: {
        id: "vehicle-chart",
        type: "bar",
        width: CHART_WIDTH,
        height: CHART_HEIGHT,
        background: "#ffffff",
        animations: { enabled: true },
        fontFamily: "Roboto, sans-serif",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      plotOptions: {
        bar: {
          columnWidth: dateCount <= 14 ? "60%" : dateCount <= 21 ? "55%" : "55%",
          borderRadius: 2,
          dataLabels: { position: "top" as const },
        },
      },
      dataLabels: {
        enabled: true,
        style: { colors: ["#333"], fontSize: "9px" },
        formatter: (val: number) => (val != null ? Number(val).toFixed(0).toString() : ""),
        offsetY: -12,
      },
      series: isPerformance ? [
        {
          name: t("machineInfoPage.summaryWidget.labels.std"),
          data: handleDailyWorkingFormatData("working").values,
          color: "#FFD335",
        },
        {
          name: t("documentPage.liter"),
          data: chartData.values,
          color: "#4A90E2",
        },
      ] : [
        {
          name: isHours
            ? t("machineInfoPage.summaryWidget.labels.std")
            : t("documentPage.liter"),
          data: chartData.values,
          color: barColor,
        },
      ],
      xaxis: {
        type: "category",
        categories: chartData.dates,
        labels: {
          rotate: dateCount > 28 ? -90 : dateCount > 14 ? -45 : 0,
          style: {
            fontSize: dateCount > 28 ? "7px" : dateCount > 21 ? "8px" : "10px",
            colors: "#333",
          },
          trim: false,
          hideOverlappingLabels: false,
          showDuplicates: true,
        },
        axisBorder: { show: true, color: "#ccc" },
        axisTicks: { show: true },
      },
      yaxis: {
        title: {
          text: isHours ? t("documentPage.hour") : t("documentPage.liter"),
          style: { fontSize: "11px", color: "#333" },
        },
        labels: { style: { fontSize: "10px", colors: "#333" } },
        axisBorder: { show: true, color: "#ccc" },
        axisTicks: { show: true },
        crosshairs: { show: false },
        tickAmount: 6,
      },
      grid: {
        borderColor: "#e5e5e5",
        strokeDashArray: 1,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 10, right: 10, bottom: 0, left: 10 },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "11px",
        fontWeight: 500,
        itemMargin: { horizontal: 8 },
      },
      fill: { opacity: 1 },
      stroke: { width: 1, colors: ["#fff"] },
      tooltip: { enabled: false },
    };
  }, [report, machineData, handleDailyWorkingFormatData, t]);

  const renderWorkingDataTables = useCallback(() => {
    const workingData = handleDailyWorkingFormatData("working");
    const totalWorking = workingData.values.map((val) => parseFloat(val.toFixed(2)) + ' ' + t("global.h"));

    const tableData: { hours: string[]; rows: TableRow[] } = {
      hours: workingData.dates,
      rows: [
        {
          mode: `${t("global.total")} (${t("global.h")})`,
          styleKey: 'standart',
          values: totalWorking,
        },
      ],
    };

    const totalHours = tableData.hours.length;
    const groupSize = totalHours > 30 ? 14 : (totalHours > 20 ? 10 : 14);
    const groups = Math.ceil(totalHours / groupSize);

    return Array.from({ length: groups }).map((_, index) => {
      const start = index * groupSize;
      const end = Math.min(start + groupSize, totalHours);

      return (
        <div key={`working-table-group-${index}`} style={{ marginBottom: 10 }}>
          <DailyWorkingTable
            hours={tableData.hours.slice(start, end)}
            rows={tableData.rows.map((row) => ({
              ...row,
              values: row.values.slice(start, end),
            }))}
          />
        </div>
      );
    });
  }, [handleDailyWorkingFormatData, t]);

  const renderFuelDataTables = useCallback(() => {
    const fuelData = handleDailyWorkingFormatData("fuel");
    const workingData = handleDailyWorkingFormatData("working");

    const totalFuel = fuelData.values.map((val) => parseFloat(val.toFixed(2)) + ' ' + t("documentPage.liter"));
    const avgFuel = fuelData.values.map((fuel, idx) => {
      const work = workingData.values[idx];
      return work > 0 ? parseFloat((fuel / work).toFixed(2)) + ' ' + t("documentPage.liter") : '0 ' + t("documentPage.liter");
    });

    const tableData: { hours: string[]; rows: TableRow[] } = {
      hours: fuelData.dates,
      rows: [
        {
          mode: `${t("global.total")} (${t("documentPage.liter")})`,
          styleKey: "fuelTotal",
          values: totalFuel,
        },
        {
          mode: `${t("global.avg")} (${t("documentPage.liter")}/${t("documentPage.hour")})`,
          styleKey: "fuelAvg",
          values: avgFuel,
        },
      ],
    };

    const totalHours = tableData.hours.length;
    const groupSize = totalHours > 30 ? 14 : (totalHours > 20 ? 10 : 14);
    const groups = Math.ceil(totalHours / groupSize);

    return Array.from({ length: groups }).map((_, index) => {
      const start = index * groupSize;
      const end = Math.min(start + groupSize, totalHours);

      return (
        <div key={`fuel-table-group-${index}`} style={{ marginBottom: 10 }}>
          <DailyWorkingTable
            hours={tableData.hours.slice(start, end)}
            rows={tableData.rows.map((row) => ({
              ...row,
              values: row.values.slice(start, end),
            }))}
          />
        </div>
      );
    });
  }, [handleDailyWorkingFormatData, t]);

  // ---- Render helpers ----

  const parseNumberFromUnitText = (value: unknown) => {
    // "12.3 L", "10.00 h", "10.00 sa." gibi metinleri sayıya çevirir
    const str = String(value ?? '');
    const match = str.match(/-?\d+(?:[.,]\d+)?/);
    if (!match) return 0;
    const normalized = match[0].replace(',', '.');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  };



  const getPerformanceFooterCells = (
    rows: Array<any>,
    machineCount: number
  ) => {
    const safeMachineCount = Number(machineCount) || 1;

    const totalWorkHours = rows.reduce((acc, row) => acc + parseNumberFromUnitText(row.totalWorkHours), 0);
    const totalFuel = rows.reduce((acc, row) => acc + parseNumberFromUnitText(row.totalFuel), 0);
    const avgFuel = rows.reduce((acc, row) => acc + parseNumberFromUnitText(row.avgFuel), 0) / safeMachineCount;

    return {
      totalWorkHours: totalWorkHours.toFixed(2),
      totalFuel: totalFuel.toFixed(2),
      avgFuel: avgFuel.toFixed(2),
    };
  };

  /** Header bileşeni (her sayfa için) */
  const renderHeader = (showFullHeader: boolean = false) => (
    <div style={styles.header}>
      <img src={logo} style={{ width: 120, height: "auto" }} alt="Logo" />
      {showFullHeader ? (
        <span style={styles.headerText}>
          {report?.reportType === "hours" ? t("global.schema1") :
            report?.reportType === "fuel" ? t("global.schema2") :
              report?.reportType === "performance" ? t("global.schema3") : ""}
        </span>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <svg width={18} viewBox="0 0 512 512">
          <path fill="white" d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z" />
        </svg>
        <span style={styles.headerText}>{infoCardData.creator}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col">
        <SvgIcons iconName="Loading" />
        <p className="ml-4 text-xl font-medium mt-4">{t("documentPage.loadingReport")}</p>
      </div>
    );
  }

  const FIRST_PAGE_ROWS = 16;
  const NEXT_PAGE_ROWS = 20;

  // Satırları sayfalara böler: ilk sayfa FIRST_PAGE_ROWS, sonraki sayfalar NEXT_PAGE_ROWS
  function chunkTableRows<T>(rows: T[]): T[][] {
    if (!rows.length) return [];
    const pages: T[][] = [rows.slice(0, FIRST_PAGE_ROWS)];
    let offset = FIRST_PAGE_ROWS;
    while (offset < rows.length) {
      pages.push(rows.slice(offset, offset + NEXT_PAGE_ROWS));
      offset += NEXT_PAGE_ROWS;
    }
    return pages;
  }

  const workingTableData = handleWorkingFormatData();
  const fuelTableData = handleFuelFormatData();
  const performanceTableData = handlePerformanceFormatData();
  const chartOptions = getChartOptions();
  const performanceFooterTotals = getPerformanceFooterCells(
    performanceTableData.rows,
    machineData.length
  );

  const perfFooterRow = [
    { value: t("global.total"), colspan: 5 },
    { value: performanceFooterTotals.totalWorkHours.replace('.', ',') + " " + t("global.h") },
    { value: performanceFooterTotals.totalFuel.replace('.', ',') + " kWh" },
    { value: performanceFooterTotals.avgFuel.replace('.', ',') + " kWh" },
  ];

  const fuelPages = chunkTableRows(fuelTableData.rows);
  const perfPages = chunkTableRows(performanceTableData.rows);

  return (
    <>
      {/* Yazdır butonu */}
      <button
        className="doc-print-btn"
        style={printBtnStyle}
        onClick={() => {
          // Print öncesi stili zorla yenile
          const style = document.getElementById("document-page-print-styles") as HTMLStyleElement | null;
          if (style) {
            const content = style.textContent ?? "";
            style.textContent = "";
            // Firefox'un style'ı flush etmesi için kısa bekleme
            requestAnimationFrame(() => {
              style.textContent = content;
              requestAnimationFrame(() => window.print());
            });
          } else {
            window.print();
          }
        }}
        title={t("documentPage.print", "Yazdır")}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        {t("documentPage.print", "Yazdır")}
      </button>

      {/* Sayfa container */}
      <div className="doc-scroll-container" style={pageContainerStyle}>

        {/* ===== SAYFA 1: Başlık + Info Card + Ana Tablo ===== */}
        <div className="doc-page" style={a4PageStyle}>
          {renderHeader(true)}

          {/* Info Card */}
          <div style={styles.infoCard}>
            {infoCardData?.reportType !== "performance" ? (
              <>
                <div style={styles.infoCardRow}>
                  <span style={styles.infoCardTitle}>Rapor Tipi:</span>
                  <span style={styles.infoCardValue}>
                    {infoCardData.reportType === "hours" ? t("global.schema1") :
                      infoCardData.reportType === "performance" ? t("global.schema3") :
                        t("global.schema2")}
                  </span>
                </div>
                <div style={styles.infoCardRow}>
                  <span style={styles.infoCardTitle}>{t("documentPage.dateRange")}:</span>
                  <span style={styles.infoCardValue}>{infoCardData.dateRange}</span>
                </div>
                <div style={styles.infoCardRow}>
                  <span style={styles.infoCardTitle}>{t("documentPage.creator")}:</span>
                  <span style={styles.infoCardValue}>{infoCardData.creator}</span>
                </div>
                <div style={styles.infoCardRow}>
                  <span style={styles.infoCardTitle}>{t("documentPage.creationDate")}:</span>
                  <span style={styles.infoCardValue}>{infoCardData.creationDate}</span>
                </div>
                <div style={styles.infoCardRow}>
                  <span style={styles.infoCardTitle}>{t("documentPage.reportDuration")}:</span>
                  <span style={styles.infoCardValue}>{infoCardData.reportDuration}</span>
                </div>
                <div style={styles.infoCardRow}>
                  <span style={styles.infoCardTitle}>{t("documentPage.totalWorkingHours")}:</span>
                  <span style={styles.infoCardValue}>{infoCardData.totalWorkingHours} {t("global.h")}</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ ...styles.infoCardRow, flexDirection: 'column', width: '33.333%' }}>
                  <div style={styles.infoCardRowColText}>
                    <svg width={18} viewBox="0 0 512 512">
                      <rect fill="none" stroke="#015a9c" strokeLinejoin="round" strokeWidth={32} x={48} y={80} width={416} height={384} rx={48} />
                      <path fill="none" stroke="#015a9c" strokeLinejoin="round" strokeWidth={32} strokeLinecap="round" d="M128 48v32m256-32v32" />
                      <path fill="none" stroke="#015a9c" strokeLinejoin="round" strokeWidth={32} d="M464 160H48" />
                    </svg>
                    <span style={styles.infoCardTitleCol}>{t("documentPage.creationDate")}:</span>
                  </div>
                  <span style={styles.infoCardValue}>{infoCardData.creationDate}</span>
                </div>
                <div style={{ ...styles.infoCardRow, flexDirection: 'column', width: '33.333%' }}>
                  <div style={styles.infoCardRowColText}>
                    <svg width={18} viewBox="0 0 512 512">
                      <rect fill="none" stroke="#015a9c" strokeLinejoin="round" strokeWidth={32} x={48} y={80} width={416} height={384} rx={48} />
                      <path fill="none" stroke="#015a9c" strokeLinejoin="round" strokeWidth={32} strokeLinecap="round" d="M128 48v32m256-32v32" />
                      <path fill="none" stroke="#015a9c" strokeLinejoin="round" strokeWidth={32} d="M464 160H48" />
                    </svg>
                    <span style={styles.infoCardTitleCol}>{t("documentPage.dateRange")}:</span>
                  </div>
                  <span style={styles.infoCardValue}>{infoCardData.dateRange}</span>
                </div>
                <div style={{ ...styles.infoCardRow, flexDirection: 'column', width: '33.333%' }}>
                  <div style={styles.infoCardRowColText}>
                    <svg viewBox="0 0 512 512" width={18}>
                      <path d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z" fill="none" stroke="#015a9c" strokeWidth={32} />
                      <path fill="none" stroke="#015a9c" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 128v144h96" />
                    </svg>
                    <span style={styles.infoCardTitleCol}>{t("documentPage.reportDuration")}:</span>
                  </div>
                  <span style={styles.infoCardValue}>{infoCardData.reportDuration}</span>
                </div>
              </>
            )}
          </div>

          {/* Ana Tablo */}
          {report?.reportType === "hours" ? (
            <div style={styles.content}>
              <span style={styles.title}>
                {t("documentPage.totalWorkingTime")}
                {report?.timeRange?.startDate && report?.timeRange?.endDate
                  ? `: ${report.timeRange.startDate}-${report.timeRange.endDate}`
                  : ""}
              </span>
              {workingTableData.rows.length > 16 ? (
                <PDFTable
                  columns={workingTableData.columns}
                  rows={workingTableData.rows.slice(0, 16)}
                />
              ) : (
                <PDFTableFuel
                  columns={workingTableData.columns}
                  rows={workingTableData.rows}
                />
              )}
            </div>
          ) : report?.reportType === "performance" ? (
            <div style={styles.content}>
              <PDFTableFuel
                columns={performanceTableData.columns}
                rows={perfPages[0] ?? []}
                footer={perfPages.length <= 1 ? [perfFooterRow] : undefined}
              />
            </div>
          ) : (
            <div style={styles.content}>
              <span style={styles.title}>
                {t("documentPage.fuelTitle")}
                {report?.timeRange?.startDate && report?.timeRange?.endDate
                  ? `: ${report.timeRange.startDate}-${report.timeRange.endDate}`
                  : ""}
              </span>
              <PDFTableFuel
                columns={fuelTableData.columns}
                rows={fuelPages[0] ?? []}
              />
            </div>
          )}
        </div>

        {/* ===== Taşan sayfalar: Çalışma Süresi ===== */}
        {report?.reportType === "hours" && workingTableData.rows.length > FIRST_PAGE_ROWS && (
          <div className="doc-page" style={a4PageStyle}>
            {renderHeader()}
            <div style={styles.content}>
              <span style={styles.title}>
                {t("documentPage.totalWorkingTime")}
                {report?.timeRange?.startDate && report?.timeRange?.endDate
                  ? `: ${report.timeRange.startDate}-${report.timeRange.endDate}`
                  : ""}
              </span>
              <PDFTable
                columns={workingTableData.columns}
                rows={workingTableData.rows.slice(FIRST_PAGE_ROWS)}
              />
            </div>
          </div>
        )}

        {/* ===== Taşan sayfalar: Tüketilen Enerji (fuel) ===== */}
        {report?.reportType === "fuel" && fuelPages.slice(1).map((pageRows, i) => (
          <div key={`fuel-overflow-${i}`} className="doc-page" style={a4PageStyle}>
            {renderHeader()}
            <div style={styles.content}>
              <span style={styles.title}>
                {t("documentPage.fuelTitle")}
                {report?.timeRange?.startDate && report?.timeRange?.endDate
                  ? `: ${report.timeRange.startDate}-${report.timeRange.endDate}`
                  : ""}
              </span>
              <PDFTableFuel columns={fuelTableData.columns} rows={pageRows} />
            </div>
          </div>
        ))}

        {/* ===== Taşan sayfalar: Performans ===== */}
        {report?.reportType === "performance" && perfPages.slice(1).map((pageRows, i, arr) => (
          <div key={`perf-overflow-${i}`} className="doc-page" style={a4PageStyle}>
            {renderHeader()}
            <div style={styles.content}>
              <PDFTableFuel
                columns={performanceTableData.columns}
                rows={pageRows}
                footer={i === arr.length - 1 ? [perfFooterRow] : undefined}
              />
            </div>
          </div>
        ))}

        {/* ===== SAYFA: Günlük Çalışma Saatleri (hours) ===== */}
        {report?.reportType === "hours" && (
          <div className="doc-page" style={a4PageStyle}>
            {renderHeader()}
            <div style={styles.content}>
              <span style={styles.title}>{t("documentPage.dailyWorkingHours")}</span>
              {renderWorkingDataTables()}
            </div>
          </div>
        )}

        {/* ===== SAYFA: Günlük Enerji Tüketimi (sadece fuel tipi) ===== */}
        {report?.reportType === "fuel" && (
          <div className="doc-page" style={a4PageStyle}>
            {renderHeader()}
            <div style={styles.content}>
              <span style={styles.title}>{t("documentPage.dailyFuelTitle")}</span>
              {renderFuelDataTables()}
            </div>
          </div>
        )}

        {/* ===== SAYFA: Grafik (performance hariç) ===== */}
        {report?.reportType !== "performance" && (
          <div className="doc-page" style={a4PageStyle}>
            {renderHeader()}
            <div style={styles.chartPageContent}>
              <span style={styles.title}>
                {report?.reportType === "hours"
                  ? t("documentPage.workingGraph")
                  : report?.reportType === "performance"
                    ? t("global.schema3", "Performans Grafiği")
                    : t("documentPage.fuelGraph")}
              </span>
              <div style={{ width: CHART_WIDTH, maxWidth: "100%", marginTop: 12 }}>
                <ReactApexChart
                  options={chartOptions}
                  series={chartOptions.series as ApexAxisChartSeries}
                  type="bar"
                  width={CHART_WIDTH}
                  height={CHART_HEIGHT}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentPage;