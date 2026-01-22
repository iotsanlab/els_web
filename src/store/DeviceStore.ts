import { action, makeAutoObservable } from 'mobx';

type Device = {
  id: string;
  title: string;
  label: string;
  type: string;
  latitude: number;
  longitude: number;
  status: boolean;
  hours: string;
  fuel: string | null;  // null değerini kabul edecek şekilde düzenlendi
  operatorName?: string;
  operatorPhone?: string;
  city?: string;
  warning?: string;
  brand?: string;
  date?: string;  // MarkerType ile eşleşmesi için ekliyoruz
  time?: string;  // MarkerType ile eşleşmesi için ekliyoruz
  serialNo?: string;  // serialNo eksikti, ekliyoruz
  hourlyAverageFuelConsumpiton?: string;  // eksik olduğu için eklendi
  Model?: string;
  opName?: string;
  opPhone?: string;
  ProductionYear?: string;
  helpMail?: string;
  helpPhoneNo?: string;
  telemetry?: any; // yeni eklendi

};


class DeviceStore {
  devices: Device[];

  constructor() {
    this.devices = [];
    makeAutoObservable(this);
    this.loadDeviceData();
  }

  private sortDevices(devices: Device[]): Device[] {
    return devices.sort((a, b) => {
      if (a.status && !b.status) return -1;
      if (!a.status && b.status) return 1;
      if (a.type === "Excavator" && b.type === "Backhoeloader") return -1;
      if (a.type === "Backhoeloader" && b.type === "Excavator") return 1;
      return 0;
    });
  }

  setDevices = action(async (devices: Device[]) => {
    this.devices = this.sortDevices(devices); // Cihazları sıralıyoruz
    try {
      localStorage.setItem('devices', JSON.stringify(this.devices));
    } catch (error) {
      console.error('Failed to save devices:', error);
    }
  });

  addDevice = action(async (device: Device) => {
    this.devices = this.sortDevices([...this.devices, device]); // Yeni cihaz eklenirken sıralama yapıyoruz
    try {
      localStorage.setItem('devices', JSON.stringify(this.devices));
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  });

  removeDevice = action(async (deviceId: string) => {
    this.devices = this.devices.filter(device => device.id !== deviceId);
    try {
      localStorage.setItem('devices', JSON.stringify(this.devices));
    } catch (error) {
      console.error('Failed to remove device:', error);
    }
  });

  async loadDeviceData() {
    try {
      const devicesString = localStorage.getItem('devices');
      if (devicesString) {
        const devices = JSON.parse(devicesString);
        this.setDevices(devices);
      }
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  }

  clearData = action(async () => {
    this.devices = [];
    try {
      localStorage.removeItem('devices');
    } catch (error) {
      console.error('Failed to clear devices:', error);
    }
  });

  setOperatorName = action((deviceId: string, name: string) => {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.operatorName = name;
      this.updateDevice(device);
    }
  });

  setOperatorPhone = action((deviceId: string, phone: string) => {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.operatorPhone = phone;
      this.updateDevice(device);
    }
  });

  setCity = action((deviceId: string, city: string) => {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.city = city;
      this.updateDevice(device);
    }
  });

  setWarning = action((deviceId: string, warning: string) => {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.warning = warning;
      this.updateDevice(device);
    }
  });

  private updateDevice = async (device: Device) => {
    this.devices = this.sortDevices(this.devices.map(d => (d.id === device.id ? device : d)));
    try {
      localStorage.setItem('devices', JSON.stringify(this.devices));
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };
}

export const deviceStore = new DeviceStore();
