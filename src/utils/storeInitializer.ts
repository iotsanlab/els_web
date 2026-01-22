import { getDevices } from "../services/devices";
import { getValuesTimeSeries } from "../services/telemetry";
import deviceAttributes from "../store/DeviceAttributes";
import deviceWorkStore from "../store/DeviceTelemetry";

export const initializeStores = async () => {
  try {
    // Önce localStorage'dan kontrol et
    if (deviceAttributes.all.length > 0 && deviceWorkStore.all.length > 0) {
      console.log("Store'lar zaten localStorage'dan yüklendi");
      return;
    }

    console.log("Store'lar API'den yükleniyor...");
    
    // Devices bilgilerini çek
    const devicesResponse = await getDevices();
    const devices = devicesResponse.data.filter((item: any) => 
      item.label && item.label.trim() !== ""
    );

    // Device attributes'ları store'a kaydet
    for (const device of devices) {
      const attributes = [
        { key: "deviceName", value: device.label },
        { key: "Type", value: device.type || "Unknown" },
        { key: "SeriNo", value: device.name || "" },
        { key: "Model", value: device.additionalInfo?.model || "Unknown" },
        { key: "Subtype", value: device?.subType || "Unknown" }
      ];
      
      deviceAttributes.setDeviceAttributes(device.id.id, attributes);
    }

    // Temel telemetry verilerini çek (sadece gerekli olanlar)
    const telemetryKeys = ["latitude", "longitude", "fuelConsumption", "workingHours"];
    
    for (const device of devices) {
      for (const key of telemetryKeys) {
        try {
          const telemetryResponse = await getValuesTimeSeries(device.id.id, key, 50);
          if (telemetryResponse?.data && Array.isArray(telemetryResponse.data)) {
            deviceWorkStore.setTelemetry(device.id.id, key, telemetryResponse.data);
          }
        } catch (error) {
          console.warn(`Telemetry data failed for ${device.id.id}:${key}`, error);
        }
      }
    }

    console.log("Store'lar başarıyla yüklendi");
  } catch (error) {
    console.error("Store initialization failed:", error);
  }
};
