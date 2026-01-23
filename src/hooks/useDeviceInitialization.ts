// hooks/useDeviceInitialization.ts
import { useState, useEffect, useCallback } from 'react';
import { getDevices } from '../services/devices';
import { getValuesAttributes, getValuesTimeSeries } from '../services/telemetry';
import { getUserId } from '../services/auth';
import allDevices, { Device } from '../store/AllDevices';
import machineStore from '../store/MachineStore';
import deviceAttributes from '../store/DeviceAttributes';
import deviceWorkStore from '../store/DeviceTelemetry';
import deviceWarningStore from '../store/Warnings';
import ATTRIBUTE_KEYS from '../constants/attributeKeys';
import { getUserAssetId } from '../services/workingArea';
import { IAssetResponse } from '../models/assets';
import { userStore } from '../store/UserStore';

const BATCH_SIZE = 500;

const TELEMETRY_KEYS = {
  daily: ['DailyWorkingHours', 'DailyFuelCons', 'idleTime', 'ECOHOUR1Daily', 'STDHOUR1Daily', 'PWRHOUR1Daily', 'PWR_PLUSHOUR1Daily', 'DailyIdleHours', 'last30IdleHours', 'last60IdleHours', 'last14IdleHours', 'last7IdleHours', 'DailyEnergyConsumption', 'DailyPlatformHours','DailyGroundHours'],
  status: ['stat', 'latitude', 'longitude', 'FuelLevel', 'EngFuelRate', 'WorkingHours', 'EngTotalFuelUsed', 'UreaTankLevel', 'ADBlue', 'TotalEnergyConsumption'],
  warnings: ['src', 'spn', 'fmi', 'hrs', 'ts'],
};  

function getUtcDateRange() {
  const now = new Date();
  const startOfTodayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return {
    startDate: startOfTodayUTC - 30 * 24 * 60 * 60 * 1000,
    endDate: startOfTodayUTC + 24 * 60 * 60 * 1000 - 1,
  };
}

function formatDevices(data: any[]): Device[] {
  return data
    .filter((item) => item.label?.trim())
    .map((item) => ({
      createdTime: item.createdTime,
      name: item.name,
      type: item.type,
      label: item.label,
      entityType: item.id.entityType,
      id: item.id.id,
    }));
}

function createBatches<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

async function fetchDeviceTelemetry(device: Device, startDate: number, endDate: number) {
  const [daily, status] = await Promise.all([
    getValuesTimeSeries(device.entityType, device.id, TELEMETRY_KEYS.daily, startDate, endDate, true),
    getValuesTimeSeries(device.entityType, device.id, TELEMETRY_KEYS.status),
  ]);
  return { id: device.id, daily, status };
}

async function fetchDeviceAttributes(device: Device) {
  const details = await getValuesAttributes(device.entityType, device.id, ATTRIBUTE_KEYS);
  return { id: device.id, details };
}

function updateMachineStore(id: string, attrMap: Map<string, any>) {
  machineStore.setMachineData(id, {
    type: attrMap.get('Subtype') || 'Excavator',
    model: attrMap.get('Model') || '',
    subtype: attrMap.get('Subtype') || '',
    serialNo: attrMap.get('SeriNo') || '',
    user_fullname: attrMap.get('opName') || '',
    totalWorkingHours: Number(deviceWorkStore.getTelemetry(id, 'WorkingHours').at(-1)?.value) || 0,
    instantFuel: Number(deviceWorkStore.getTelemetry(id, 'EngFuelRate').at(-1)?.value) || 0,
    totalUsedFuel: Number(deviceWorkStore.getTelemetry(id, 'EngTotalFuelUsed').at(-1)?.value) || 0,
    state: deviceWorkStore.getTelemetry(id, 'stat')?.at(-1)?.value,
    deviceName: attrMap.get('deviceName') || '',
    isTelehandlerV2Image: attrMap.get('isTelehandlerV2Image') || false,
  });
}

function updateTelemetryStore(id: string, telemetryData: Record<string, any[]>) {
  Object.entries(telemetryData).forEach(([key, data]) => {
    if (Array.isArray(data)) {
      deviceWorkStore.setTelemetry(id, key, data);
    }
  });
}

function updateLocationData(id: string, status: any) {
  const latestLat = status.latitude?.at(-1)?.value;
  const latestLong = status.longitude?.at(-1)?.value;
  
  machineStore.setMachineData(id, {
    lat: latestLat != null ? parseFloat(latestLat) : 0,
    long: latestLong != null ? parseFloat(latestLong) : 0,
  });
}

export function useDeviceInitialization() {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchWarnings = useCallback(async (deviceList: Device[]) => {
    if (!deviceList.length) return;

    try {
      const results = await Promise.all(
        deviceList.map((device) =>
          getValuesTimeSeries(device.entityType, device.id, TELEMETRY_KEYS.warnings)
        )
      );

      // get Asset ID
      const response: IAssetResponse = await getUserAssetId();
      console.log(response, 'response test edelim');
      if (response) {
        const assetId = response?.data?.[0]?.id?.id;
        userStore.setAssetId(assetId);
      }

      results.forEach(({ id, type, telemetry }) => {
        Object.entries(telemetry || {}).forEach(([key, entries]) => {
          if (Array.isArray(entries)) {
            deviceWarningStore.setTelemetry(id, type, key, entries);
          }
        });
      });
    } catch (error) {
      console.error('Warning data fetch error:', error);
    }
  }, []);

  // Status ve daily verilerini yenileyen fonksiyon (her saniye çağrılabilir)
  const refreshTelemetry = useCallback(async (deviceList?: Device[]) => {
    const targetDevices = deviceList || devices;
    if (!targetDevices.length) return;

    try {
      const { startDate, endDate } = getUtcDateRange();
      const batches = createBatches(targetDevices, BATCH_SIZE);

      for (const batch of batches) {
        const telemetryResults = await Promise.all(
          batch.map((device) => fetchDeviceTelemetry(device, startDate, endDate))
        );

        telemetryResults.forEach(({ id, daily, status }) => {
          updateTelemetryStore(id, daily);
          updateTelemetryStore(id, status);
          updateLocationData(id, status);
        });
      }
    } catch (error) {
      console.error('Telemetry refresh error:', error);
    }
  }, [devices]);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getDevices();
      if (!response?.data?.length) return;

      const formattedDevices = formatDevices(response.data);
      allDevices.setDevices(formattedDevices);
      setDevices(formattedDevices);

      const { startDate, endDate } = getUtcDateRange();
      const batches = createBatches(formattedDevices, BATCH_SIZE);

      for (const batch of batches) {
        // Fetch attributes
        const attributeResults = await Promise.all(batch.map(fetchDeviceAttributes));
        
        attributeResults.forEach(({ id, details }) => {
          const attrMap = new Map(details.map(({ key, value }) => [key, value]));
          updateMachineStore(id, attrMap);
          deviceAttributes.setDeviceAttributes(id, details);
        });

        // Fetch telemetry
        const telemetryResults = await Promise.all(
          batch.map((device) => fetchDeviceTelemetry(device, startDate, endDate))
        );

        telemetryResults.forEach(({ id, daily, status }) => {
          updateTelemetryStore(id, daily);
          updateTelemetryStore(id, status);
          updateLocationData(id, status);
        });
      }

      // Fetch warnings after main data
      await fetchWarnings(formattedDevices);
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWarnings]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    getUserId(); // Favorites logic placeholder
  }, []);

  return { isLoading, devices, refreshTelemetry };
}

// Standalone fonksiyon - allDevices store'dan cihazları alarak telemetri verilerini yeniler
export async function refreshAllTelemetry(): Promise<void> {
  const deviceList = allDevices.all;
  if (!deviceList.length) return;

  try {
    const { startDate, endDate } = getUtcDateRange();
    const batches = createBatches(deviceList, BATCH_SIZE);

    for (const batch of batches) {
      const telemetryResults = await Promise.all(
        batch.map((device) => fetchDeviceTelemetry(device, startDate, endDate))
      );

      telemetryResults.forEach(({ id, daily, status }) => {
        updateTelemetryStore(id, daily);
        updateTelemetryStore(id, status);
        updateLocationData(id, status);
      });
    }
  } catch (error) {
    console.error('Telemetry refresh error:', error);
  }
}