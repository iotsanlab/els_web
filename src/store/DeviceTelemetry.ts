import { makeAutoObservable } from "mobx";
import deviceAttributes from "./DeviceAttributes";
import cityData from "../data/CityData";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import illerGeoJson from '../data/iller.json';


type Telemetry = { ts: number; value: number };
type ActiveWarning = {
  key: string;
  values: Telemetry[];
};

type TelemetryData = Record<string, Telemetry[]>;



function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Mesafe (km)
}


function findNearestCity(lat: number, lon: number): string {
  let nearestCity = 'Bilinmeyen Konum';
  let minDistance = Infinity;

  for (const city of cityData.cities as City[]) {
    const distance = calculateDistance(lat, lon, city.latitude, city.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city.name;
    }
  }

  return nearestCity;
}

export function findCityByCoordinates(lat: number, lon: number): string {
  // Validate that lat and lon are valid numbers
  if (!isFinite(lat) || !isFinite(lon) || lat === null || lon === null) {
    return "Bilinmeyen Konum";
  }

  const pt = point([lon, lat]);

  for (const feature of illerGeoJson.features) {
    if (booleanPointInPolygon(pt, feature as any)) {
      return feature.properties.name; // İstanbul, Ankara vb.
    }
  }

  return "Bilinmeyen Konum";
}

class DeviceWorkStore {
  telemetryMap: Map<string, { type: string; subtype: string; telemetry: TelemetryData }> = new Map();



  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  setTelemetry(deviceId: string, telemetryKey: keyof TelemetryData, data: { ts: number; value: string }[]) {
    const parsed = data.map(item => ({
      ts: item.ts,
      value: parseFloat(item.value),
    }));

    const attributes = deviceAttributes.getAttributesById(deviceId);
    const type: string = attributes?.find((detail: any) => detail.key === "Type")?.value || "Unknown";
    const subtype: string = attributes?.find((detail: any) => detail.key === "Subtype")?.value || "Unknown";

    const existing = this.telemetryMap.get(deviceId);
    const updatedTelemetry = {
      ...existing?.telemetry,
      [telemetryKey]: parsed,
    };

    this.telemetryMap.set(deviceId, { type, subtype, telemetry: updatedTelemetry });
    this.saveToStorage();
  }

  getTelemetry(deviceId: string, telemetryKey: keyof TelemetryData): Telemetry[] {
    return this.telemetryMap.get(deviceId)?.telemetry?.[telemetryKey] || [];
  }

  getCity(deviceId: string): string {
    const lat = this.getTelemetry(deviceId, "latitude").at(-1)?.value;
    const lon = this.getTelemetry(deviceId, "longitude").at(-1)?.value;

    if (lat === undefined || lon === undefined || !isFinite(lat) || !isFinite(lon)) {
      return "Bilinmeyen Konum";
    }

    return findCityByCoordinates(lat, lon);
  }

  getTotalOf(deviceId: string, telemetryKey: keyof TelemetryData): number {
    return this.getTelemetry(deviceId, telemetryKey).reduce((sum, item) => sum + item.value, 0);
  }

  getDailySummary(
    telemetryKey: keyof TelemetryData,
    dayCount: number,
    allowedSubtypes: string[] = []
  ): number {
    const now = Date.now();
    const fromTime = now - dayCount * 24 * 60 * 60 * 1000;

    return Array.from(this.telemetryMap.values())
      .filter(device => allowedSubtypes.length === 0 || allowedSubtypes.includes(device.subtype))
      .reduce((sum, device) => {
        const telemetry = device.telemetry[telemetryKey] || [];
        return (
          sum +
          telemetry
            .filter(entry => entry.ts >= fromTime)
            .reduce((acc, entry) => acc + entry.value, 0)
        );
      }, 0);
  }


getDailyFormatted(
  telemetryKey: keyof TelemetryData,
  dayCount: number,
  allowedSubtypes: string[] = []
): FormattedData[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // sadece gün bazlı çalışacağımız için saatleri sıfırla
  const dummyMap: Map<string, FormattedData> = new Map();

  // Dummy 7 günlük veri üret
  for (let i = dayCount - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    dummyMap.set(dateStr, {
      value: 0,
      dayName: date.toLocaleDateString("tr-TR", { weekday: "short" }).toLowerCase(),
      dayNum: date.getDate(),
      date: dateStr,
    });
  }

  // Gerçek verilerle dummy'yi güncelle
  Array.from(this.telemetryMap.values())
    .filter(device => allowedSubtypes.length === 0 || allowedSubtypes.includes(device.subtype))
    .forEach(device => {
      const telemetry = device.telemetry[telemetryKey] || [];
      telemetry.forEach(({ ts, value }) => {
        const date = new Date(ts);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString().slice(0, 10);
        if (dummyMap.has(dateStr)) {
          dummyMap.get(dateStr)!.value += value;
        }
      });
    });

  // Liste halinde döndür ve sıralı olsun
  return Array.from(dummyMap.values()).sort(
    (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime()
  );
}



  getSummaryBetweenDates(
    telemetryKey: keyof TelemetryData,
    from: number,
    to: number,
    allowedSubtypes: string[] = []
  ): number {
    return Array.from(this.telemetryMap.values())
      .filter(device => allowedSubtypes.length === 0 || allowedSubtypes.includes(device.subtype))
      .reduce((sum, device) => {
        const telemetry = device.telemetry[telemetryKey] || [];
        return (
          sum +
          telemetry
            .filter(entry => entry.ts >= from && entry.ts < to)
            .reduce((acc, entry) => acc + entry.value, 0)
        );
      }, 0);
  }

 getActiveWarningKeys = (deviceId: string): ActiveWarning[] => {
  const telemetry = deviceWorkStore.telemetryMap.get(deviceId)?.telemetry;
  if (!telemetry) return [];

  return Object.entries(telemetry)
    .filter(([key, values]) =>
      (key.includes("SPN") || key.includes("FMI")) &&
      Array.isArray(values)
    )
    .map(([key, values]) => {
      const cleanValues = values.filter(v => v.value > 0);

      return {
        key,
        values: cleanValues,
      };
    })
    .filter(item => item.values.length > 0); // sadece değer içerenleri al
};


  get all(): { id: string; type: string; subtype: string; telemetry: TelemetryData }[] {
    return Array.from(this.telemetryMap.entries()).map(([id, value]) => ({
      id,
      type: value.type,
      subtype: value.subtype,
      telemetry: value.telemetry,
    }));
  }

  clear() {
    this.telemetryMap.clear();
    localStorage.removeItem('deviceTelemetry');
  }

  private saveToStorage() {
    try {
      const data = Array.from(this.telemetryMap.entries());
      localStorage.setItem('deviceTelemetry', JSON.stringify(data));
    } catch (error) {
      console.warn('DeviceTelemetry localStorage save failed:', error);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('deviceTelemetry');
      if (stored) {
        const data = JSON.parse(stored) as [string, { type: string; subtype?: string; telemetry: TelemetryData }][];
        // Eski veri formatını desteklemek için subtype yoksa boş string ata
        const migratedData = data.map(([id, value]) => [id, { ...value, subtype: value.subtype || '' }] as [string, { type: string; subtype: string; telemetry: TelemetryData }]);
        this.telemetryMap = new Map(migratedData);
      }
    } catch (error) {
      console.warn('DeviceTelemetry localStorage load failed:', error);
      this.telemetryMap = new Map();
    }
  }
}



const deviceWorkStore = new DeviceWorkStore();
export default deviceWorkStore;
