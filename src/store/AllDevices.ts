import { makeAutoObservable } from "mobx";

export interface Device {
  createdTime: number;
  name: string;
  type: string;
  label: string;
  entityType: string;
  id: string;
}

class AllDevicesStore {
  devices: Device[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setDevices(devices: Device[]) {
    this.devices = devices;
  }

  get all(): Device[] {
    return this.devices;
  }

  get count(): number {
    return this.devices.length;
  }
  clearData() {
    this.devices = [];
  }
}

const allDevices = new AllDevicesStore();
export default allDevices;
