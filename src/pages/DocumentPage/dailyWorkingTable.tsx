import { View, Text } from "@react-pdf/renderer";
import styles from "./dailystyle";
import { useTranslation } from "react-i18next";

interface TableRow {
  mode: string;
  values: number[];
  styleKey: string;
}

interface DailyWorkingTableProps {
  hours?: string[] | number[];
  rows: TableRow[];
}

// Geçerli stil anahtarlarını kontrol etmek için yardımcı fonksiyon
const getStyleByKey = (styles: Record<string, any>, key: string) => {
  // Geçerli anahtarlar
  const validKeys = ['rolanti', 'eco', 'power', 'powerPlus', 'fuelTotal', 'fuelAvg'];
  
  // Eğer anahtar geçerliyse stili döndür, değilse boş stil objesi döndür
  return validKeys.includes(key) ? styles[key] || {} : {};
};

/**
 * Dinamik çalışma saatleri tablosu component'i
 * @param {DailyWorkingTableProps} props - Component özellikleri
 * @returns {JSX.Element} Tablo component'i
 */
const DailyWorkingTable = ({
  hours = Array.from({ length: 24 }, (_, i) => i + 1),
  rows = []
}: DailyWorkingTableProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.table}>
      {/* Saat Başlık Satırı */}
      <View style={styles.tableRow}>
        {/* Mod başlık hücresi */}
        <View style={[styles.tableCol, styles.modCol, styles.headerCell]}>
          <Text style={styles.tableHeaderText}>{t("documentPage.date")}</Text>
        </View>
        
        {/* Saat başlıkları */}
        {hours.map((hour, index) => (
          <View key={`hour-${index}`} style={[styles.tableCol, styles.headerCell]}>
            <Text style={styles.tableHeaderText}>{hour}</Text>
          </View>
        ))}
      </View>

      {/* Mod Veri Satırları */}
      {rows.map((row) => (
        <View key={`mode-${row.mode}`} style={styles.tableRow}>
          {/* Mod başlığı */}
          <View style={[styles.tableCol, styles.modCol, getStyleByKey(styles, row.styleKey)]}>
            <Text style={styles.tableCellText}>{row.mode}</Text>
          </View>
          
          {/* Her saat için veri hücreleri */}
          {row.values.map((value, hourIndex) => (
            <View 
              key={`${row.mode}-${hourIndex}`} 
              style={[
                styles.tableCol, 
                getStyleByKey(styles, row.styleKey)
              ]}
            >
              <Text style={styles.tableCellText}>{value}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default DailyWorkingTable;