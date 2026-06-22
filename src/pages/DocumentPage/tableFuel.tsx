import React from "react";
import styles from "./style";

interface Column {
  key: string;
  header: string;
  style?: React.CSSProperties;
}

interface Row {
  [key: string]: string | number;
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

const PDFTableFuel = ({
  columns = [
    { key: "machineName", header: "Makine Adı" },
    { key: "serialNumber", header: "Seri No" },
    { key: "class", header: "Sınıf" },
    { key: "model", header: "Model" },
    { key: "totalFuel", header: "Toplam Enerji (kWh)" },
    { key: "avgFuel", header: "Ortalama (kWh/sa.)" },
  ],
  rows = [
    {
      machineName: "M220CEC100240",
      serialNumber: "M220CEC100240",
      class: "Lift",
      model: "M220LC",
      totalFuel: "128.5",
      avgFuel: "12.3",
    },
  ],
  headerStyle = styles.tableHeader,
  cellStyle = styles.tableCell,
  colorScheme = {},
  footer = [],
}: PDFTableProps) => {
  // Footer hücresi için colspan'e göre stil hesapla
  const getColspanStyle = (startColIndex: number, colspan: number): React.CSSProperties => {
    const spannedColumns = columns.slice(startColIndex, startColIndex + colspan);

    let totalFixedWidth = 0;
    let flexCount = 0;

    spannedColumns.forEach((col) => {
      if (col.style?.width) {
        totalFixedWidth += (col.style.width as number) + 45;
      } else {
        flexCount++;
      }
    });

    if (flexCount === 0) {
      return { width: totalFixedWidth, flexGrow: 0, flexBasis: totalFixedWidth };
    }

    if (totalFixedWidth === 0) {
      return { flexGrow: colspan, flexBasis: 0 };
    }

    return { flexGrow: flexCount, flexBasis: totalFixedWidth };
  };

  return (
    <div style={styles.table}>
      {/* Tablo Başlık */}
      <div style={{ ...styles.tableRow }}>
        {columns.map((column, index) => (
          <div
            key={index}
            style={{
              ...styles.tableCol,
              ...headerStyle,
              ...column.style,
              ...(colorScheme[column.key] || {}),
            }}
          >
            <span style={styles.tableHeaderText}>{column.header}</span>
          </div>
        ))}
      </div>

      {/* Tablo Satırları */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={styles.tableRow}>
          {columns.map((column, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                ...styles.tableCol,
                ...cellStyle,
                ...column.style,
                ...(colorScheme[column.key] || {}),
              }}
            >
              <span style={styles.tableCell}>
                {row[column.key] !== undefined ? row[column.key] : "-"}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* Tablo Footer Satırları (tfoot) */}
      {footer.length > 0 &&
        footer.map((footerRow, footerRowIndex) => {
          let colIndex = 0;
          return (
            <div
              key={`footer-${footerRowIndex}`}
              style={{
                ...styles.tableRow,
                backgroundColor: "#eae9f2",
              }}
            >
              {footerRow.map((cell, cellIndex) => {
                const colspan = cell.colspan || 1;
                const colspanStyle = getColspanStyle(colIndex, colspan);
                colIndex += colspan;
                return (
                  <div
                    key={`footer-${footerRowIndex}-${cellIndex}`}
                    style={{ ...styles.tableCol, ...colspanStyle, ...cell.style }}
                  >
                    <span style={{ ...styles.tableCell, fontWeight: "bold" }}>
                      {cell.value}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default PDFTableFuel;
