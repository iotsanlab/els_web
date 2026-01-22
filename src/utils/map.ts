export interface ServiceLocation {
    id: string;
    type: string;
    name: string;
    latitude: number;
    longitude: number;
    hours: number;
    contact: string;
    maintenance: string;
    operator: string;
    visible: boolean;
    serviceId?: number;
    state?: boolean;
}

export const MAP_IDS = [
    "bf51a910020fa25a",
    "49ae42fed52588c3",
    "3fec513989decfcd",
    "7a9e2ebecd32a903",
];

// Şekil bilgilerini saklamak için arayüz
export interface ShapeInfo {
    id: string;
    name: string;
    color: string;
    shape:
      | google.maps.Polygon
      | google.maps.Polyline
      | google.maps.Rectangle
      | google.maps.Circle
      | google.maps.Marker;
    visible: boolean;
    type: string; // polygon, polyline, circle, rectangle, marker
  assignedMachineSerials?: string[]; // ID yerine seri numaraları
 }

export interface MapInfoMenu {
    serialNo?: string;
    title?: string;
    totalHours?: number;
    operator?: string;
    lock?: boolean;
    avgFuel?: number;
    instantFuel?: number;
    trip?: string;
    defAmount?: string;
    hydraulicPressure?: string;
    hydOilHeat?: string;
    engineWaterHeat?: string;
    warnings?: any[];
    type?: string;
    saseNo?: string;
    id?:string;
    parameters?: any;
    deviceName?: string;
  }

  export interface MapServiceInfo {
    title: string;
    address: string;
    operatorName: string;
    phoneNumber: string;
    email: string;
    website?: string;
  }