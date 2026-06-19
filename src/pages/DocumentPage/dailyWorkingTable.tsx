import React from "react";
import styles from "./dailystyle";
import { useTranslation } from "react-i18next";

export interface TableRow {
  mode: string;
  values: (string | number)[];
  styleKey: string;
}

interface DailyWorkingTableProps {
  hours?: string[] | number[];
  rows: TableRow[];
}

// Geçerli stil anahtarlarını kontrol etmek için yardımcı fonksiyon
const getStyleByKey = (stylesObj: Record<string, React.CSSProperties>, key: string): React.CSSProperties => {
  const validKeys = ['rolanti', 'eco', 'power', 'powerPlus', 'fuelTotal', 'fuelAvg', 'standart'];
  return validKeys.includes(key) ? stylesObj[key] || {} : {};
};

/**
 * Dinamik çalışma saatleri tablosu component'i
 */
const DailyWorkingTable = ({
  hours = Array.from({ length: 24 }, (_, i) => i + 1),
  rows = []
}: DailyWorkingTableProps) => {
  const { t } = useTranslation();
  return (
    <div style={styles.table}>
      {/* Saat Başlık Satırı */}
      <div style={styles.tableRow}>
        {/* Mod başlık hücresi */}
        <div style={{ ...styles.tableCol, ...styles.modCol, ...styles.headerCell }}>
          <span style={styles.tableHeaderText}>{t("documentPage.date")}</span>
        </div>

        {/* Saat başlıkları */}
        {hours.map((hour, index) => (
          <div key={`hour-${index}`} style={{ ...styles.tableCol, ...styles.headerCell }}>
            <span style={styles.tableHeaderText}>{hour}</span>
          </div>
        ))}
      </div>

      {/* Mod Veri Satırları */}
      {rows.map((row) => (
        <div key={`mode-${row.mode}`} style={styles.tableRow}>
          {/* Mod başlığı */}
          <div style={{ ...styles.tableCol, ...styles.modCol, ...getStyleByKey(styles, row.styleKey) }}>
            <span style={styles.tableCellText}>{row.mode}</span>
          </div>

          {/* Her saat için veri hücreleri */}
          {row.values.map((value, hourIndex) => (
            <div
              key={`${row.mode}-${hourIndex}`}
              style={{
                ...styles.tableCol,
                ...getStyleByKey(styles, row.styleKey),
              }}
            >
              <span style={styles.tableCellText}>{value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DailyWorkingTable;