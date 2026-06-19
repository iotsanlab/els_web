import React from 'react';

const styles: Record<string, React.CSSProperties> = {
  // Genel konteyner stilleri
  viewer: {
    width: '100%',
    height: '100vh',
    fontFamily: 'Roboto, sans-serif',
  },
  page: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Roboto, sans-serif',
  },

  // Tablo stilleri
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    border: '1px solid #ddd',
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
    borderRight: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modCol: {
    width: 80, // Mod sütunu için daha geniş
  },
  headerCell: {
    backgroundColor: '#eae9f2',
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
    backgroundColor: '#B9C2CA',
  },
  eco: {
    backgroundColor: '#0A8AD8',
  },
  power: {
    backgroundColor: '#FFA600',
  },
  powerPlus: {
    backgroundColor: '#E84747',
  },
  standart: {},
  fuelTotal: {},
  fuelAvg: {},
};

export default styles;