import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    viewer: {
        width: '100%',
        height: '100vh',
        fontFamily: 'Roboto',
    },
    page: {
        backgroundColor: '#fff',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontFamily: 'Roboto',
    },
    header: {
        backgroundColor: "#005A9C",
        padding: 5,
    },
    content: {
        padding: 10,
    },
    title: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 10,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 0,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        alignItems: 'center',
    },
    tableRowLast: {
        borderBottomWidth: 0,
    },
    tableCol: {
        flexGrow: 1,
        flexBasis: 0,
        padding: 5,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderRightStyle: 'solid',
        fontSize: 10,
    },
    tableNoColBorder: {
        flexGrow: 1,
        flexBasis: 0,
        padding: 5,
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderRightStyle: 'solid',
        fontSize: 10,
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
    },
    tableHeaderText: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 9,
        textAlign: 'center',
    },
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
    modCol: {
        width: 120
    },
});

export default styles;