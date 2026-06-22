import { useEffect, useState, type ComponentProps } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // Calendar stilini import edin
import { useTranslation } from 'react-i18next';

interface CalendarComponentProps {
  onClose: () => void;          // Takvimi kapama fonksiyonu
  onDateSelect: (startDate: Date, endDate: Date) => void; // Tarih aralığı seçildiğinde çağrılacak fonksiyon
  value?: [Date | null, Date | null];
}

function CalendarComponent({ onClose, onDateSelect, value }: CalendarComponentProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);  // Başlangıç ve bitiş tarihi
  const today = new Date(); // Bugünün tarihi
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (!value) return;
    setDateRange(value);
  }, [value]);

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  // Pazartesi başlangıçlı hafta (TR için yaygın)
  const startOfWeek = (d: Date) => {
    const day = d.getDay(); // 0: Pazar, 1: Pazartesi, ...
    const diff = (day + 6) % 7; // Pazartesiye göre kaç gün geri gideceğiz
    const res = new Date(d);
    res.setDate(d.getDate() - diff);
    return startOfDay(res);
  };

  const addDays = (d: Date, days: number) => {
    const res = new Date(d);
    res.setDate(d.getDate() + days);
    return res;
  };


  const applyRange = (start: Date, end: Date) => {
    const startD = startOfDay(start);
    const endD = endOfDay(end);
    setDateRange([startD, endD]);
    onDateSelect(startD, endD);
    onClose();
  };

  type CalendarOnChange = NonNullable<ComponentProps<typeof Calendar>['onChange']>;

  const handleDateChange: CalendarOnChange = (newDate) => {
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

  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

  const dateButton = (date: Date) => [{
    label: t("global.lastWeek"),
    onClick: () => applyRange(addDays(date, -6), date),
  },
  {
    label: t("global.lastMonth"),
    onClick: () => applyRange(addDays(date, -29), date),
  },
  {
    label: t("global.thisWeek"),
    onClick: () => applyRange(startOfWeek(date), date),
  },
  {
    label: t("global.thisMonth"),
    onClick: () => applyRange(startOfMonth(date), date),
  },
  {
    label: t("global.previousWeek"),
    onClick: () => {
      const prevWeekEnd = addDays(startOfWeek(date), -1);
      const prevWeekStart = addDays(prevWeekEnd, -6);
      applyRange(prevWeekStart, prevWeekEnd);
    },
  },
  {
    label: t("global.previousMonth"),
    onClick: () => {
      const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0); // last day of previous month
      const prevMonthStart = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      applyRange(prevMonthStart, prevMonthEnd);
    },
  },
  ]

  return (
    <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg dark:bg-gray9 ">
      <div className="mb-3 flex flex-wrap gap-2">

        {dateButton(today).map((button: { label: string; onClick: () => void }) => (
          <button
            type="button"
            className="rounded-[10px] bg-white dark:bg-gray9 px-3 py-1 font-inter text-[12px] font-bold text-gray10 dark:text-white shadow-xs hover:bg-mstYellow dark:hover:bg-mstYellow hover:text-white"
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
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
