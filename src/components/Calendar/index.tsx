import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Calendar stilini import edin
import { useTranslation } from 'react-i18next';

interface CalendarComponentProps {
  onClose: () => void;          // Takvimi kapama fonksiyonu
  onDateSelect: (startDate: Date, endDate: Date) => void; // Tarih aralığı seçildiğinde çağrılacak fonksiyon
}

function CalendarComponent({ onClose, onDateSelect }: CalendarComponentProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);  // Başlangıç ve bitiş tarihi
  const today = new Date(); // Bugünün tarihi
  const { t, i18n } = useTranslation();

  const handleDateChange = (newDate: Date | Date[]) => {
    if (Array.isArray(newDate)) {
      // Tarih aralığı seçildiğinde
      setDateRange(newDate as [Date | null, Date | null]);
      // Aralığı üst bileşene gönderiyoruz
      if (newDate[0] && newDate[1]) {
        onDateSelect(newDate[0], newDate[1]);
        onClose();  // Tarih seçimi tamamlandığında takvimi kapat
      }
    }
  };

  // Sadece bugün ve önceki tarihleri seçilebilir yapma
  const tileDisabled = ({ date }: { date: Date }) => {
    return date > today;
  };

  return (
    <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg dark:bg-gray9 ">
      <Calendar
        onChange={handleDateChange}  // Tarih değiştiğinde handleDateChange çağrılacak
        value={dateRange}            // Takvimdeki aktif tarih aralığı
        selectRange={true}           // Aralık seçimini aktif ediyoruz
        tileDisabled={tileDisabled}  // Gelecek tarihleri devre dışı bırak
        maxDate={today}              // Maksimum seçilebilir tarih bugün
        locale={i18n.language}       // Dile göre tarih isimlendirmesi
      />
    </div>
  );
}

export default CalendarComponent;
