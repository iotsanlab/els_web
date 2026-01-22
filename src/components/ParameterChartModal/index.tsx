import { Dialog, DialogPanel } from "@headlessui/react";
import { X, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getValuesTimeSeries } from "../../services/telemetry";
import ParameterLineChart from "../ApexChart/ParameterLineChart";
import machineParametersName from "../../data/MachineParameters";

// ============================================
// Types
// ============================================
interface TimeSeriesDataPoint {
    ts: number;
    value: string | number;
}

interface Props {
    deviceId: string;
    machineType: string;
    isOpen: boolean;
    onClose: () => void;
    parameterName: string;
}

// ============================================
// Constants
// ============================================
const TIME_RANGES = {
    WEEKLY: 7,
    MONTHLY: 30,
    YEARLY: 365,
} as const;

const CHART_COLORS = {
    PRIMARY: "#005a9c",
    EMPTY: "#E5E7EB",
    GRADIENT_START: "#005a9c",
    GRADIENT_END: "#00497e",
} as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ============================================
// Utility Functions
// ============================================
const formatDate = (timestamp: number, isYearly: boolean = false): string => {
    const date = new Date(timestamp);
    
    if (isYearly) {
        const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
        return monthNames[date.getMonth()];
    }
    
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}.${month}`;
};

const parseValue = (value: string | number): number => {
    const parsed = typeof value === "string" ? parseFloat(value) : Number(value);
    return isNaN(parsed) ? 0 : Number(parsed.toFixed(1));
};

const getStartTimestamp = (days: number): number => {
    return Date.now() - days * MS_PER_DAY;
};

// Eksik günleri 0 değeri ile doldur
const fillMissingDays = (data: TimeSeriesDataPoint[], startTime: number, endTime: number): TimeSeriesDataPoint[] => {
    if (!data || data.length === 0) {
        // Veri yoksa tüm günleri 0 ile doldur
        const result: TimeSeriesDataPoint[] = [];
        for (let time = startTime; time <= endTime; time += MS_PER_DAY) {
            result.push({ ts: time, value: 0 });
        }
        return result;
    }

    // Mevcut verileri timestamp'e göre map'e al
    const dataMap = new Map<string, number>();
    data.forEach(item => {
        const dateKey = new Date(item.ts).toISOString().slice(0, 10);
        const value = parseValue(item.value);
        dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + value);
    });

    // Tüm günleri doldur
    const result: TimeSeriesDataPoint[] = [];
    for (let time = startTime; time <= endTime; time += MS_PER_DAY) {
        const dateKey = new Date(time).toISOString().slice(0, 10);
        const value = dataMap.get(dateKey) || 0;
        result.push({ ts: time, value: value });
    }

    return result;
};

// Yıllık view için aylık gruplama
const groupByMonth = (data: TimeSeriesDataPoint[]): TimeSeriesDataPoint[] => {
    const monthMap = new Map<string, { sum: number; count: number; ts: number }>();
    
    data.forEach(item => {
        const date = new Date(item.ts);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthMap.has(monthKey)) {
            // Her ayın ilk gününü timestamp olarak kullan
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
            monthMap.set(monthKey, { sum: 0, count: 0, ts: monthStart });
        }
        
        const monthData = monthMap.get(monthKey)!;
        monthData.sum += parseValue(item.value);
        monthData.count += 1;
    });
    
    // 12 ayı doldur
    const result: TimeSeriesDataPoint[] = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
        
        const monthData = monthMap.get(monthKey);
        result.push({
            ts: monthDate.getTime(),
            value: monthData ? monthData.sum : 0
        });
    }
    
    return result;
};

// ============================================
// Custom Hooks
// ============================================
const useBodyScrollLock = (isLocked: boolean) => {
    useEffect(() => {
        document.body.style.overflow = isLocked ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isLocked]);
};

const useEscapeKey = (isActive: boolean, onEscape: () => void) => {
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onEscape();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isActive, onEscape]);
};

// ============================================
// Sub Components
// ============================================
const TimeRangeButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${isActive
                ? "bg-mstYellow text-white shadow-mstYellow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
    `}
    >
        {label}
    </button>
);

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-600 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-mstYellow rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Veriler yükleniyor...</p>
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">{message}</p>
    </div>
);

const ModalHeader: React.FC<{
    title: string;
    onClose: () => void;
}> = ({ title, onClose }) => (
    <div className="flex items-center justify-between p-5 dark:bg-gray-800 border-b border-gray-100">
        <div className="flex items-center gap-3">

            <div>
                <h2 className="text-lg font-semibold dark:text-gray-100 text-gray-900">{title}</h2>
            </div>
        </div>
        <button
            onClick={onClose}
            className="p-2 rounded-full bg-white dark:bg-gray-800 transition-colors duration-200 group"
        >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500  duration-200" />
        </button>
    </div>
);

// ============================================
// Main Component
// ============================================
const ParameterChartModal: React.FC<Props> = ({
    deviceId,
    isOpen,
    onClose,
    parameterName,
    machineType,
}) => {
    const { t } = useTranslation();

    const [chartSeries, setChartSeries] = useState<any[]>([]);
    const [chartDays, setChartDays] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRange, setSelectedRange] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">("WEEKLY");

    const machineParameter = machineParametersName[machineType];
    const parameter = machineParameter?.find((p) => p.parameter === parameterName);

    const parameterLangKey = parameter?.lang_key;

    // Custom hooks
    useBodyScrollLock(isOpen);
    useEscapeKey(isOpen, onClose);

    // Memoized values
    const timeRangeOptions = useMemo(
        () => [
            { key: "WEEKLY" as const, label: t("global.weekly"), days: TIME_RANGES.WEEKLY },
            { key: "MONTHLY" as const, label: t("global.monthly"), days: TIME_RANGES.MONTHLY },
            { key: "YEARLY" as const, label: t("global.yearly") || "Yıllık", days: TIME_RANGES.YEARLY },
        ],
        [t]
    );

    const hasData = chartSeries.length > 0 && chartSeries[0]?.data?.length > 0;

    // Transform API response to chart data
    const transformToChartData = useCallback(
        (data: TimeSeriesDataPoint[], startTime: number, endTime: number, isYearly: boolean): { days: string[]; series: any[] } => {
            let processedData: TimeSeriesDataPoint[];
            
            if (isYearly) {
                // Yıllık view için aylık gruplama
                processedData = groupByMonth(data);
            } else {
                // Günlük view için eksik günleri doldur
                processedData = fillMissingDays(data, startTime, endTime);
            }

            if (!processedData?.length) {
                return {
                    days: [],
                    series: [{ name: parameterName, data: [], color: CHART_COLORS.PRIMARY }],
                };
            }

            const formattedDays = processedData.map((item) => formatDate(item.ts, isYearly));
            const rawValues = processedData.map((item) => parseValue(item.value));

            // Line chart için sadece number array gerekli
            return {
                days: formattedDays,
                series: [
                    { 
                        name: t(parameterLangKey as string), 
                        data: rawValues,
                        color: CHART_COLORS.PRIMARY 
                    }
                ],
            };
        },
        [parameterName, parameterLangKey, t]
    );

    // Fetch chart data
    useEffect(() => {
        if (!deviceId || !parameterName || !isOpen) return;

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const days = TIME_RANGES[selectedRange];
                const startTime = getStartTimestamp(days);
                const endTime = Date.now();

                const isYearly = selectedRange === "YEARLY";
                
                const response = await getValuesTimeSeries(
                    "DEVICE",
                    deviceId,
                    [parameterName],
                    startTime,
                    endTime,
                    !isYearly, // daily: haftalık ve aylık için true
                    isYearly   // monthly: yıllık için true (aylık gruplama)
                );

                const data = response[parameterName as keyof typeof response] as TimeSeriesDataPoint[];
                const { days: chartDays, series } = transformToChartData(data, startTime, endTime, isYearly);

                setChartDays(chartDays);
                setChartSeries(series);
            } catch (error) {
                console.error("Parameter chart data fetch error:", error);
                setChartDays([]);
                setChartSeries([{ name: t(parameterLangKey as string), data: [], color: CHART_COLORS.PRIMARY }]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [deviceId, parameterName, selectedRange, isOpen, transformToChartData]);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-end sm:items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl transform transition-all max-h-[85vh] overflow-hidden">
                    {/* Header */}
                    <ModalHeader title={t(parameterLangKey as string)} onClose={onClose} />

                    {/* Time Range Selector */}
                    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-2">

                            <div className="flex gap-2">
                                {timeRangeOptions.map((option) => (
                                    <TimeRangeButton
                                        key={option.key}
                                        label={option.label}
                                        isActive={selectedRange === option.key}
                                        onClick={() => setSelectedRange(option.key)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chart Content */}
                    <div className="p-5 overflow-y-auto dark:bg-gray-800">
                        {isLoading ? (
                            <LoadingState />
                        ) : hasData ? (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                <style>{`
                  .apexcharts-xaxis-label {
                    font-size: 12px !important;
                    font-weight: 500 !important;
                  }
                `}</style>
                                <div className="overflow-x-auto">
                                    <div style={{ 
                                        minWidth: selectedRange === 'MONTHLY' ? '1000px' : 
                                                  selectedRange === 'YEARLY' ? '100%' : '100%' 
                                    }}>
                                        <ParameterLineChart
                                            series={chartSeries as any}
                                            days={chartDays}
                                            isEmpty={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <EmptyState message={t("global.noDataAvailable") || "Veri bulunamadı"} />
                        )}
                    </div>

                    {/* Footer */}

                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default ParameterChartModal;