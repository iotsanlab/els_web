import { View, Text } from "@react-pdf/renderer"
import styles from "./style"

interface Column {
  key: string;
  header: string;
  style?: React.CSSProperties;
}

interface Row {
  [key: string]: string;
}

interface PDFTableProps {
  columns: Column[];
  rows: Row[];
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  colorScheme?: {
    [key: string]: React.CSSProperties;
  };
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
  colorScheme = {}
}: PDFTableProps) => {
    return (
        <View style={styles.table}>
        {/* Tablo Başlık Satırı */}
        <View style={styles.tableRow}>
            {columns.map((column, index) => (
                <View 
                    key={index} 
                    style={[
                        styles.tableCol, 
                        headerStyle, 
                        column.style, 
                        colorScheme[column.key]
                    ]}
                >
                    <Text style={styles.tableHeaderText}>{column.header}</Text>
                </View>
            ))}
        </View>
        {/* Tablo Veri Satırları */}
        {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
                {columns.map((column, colIndex) => (
                    <View 
                        key={`${rowIndex}-${colIndex}`} 
                        style={[
                            styles.tableNoColBorder,

                            column.style, 
                            colorScheme[column.key]
                        ]}
                    >
                        <Text style={styles.tableCell}>{row[column.key] || ''}</Text>
                    </View>
                ))}
            </View>
        ))}
    </View>
    )
}

export default PDFTable;
