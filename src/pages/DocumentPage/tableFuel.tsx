import { View, Text } from "@react-pdf/renderer";
import styles from "./style";

interface Column {
  key: string;
  header: string;
  style?: any;
}

interface Row {
  [key: string]: string | number;
}

interface PDFTableProps {
  columns: Column[];
  rows: Row[];
  headerStyle?: any;
  cellStyle?: any;
  colorScheme?: {
    [key: string]: any;
  };
}

const PDFTableFuel = ({
  columns = [
    { key: "machineName", header: "Makine Adı" },
    { key: "serialNumber", header: "Seri No" },
    { key: "class", header: "Sınıf" },
    { key: "model", header: "Model" },
    { key: "totalFuel", header: "Toplam Yakıt (L)", style: styles.fuelTotal },
    { key: "avgFuel", header: "Ortalama (L/sa)", style: styles.fuelAvg },
  ],
  rows = [
    {
      machineName: "M220CEC100240",
      serialNumber: "M220CEC100240",
      class: "Excavator",
      model: "M220LC",
      totalFuel: "128.5",
      avgFuel: "12.3",
    },
  ],
  headerStyle = styles.tableHeader,
  cellStyle = styles.tableCell,
  colorScheme = {},
}: PDFTableProps) => {
  return (
    <View style={styles.table}>
      {/* Tablo Başlık */}
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        {columns.map((column, index) => (
          <View
            key={index}
            style={[
              styles.tableCol,
              headerStyle,
              column.style,
              colorScheme[column.key],
            ]}
          >
            <Text style={styles.tableHeaderText}>{column.header}</Text>
          </View>
        ))}
      </View>

      {/* Tablo Satırları */}
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {columns.map((column, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.tableCol,
                cellStyle,
                column.style,
                colorScheme[column.key],
              ]}
            >
              <Text style={styles.tableCell}>
                {row[column.key] !== undefined ? row[column.key] : "-"}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PDFTableFuel;
