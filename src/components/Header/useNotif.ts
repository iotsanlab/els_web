import { useState, useEffect } from 'react';
import { getUserId, getTimerSetting } from '../../services/auth';
import { getAllActiveAlarms, getAllAlarms } from '../../services/alarms';
import { alarms } from '../../services/endpoints';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timerInterval, setTimerInterval] = useState(5); // 5 saniye varsayılan

  // Timer ayarını al
  useEffect(() => {
    const fetchTimerSetting = async () => {
      try {
        const userID = await getUserId();
        const timer = await getTimerSetting(userID);
        if (timer) setTimerInterval(timer);
      } catch (error) {
        console.error("Timer ayarı alınırken hata:", error);
      }
    };
    fetchTimerSetting();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const [notificationsData, countData] = await Promise.all([
        getAllActiveAlarms(), 
        "0"
      ]);

      const notifications = await getAllAlarms(0, 5000);

      const disableAckAlarms = notifications?.data.filter((alarm) => alarm.acknowledged === false);
      
      setNotifications(disableAckAlarms);
      setActiveCount(disableAckAlarms.length);
    } catch (error) {
      console.error("Bildirimler alınırken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Periyodik güncelleme
  useEffect(() => {
    const interval = setInterval(fetchNotifications, timerInterval * 1222000);
    return () => clearInterval(interval);
  }, [timerInterval]);

  return {
    notifications,
    activeCount,
    isLoading,
    refetch: fetchNotifications
  };
};