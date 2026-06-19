import React from "react";
import styles from "./style";

interface Column {
  key: string;
  header: string;
  style?: React.CSSProperties;
}

interface Row {
  [key: string]: string;
}

interface FooterCell {
  value: string;
  colspan?: number;
  style?: React.CSSProperties;
}

interface PDFTableProps {
  columns: Column[];
  rows: Row[];
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  colorScheme?: {
    [key: string]: React.CSSProperties;
  };
  footer?: FooterCell[][];
}

const PDFTable = ({
  columns = [
    { key: 'machineName', header: 'Makine Adı' },
    { key: 'serialNumber', header: 'Seri Numarası' },
    { key: 'class', header: 'Sınıf' },
    { key: 'model', header: 'Model' },
    { key: 'totalWorkHours', header: 'Toplam Çalışma Saati' },
    { key: 'idleTime', header: 'Rölanti', style: styles.rolanti },
    { key: 'ecoTime', header: 'Eco', style: styles.eco },
    { key: 'powerTime', header: 'Power', style: styles.power },
    { key: 'powerPlusTime', header: 'Power +', style: styles.powerPlus }
  ],
  rows = [
    {
      machineName: 'M220CEC100240',
      serialNumber: 'M220CEC100240',
      class: 'Excavator',
      model: 'M220LC',
      totalWorkHours: '6 sa 5 dak',
      idleTime: '1 sa 24 dak',
      ecoTime: '2 sa 35 dak',
      powerTime: '1 sa 33 dak',
      powerPlusTime: '0 sa 33 dak'
    }
  ],
  headerStyle = styles.tableHeader,
  cellStyle = styles.tableCell,
  colorScheme = {},
  footer = []
}: PDFTableProps) => {
  const totalColumns = columns.length;

  return (
    <div style={styles.table}>
      {/* Tablo Başlık Satırı */}
      <div style={styles.tableRow}>
        {columns.map((column, index) => (
          <div
            key={index}
            style={{
              ...styles.tableCol,
              ...headerStyle,
              ...column.style,
              ...colorScheme[column.key],
            }}
          >
            <span style={styles.tableHeaderText}>{column.header}</span>
          </div>
        ))}
      </div>
      {/* Tablo Veri Satırları */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={styles.tableRow}>
          {columns.map((column, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                ...styles.tableNoColBorder,
                ...column.style,
                ...colorScheme[column.key],
              }}
            >
              <span style={styles.tableCell}>{row[column.key] || ''}</span>
            </div>
          ))}
        </div>
      ))}
      {/* Tablo Footer Satırları (tfoot) */}
      {footer.length > 0 && footer.map((footerRow, footerRowIndex) => (
        <div key={`footer-${footerRowIndex}`} style={{ ...styles.tableRow, borderTop: '1px solid #000' }}>
          {footerRow.map((cell, cellIndex) => {
            const colspan = cell.colspan || 1;
            const widthPercent = `${(colspan / totalColumns) * 100}%`;
            return (
              <div
                key={`footer-${footerRowIndex}-${cellIndex}`}
                style={{
                  ...styles.tableNoColBorder,
                  flexBasis: widthPercent,
                  flexGrow: 0,
                  ...cell.style,
                }}
              >
                <span style={{ ...styles.tableCell, fontWeight: 'bold' }}>{cell.value}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default PDFTable;
