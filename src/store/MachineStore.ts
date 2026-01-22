import { makeAutoObservable } from "mobx";
import { MachineData } from "../utils/machine";

class MachineStore {
  machines: Map<string, MachineData> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  // Belirli bir cihazın verisini set et
  setMachineData(id: string, data: Partial<Omit<MachineData, "id">>) {
    const existing = this.machines.get(id) || {
      id,
      name: "",
      type: "",
      lat: 0,
      long: 0,
      totalWorkingHours: 0,
      model: "",
      serialNo: "",
      user_fullname: "",
      instantFuel: 0,
      totalUsedFuel:0,
      state: false,
      deviceName: "",
      isTelehandlerV2Image: false,
      subtype: ""
    };
    this.machines.set(id, { ...existing, ...data });
  }

  // Belirli bir cihazın verisini getir
  getMachineData(id: string): MachineData | undefined {
    return this.machines.get(id);
  }

  // Belirli bir cihazın spesifik bir field'ını getir
  getField(id: string, field: keyof MachineData) {
    return this.machines.get(id)?.[field];
  }

  // Tüm makineleri getir
  getAllMachines() {
    return Array.from(this.machines.values());
  }

  // Tüm makineleri temizle
  clearMachines() {
    this.machines.clear();
  }
}

const machineStore = new MachineStore();
export default machineStore;
