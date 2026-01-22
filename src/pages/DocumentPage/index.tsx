import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import styles from "./style";
import ApexCharts from "apexcharts";
import PDFTable from "./table";
import PDFTableFuel from "./tableFuel";
import DailyWorkingTable from "./dailyWorkingTable";
import { reportStore } from "../../store/ReportStore";
import { ReportData as BaseReportData } from "../ReportPage/type";
import { useTranslation } from "react-i18next";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import { getValuesTimeSeries, getValuesAttributes } from "../../services/telemetry";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

// API'den gelen veri tipi
interface IResponseTimeSeries {
  [key: string]: Array<{
    ts: number;
    value: string;
  }>;
}

// Makine verisi tipi (basitleştirilmiş)
interface MachineData {
  id: number;
  name: string;
  serialNo: string;
  model: string;
  type: string;
  workingHours?: Array<{ ts: number; value: number; date: string }>;
  fuelConsumption?: Array<{ ts: number; value: number; date: string }>;
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
}

interface TableRow {
  mode: string;
  styleKey: string;
  values: number[];
}

interface TableData {
  hours: any[];
  rows: TableRow[];
}

const DocumentPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [report, setReport] = useState<ExtendedReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfReady, setPdfReady] = useState<boolean>(false);
  const [machineData, setMachineData] = useState<MachineData[]>([]);
  const [machineType, setMachineType] = useState<string | null>(null);

  

  // Timestamp'i tarihe çeviren fonksiyon
  const timestampToDate = useCallback((timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Tarih string'ini timestamp'e çeviren fonksiyon
  const dateToTimestamp = useCallback((dateStr: string): number => {
    const [day, month, year] = dateStr.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
  }, []);

  // API'den makine verilerini çeken fonksiyon (sadece DailyWorkingHours)
  const fetchMachineData = useCallback(async (
    machineId: number,
    startDate: string,
    endDate: string
  ): Promise<MachineData | null> => {
    try {
      const startTs = dateToTimestamp(startDate);
      const endTs = dateToTimestamp(endDate);

      const machineInfo = report?.selectedMachines.find(m => m.id === machineId);
      if (!machineInfo) return null;



      // hours raporu için
      if (report?.reportType === "hours") {
        const workingHoursData = await getValuesTimeSeries(
          "DEVICE",
          machineId.toString(),
          ["DailyWorkingHours"],
          startTs,
          endTs,
          true
        );

        const deviceNameAttr = await getValuesAttributes("DEVICE",machineId.toString(), ["deviceName"]);
        const deviceName = deviceNameAttr[0]?.value;


        const workingHours = workingHoursData?.DailyWorkingHours?.map(item => ({
          ts: item.ts,
          value: parseFloat(item.value),
          date: timestampToDate(item.ts)
        })) || [];

        return {
          ...machineInfo,
          name: deviceName,
          workingHours
        };
      }

      // fuel raporu için
      if (report?.reportType === "fuel") {
        const fuelData = await getValuesTimeSeries(
          "DEVICE",
          machineId.toString(),
          ["DailyFuelCons"],
          startTs,
          endTs,
          true
        );

        const fuelConsumption = fuelData?.DailyFuelCons?.map(item => ({
          ts: item.ts,
          value: parseFloat(item.value),
          date: timestampToDate(item.ts)
        })) || [];

        const workingHoursData = await getValuesTimeSeries(
    "DEVICE",
    machineId.toString(),
    ["DailyWorkingHours"],
    startTs,
    endTs,
    true
  );

  const workingHours = workingHoursData?.DailyWorkingHours?.map(item => ({
    ts: item.ts,
    value: parseFloat(item.value),
    date: timestampToDate(item.ts)
  })) || [];


        return {
    ...machineInfo,
    fuelConsumption,
    name: deviceName,
    workingHours, // bu şart artık
  };
      }

      return null;
    } catch (error) {
      console.error(`Makine ${machineId} verisi çekilemedi:`, error);
      return null;
    }
  }, [report, dateToTimestamp, timestampToDate]);


  // Tüm makine verilerini çeken fonksiyon
  const fetchAllMachinesData = useCallback(async () => {
    if (!report?.selectedMachines || !report?.timeRange) return;

    setLoading(true);

    try {
      console.log('Tüm makineler için veri çekiliyor...', report.selectedMachines);

      const promises = report.selectedMachines.map(machine =>
        fetchMachineData(
          machine.id,
          report.timeRange!.startDate,
          report.timeRange!.endDate
        )
      );

      const results = await Promise.all(promises);
      const validResults = results.filter(result => result !== null) as MachineData[];

      console.log('API\'den çekilen tüm makine verileri:', validResults);

      setMachineData(validResults);
      setLoading(false);
    } catch (error) {
      console.error('Makine verileri çekilemedi:', error);
      setLoading(false);
    }
  }, [report, fetchMachineData]);

  // Report bilgilerini çeken useEffect
  useEffect(() => {
    const fetchReport = () => {
      const allReports = reportStore.getAllReports();
      const fetchedReport = allReports.find(
        (report) => report.id.toString() === id
      );
      setReport(fetchedReport as unknown as ExtendedReportData);

      if (fetchedReport?.selectedMachines[0].type) {
        setMachineType(fetchedReport.selectedMachines[0].type);
      }
    };

    fetchReport();
  }, [id]);

  // Report yüklendiğinde makine verilerini çek
  useEffect(() => {
    if (report) {
      fetchAllMachinesData();
    }
  }, [report, fetchAllMachinesData]);

  // Tarih aralığı oluşturan fonksiyon (API verisi için güncellenmiş)
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

  // API verisi ile tablo verisini oluşturan fonksiyon (sadece standart çalışma)
  const handleWorkingFormatData = useCallback(() => {
    if (!report || !machineData.length) return { columns: [], rows: [] };

    console.log('Tablo verisi oluşturuluyor...', machineData);

    const rows = machineData.map((machine) => {
      const totalHours = machine.workingHours?.reduce((acc, item) => acc + item.value, 0) || 0;

      console.log(`${machine.name} toplam saat:`, totalHours);

      return {
        machineName: machine.name,
        serialNumber: machine.serialNo,
        class: machine.type?.replace(/\n/g, ' '),
        model: machine.model,
        totalWorkHours: totalHours.toFixed(2),
        standardTime: totalHours.toFixed(2), // Tüm çalışma standart olarak göster
      };
    });

    // Sadece temel kolonlar + standart çalışma
    const columns = [
      { key: "machineName", header: t("documentPage.machineName") },
      { key: "serialNumber", header: t("documentPage.serialNumber") },
      { key: "class", header: t("documentPage.class") },
      { key: "model", header: t("documentPage.model") },
      { key: "totalWorkHours", header: t("documentPage.totalWorkingHours") },
      { key: "standardTime", header: t("machineInfoPage.summaryWidget.labels.std"), style: styles.eco },
    ];

    console.log('Oluşturulan tablo verisi:', { columns, rows });

    return { columns, rows };
  }, [report, machineData, t]);

 const handleFuelFormatData = () => {
  if (!report || !machineData.length) return { columns: [], rows: [] };

  const rows = machineData.map((machine) => {
    const totalFuel = machine.fuelConsumption?.reduce((acc, item) => acc + item.value, 0) || 0;
    const totalHours = machine.workingHours?.reduce((acc, item) => acc + item.value, 0) || 0;

    // Ortalama yakıt tüketimi (L/sa)
    const avgFuel = totalHours > 0 ? (totalFuel / totalHours) : 0;

    console.log(`${machine.name} -> Toplam Yakıt: ${totalFuel}, Toplam Saat: ${totalHours}, Ortalama: ${avgFuel}`);

    return {
      machineName: machine.name,
      serialNumber: machine.serialNo,
      class: machine.type?.replace(/\n/g, ' '),
      model: machine.model,
      totalFuel: totalFuel.toFixed(2),
      avgFuel: avgFuel.toFixed(2),
    };
  });

  const columns = [
    { key: "machineName", header: t("documentPage.machineName") },
    { key: "serialNumber", header: t("documentPage.serialNumber") },
    { key: "class", header: t("documentPage.class") },
    { key: "model", header: t("documentPage.model") },
    { key: "totalFuel", header: t("global.totalFuel") }, // çok dilli destek
    { key: "avgFuel", header: t("global.avgFuel") },
  ];

  return { columns, rows };
};



  // Günlük veriyi formatlayan fonksiyon (sadece standart çalışma)
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


const getChartOptions = useCallback((): ApexCharts.ApexOptions => {
  if (!report || !machineData.length) return {};

  console.log('Chart oluşturuluyor...');

  // rapor tipine göre doğru veri çek
  const chartData = handleDailyWorkingFormatData(
    report.reportType === "hours" ? "working" : "fuel"
  );

  return {
    chart: {
      id: "vehicle-chart",
      type: "bar",
      height: chartData.dates.length < 22 ? 200 : 340,
      width: 800,
      background: "#ffffff",
      animations: { enabled: false }
    },
    plotOptions: {
      bar: {
        columnWidth: chartData.dates.length < 22 ? 20 : '50%',
      },
    },
    dataLabels: { enabled: false },
    series: [
      {
        name: report.reportType === "hours" 
          ? t("machineInfoPage.summaryWidget.labels.std") 
          : t("documentPage.liter"),
        data: chartData.values,
        color: report.reportType === "hours" ? "#FFD335" : "#4A90E2",
      }
    ],
    xaxis: {
      type: "category",
      categories: chartData.dates,
      labels: { rotate: -45 },
    },
    yaxis: {
      title: {
        text: report.reportType === "hours" 
          ? t("documentPage.hour") 
          : t("documentPage.liter"),
      },
    },
    legend: { position: "bottom" },
    fill: { opacity: 1 },
  };
}, [report, machineData, handleDailyWorkingFormatData, t]);

  // Tablo verilerini oluşturan fonksiyon (sadece standart çalışma)
  const handleTableData = useCallback((): TableData => {
    if (!machineData.length) return { hours: [], rows: [] };

    console.log('Günlük tablo verisi oluşturuluyor...');

    const workingData = handleDailyWorkingFormatData("working");

    console.log('Günlük çalışma verisi:', workingData);

    const rowsData = [
      {
        mode: "Standart Çalışma",
        styleKey: "eco",
        values: workingData.values,
      }
    ];

    return {
      hours: workingData.dates,
      rows: rowsData,
    };
  }, [machineData, handleDailyWorkingFormatData]);

  // Günlük çalışma tablolarını render eden fonksiyon
  const renderDailyWorkingTables = useCallback(() => {
    const tableData = handleTableData();
    const totalHours = tableData.hours.length;

    const groupSize = totalHours > 30 ? 7 : (totalHours > 20 ? 10 : 14);
    const groups = Math.ceil(totalHours / groupSize);

    return Array.from({ length: groups }).map((_, index) => {
      const start = index * groupSize;
      const end = Math.min(start + groupSize, totalHours);

      return (
        <View key={`table-group-${index}`} style={{ marginBottom: 10 }} wrap={false}>
          <DailyWorkingTable
            hours={tableData.hours.slice(start, end)}
            rows={tableData.rows.map(row => ({
              ...row,
              values: row.values.slice(start, end)
            }))}
          />
        </View>
      );
    });
  }, [handleTableData]);

  // Yakıt tabloları render fonksiyonu
  const renderFuelDataTables = useCallback(() => {
    const fuelData = handleDailyWorkingFormatData("fuel");
    const workingData = handleDailyWorkingFormatData("working");

    const totalFuel = fuelData.values.map((val) => parseFloat(val.toFixed(2)));
    const avgFuel = fuelData.values.map((fuel, idx) => {
      const work = workingData.values[idx];
      return work > 0 ? parseFloat((fuel / work).toFixed(2)) : 0;
    });

    const tableData = {
      hours: fuelData.dates,
      rows: [
        {
          mode: t("global.total"),
          styleKey: "fuelTotal",
          values: totalFuel,
        },
        {
          mode: t("global.avg"),
          styleKey: "fuelAvg",
          values: avgFuel,
        },
      ],
    };

    const totalHours = tableData.hours.length;
    const groupSize = totalHours > 30 ? 7 : (totalHours > 20 ? 10 : 14);
    const groups = Math.ceil(totalHours / groupSize);

    return Array.from({ length: groups }).map((_, index) => {
      const start = index * groupSize;
      const end = Math.min(start + groupSize, totalHours);

      return (
        <View key={`fuel-table-group-${index}`} style={{ marginBottom: 10 }} wrap={false}>
          <DailyWorkingTable
            hours={tableData.hours.slice(start, end)}
            rows={tableData.rows.map((row) => ({
              ...row,
              values: row.values.slice(start, end),
            }))}
          />
        </View>
      );
    });
  }, [handleDailyWorkingFormatData, t]);

  // Chart oluşturma useEffect'i
  useEffect(() => {
    if (!report || !machineData.length) return;

    const createChart = () => {
      const chartDiv = document.createElement("div");
      chartDiv.id = "temp-chart-container";
      chartDiv.style.position = "absolute";
      chartDiv.style.visibility = "hidden";
      document.body.appendChild(chartDiv);

      const options: ApexCharts.ApexOptions = getChartOptions();
      const chart = new ApexCharts(chartDiv, options);

      chart.render().then(() => {
        setTimeout(() => {
          chart
            .dataURI()
            .then((uri) => {
              if ("imgURI" in uri) {
                setChartImage(uri.imgURI);
                setTimeout(() => {
                  setPdfReady(true);
                }, 500);
              }
              document.body.removeChild(chartDiv);
            })
            .catch((error) => {
              console.error("Chart URI alınamadı:", error);
              document.body.removeChild(chartDiv);
              setPdfReady(true);
            });
        }, 1000);
      });

      return chartDiv;
    };

    const chartDiv = createChart();

    return () => {
      if (document.body.contains(chartDiv)) {
        document.body.removeChild(chartDiv);
      }
    };
  }, [report, machineData, getChartOptions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col">
        <SvgIcons iconName="Loading" />
        <p className="ml-4 text-xl font-medium mt-4">{t("documentPage.loadingReport")}</p>
      </div>
    );
  }

  if (!pdfReady) {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col">
        <SvgIcons iconName="Loading" />
        <p className="ml-4 text-xl font-medium mt-4">{t("documentPage.creatingPDF")}</p>
      </div>
    );
  }

  return (
    <PDFViewer style={styles.viewer}>
      <Document title={`${report?.reportName} - ${report?.timeRange?.startDate} - ${report?.timeRange?.endDate}`}>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.header}>
            <Image src={logo} style={{ width: 120, height: "auto" }} />
          </View>

          {report?.reportType === "hours" ? (
            <View style={styles.content}>
              <Text style={styles.title}>{t("documentPage.totalWorkingTime")}</Text>
              <PDFTable
                columns={handleWorkingFormatData().columns}
                rows={handleWorkingFormatData().rows}
              />

              {chartImage && (
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{t("documentPage.workingGraph")}</Text>
                  <Image
                    src={chartImage}
                    style={{ width: 800, height: "auto", marginTop: -10 }}
                  />
                </View>
              )}

              <View>
                <Text style={styles.title}>{t("documentPage.dailyWorkingHours")} ({t("documentPage.hour")})</Text>
                {renderDailyWorkingTables()}
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <Text style={styles.title}>{t("documentPage.fuelTitle")}</Text>
              <PDFTableFuel
    columns={handleFuelFormatData().columns}
    rows={handleFuelFormatData().rows}
  />
                {chartImage && (
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.title}>{t("documentPage.fuelGraph")}</Text>
                  <Image
                    src={chartImage}
                    style={{ width: 800, height: "auto", marginTop: -10 }}
                  />
                </View>
              )}

              <View>
                <Text style={styles.title}>{t("documentPage.dailyFuelTitle")}</Text>
                {renderFuelDataTables()}
              </View>
            </View>
          )}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default DocumentPage;