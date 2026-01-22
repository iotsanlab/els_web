import { makeAutoObservable } from "mobx";

export type TelemetryEntry = {
  ts: number;
  value: number;
};

export type TelemetryData = Record<string, TelemetryEntry[]>;

type DeviceWarning = {
  id: string;
  type: string;
  telemetry: TelemetryData;
};

class DeviceWarningStore {
  telemetryMap = new Map<string, DeviceWarning>();

  constructor() {
    makeAutoObservable(this);
  }

  setTelemetry(
    deviceId: string,
    type: string,
    telemetryKey: string,
    rawData: { ts: number; value: string | number | null }[]
  ) {
    if (!rawData || rawData.length === 0) return;

    const parsed = rawData
      .map(item => ({
        ts: item.ts,
        value: parseFloat(item.value as string),
      }))
      .filter(item => !isNaN(item.value)); // sadece sayısal değerleri al

    const existing = this.telemetryMap.get(deviceId);
    const existingTelemetry = existing?.telemetry || {};

    const updatedTelemetry = {
      ...existingTelemetry,
      [telemetryKey]: parsed,
    };

    this.telemetryMap.set(deviceId, {
      id: deviceId,
      type,
      telemetry: updatedTelemetry,
    });
  }

  get filteredWarnings(): Record<string, TelemetryData> {
  const result: Record<string, TelemetryData> = {};
  this.telemetryMap.forEach((data, id) => {
    const filtered: TelemetryData = {};
    for (const [key, entries] of Object.entries(data.telemetry)) {
      const valid = entries.filter(e => e.value !== null && e.value >= 0);
      if (valid.length > 0) {
        filtered[key] = valid;
      }
    }
    if (Object.keys(filtered).length > 0) {
      result[id] = filtered;
    }
  });
  return result;
}

get warningCountsByDevice(): Record<string, number> {
  const result: Record<string, number> = {};
  this.telemetryMap.forEach((data, id) => {
    let count = 0;

    const pairKeys = [
      ['SPN1Eng', 'FMI1Eng'], ['SPN2Eng', 'FMI2Eng'], ['SPN3Eng', 'FMI3Eng'], ['SPN4Eng', 'FMI4Eng'],
      ['SPN1Gear', 'FMI1Gear'], ['SPN2Gear', 'FMI2Gear'], ['SPN3Gear', 'FMI3Gear'], ['SPN4Gear', 'FMI4Gear'],
      ['SPN1', 'FMI1'], ['SPN2', 'FMI2'], ['SPN3', 'FMI3'], ['SPN4', 'FMI4'],
    ];

    for (const [spnKey, fmiKey] of pairKeys) {
      const spnVals = data.telemetry[spnKey] || [];
      const fmiVals = data.telemetry[fmiKey] || [];
      const minLen = Math.min(spnVals.length, fmiVals.length);

      for (let i = 0; i < minLen; i++) {
        const spnVal = spnVals[i].value;
        const fmiVal = fmiVals[i].value;
        if (spnVal === 0 && fmiVal === 0) continue;
        count++;
      }
    }

    if (count > 0) {
      result[id] = count;
    }
  });

  return result;
}


  get all(): DeviceWarning[] {
    return Array.from(this.telemetryMap.values());
  }

  getByDeviceId(id: string): DeviceWarning | undefined {
    return this.telemetryMap.get(id);
  }

  clear() {
    this.telemetryMap.clear();
  }
}

const deviceWarningStore = new DeviceWarningStore();
export default deviceWarningStore;
