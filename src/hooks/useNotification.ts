// hooks/useAlarms.ts
import { useState, useEffect, useCallback } from 'react';
import { getAllAlarms } from '../services/alarms';
import { NotificationData } from '../data/NotificationData';
import i18n from '../context/i18n';
import deviceAttributes from '../store/DeviceAttributes';

interface TransformedAlarm {
  id: string;
  name: string;
  seriNo: string;
  rawSeriNo: string;
  alarmTypeId: string;
  acknowledged: boolean;
  machineType: string;
  deviceId: string;
  severity: string;
  timestamp: number;
  dateTime: string;
  message: string;
  details?: any;
}

interface UseAlarmsOptions {
  deviceId?: string; // Belirli bir cihazın alarmları için
  pageSize?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  acknowledgedFilter?: "all" | "acknowledged" | "unacknowledged";
}

const getNotificationMessage = (alarmId: number | string, lang: string): string => {
  const matched = NotificationData.find(item => String(item.id) === String(alarmId));
  if (!matched) return lang === "en" ? "Unknown notification" : "Bilinmeyen bildirim";
  return lang === "en" ? matched.name_en : matched.name_tr;
};

export const useNotification = (options: UseAlarmsOptions = {}) => {
  const {
    deviceId,
    pageSize = 10,
    autoRefresh = false,
    refreshInterval = 30000,
    acknowledgedFilter = "all"
  } = options;

  const [alarms, setAlarms] = useState<TransformedAlarm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Tüm alarmları saklayacak state
  const [allAlarms, setAllAlarms] = useState<TransformedAlarm[]>([]);

  const fetchAlarms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Backend'den büyük bir pageSize ile tüm veriyi çek
      const response = await getAllAlarms(0, 1000, false); // 1000 kayıt çek
    
      
      let alarmsData = response.data || [];
      
      // Eğer deviceId belirtilmişse, sadece o cihazın alarmlarını filtrele
      if (deviceId) {
        alarmsData = alarmsData.filter((alarm) => alarm.originator.id === deviceId);
      }

      const transformed = alarmsData.map((alarm) => {
        const alarmDate = new Date(alarm.startTs);
        const hours = alarmDate.getHours().toString().padStart(2, "0");
        const minutes = alarmDate.getMinutes().toString().padStart(2, "0");
        const dateStr = `${alarmDate.getDate().toString().padStart(2, "0")}.${(alarmDate.getMonth() + 1).toString().padStart(2, "0")}.${alarmDate.getFullYear()}`;
      
        const machineType = alarm.details?.Type || "";
        const seriNo = alarm.details?.SeriNo || "";
        const alarmTypeId = alarm.details?.id || "";
        const deviceIdFromAlarm = alarm.originator.id;
        const severity = alarm?.severity;

        // DeviceAttributes'tan device name al
        const attributes = deviceAttributes.getAttributesById(deviceIdFromAlarm);
        const deviceName = attributes?.find((attr: any) => attr.key === "deviceName")?.value;

        return {
          id: alarm.id.id,
          name: deviceId ? `${hours}:${minutes} ${dateStr}` : `${hours}:${minutes}\n${dateStr}`,
          seriNo: `${deviceName}`,
          rawSeriNo: seriNo,
          alarmTypeId,
          machineType,
          deviceId: deviceIdFromAlarm,
          acknowledged: alarm.acknowledged,
          severity: severity,
          timestamp: alarm.startTs,
          dateTime: `${hours}:${minutes} ${dateStr}`,
          message: getNotificationMessage(alarmTypeId, i18n.language),
          details: alarm.details
        };
      });

      console.log("✅ Transformed alarms:", transformed);
      
      // Tüm alarmları sakla
      setAllAlarms(transformed);
      
      // İlk sayfa için filtrele ve ayarla
      applyFilterAndPagination(transformed, 0);
      
    } catch (err) {
      setError("Alarmlar yüklenirken hata oluştu");
      setAllAlarms([]);
      setAlarms([]);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, deviceId]);

  // Filtreleme ve pagination uygula
  const applyFilterAndPagination = useCallback((data: TransformedAlarm[], page: number) => {
    // FRONTEND FILTRELEME: acknowledged durumuna göre filtrele
    let filteredData = [...data];
    
    if (acknowledgedFilter === "acknowledged") {
      filteredData = filteredData.filter((alarm) => alarm.acknowledged === true);
    } else if (acknowledgedFilter === "unacknowledged") {
      filteredData = filteredData.filter((alarm) => alarm.acknowledged === false);
    }


    // Pagination bilgilerini güncelle
    const totalFiltered = filteredData.length;
    const totalPagesCalculated = Math.ceil(totalFiltered / pageSize);
    
    setTotalElements(totalFiltered);
    setTotalPages(totalPagesCalculated);

    // Mevcut sayfa için veriyi al
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    setAlarms(paginatedData);
  }, [acknowledgedFilter, pageSize]);

  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    applyFilterAndPagination(allAlarms, page);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      applyFilterAndPagination(allAlarms, newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      applyFilterAndPagination(allAlarms, newPage);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  // Filter değiştiğinde sayfa 0'a dön ve yeniden filtrele
  useEffect(() => {
    setCurrentPage(0);
    applyFilterAndPagination(allAlarms, 0);
  }, [acknowledgedFilter, applyFilterAndPagination, allAlarms]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAlarms();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchAlarms]);

  // Alarm durumunu güncelleme (frontend)
  const updateAlarmAcknowledgement = (alarmId: string) => {
    setAlarms(prevAlarms => 
      prevAlarms.map(alarm => 
        alarm.id === alarmId 
          ? { ...alarm, acknowledged: true }
          : alarm
      )
    );
  };

  // Alarmı listeden kaldırma (filtreleme için)
  const removeAlarmFromList = (alarmId: string) => {
    setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== alarmId));
    // Toplam element sayısını da azalt
    setTotalElements(prev => Math.max(0, prev - 1));
  };

  // Onaylanmamış alarmları al
  const getUnacknowledgedAlarms = () => {
    return allAlarms.filter(alarm => !alarm.acknowledged);
  };

  return {
    alarms,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalElements,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
    refetch: fetchAlarms,
    updateAlarmAcknowledgement,
    removeAlarmFromList,
    getUnacknowledgedAlarms,
    allAlarms
  };
};