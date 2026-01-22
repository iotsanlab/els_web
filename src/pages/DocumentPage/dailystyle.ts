import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // Genel konteyner stilleri
  viewer: {
    width: '100%',
    height: '100vh',
    fontFamily: 'Roboto',
  },
  page: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Roboto',
  },
  
  // Tablo stilleri
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCol: {
    width: '100%',
    minWidth: 50,
    height: 20,
    padding: 2,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modCol: {
    width: 80, // Mod sütunu için daha geniş
  },
  headerCell: {
    backgroundColor: '#f2f2f2',
  },
  
  // Metin stilleri
  tableHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 9,
    textAlign: 'left',
  },
  
  // Mod renk stilleri (stil anahtarlarıyla eşleşir)
  rolanti: {
    backgroundColor: '#B9C2CA', // Açık sarı
  },
  eco: {
    backgroundColor: '#0A8AD8', // Parlak sarı
  },
  power: {
    backgroundColor: '#FFA600', // Açık mavi
  },
  powerPlus: {
    backgroundColor: '#E84747', // Açık yeşil
  }
});

export default styles;