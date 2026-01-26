import { makeAutoObservable } from "mobx";

export type DeviceAttributes = Record<string, any>; 

class DeviceAttributesStore {
  attributesMap: Map<string, DeviceAttributes> = new Map();

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  setDeviceAttributes(deviceId: string, attributes: DeviceAttributes) {
    this.attributesMap.set(deviceId, attributes);
    this.saveToStorage();
  }

  getAttributesById(deviceId: string): DeviceAttributes | undefined {
    return this.attributesMap.get(deviceId);
  }

   getAttribute(deviceId: string, key: string): any | undefined {
    const attrs = this.attributesMap.get(deviceId);
    return attrs ? attrs[key] : undefined;
  }

  get all(): [string, DeviceAttributes][] {
    return Array.from(this.attributesMap.entries());
  }

  clear() {
    this.attributesMap.clear();
    localStorage.removeItem('deviceAttributes');
  }

  private saveToStorage() {
    try {
      const data = Array.from(this.attributesMap.entries());
      localStorage.setItem('deviceAttributes', JSON.stringify(data));
    } catch (error) {
      console.warn('DeviceAttributes localStorage save failed:', error);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('deviceAttributes');
      if (stored) {
        const data = JSON.parse(stored) as [string, DeviceAttributes][];
        this.attributesMap = new Map(data);
      }
    } catch (error) {
      console.warn('DeviceAttributes localStorage load failed:', error);
      this.attributesMap = new Map();
    }
  }
}

const deviceAttributes = new DeviceAttributesStore();
export default deviceAttributes;
