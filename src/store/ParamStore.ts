import { makeAutoObservable } from "mobx";

class ParamStore {
  paramSelections: Record<string, string[]> = {}; // "userId_machineId": [selectedParameters]

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  private getKey(userId: string, machineId: string): string {
    return `${userId}_${machineId}`;
  }

  setSelection(userId: string, machineId: string, parameters: string[]) {
    const key = this.getKey(userId, machineId);
    this.paramSelections[key] = parameters;
    this.saveToStorage();
  }

  getSelection(userId: string, machineId: string): string[] {
    const key = this.getKey(userId, machineId);
    return this.paramSelections[key] || [];
  }

  hasSelection(userId: string, machineId: string): boolean {
    const key = this.getKey(userId, machineId);
    return key in this.paramSelections;
  }

  private saveToStorage() {
    localStorage.setItem("paramSelections", JSON.stringify(this.paramSelections));
  }

  private loadFromStorage() {
    const data = localStorage.getItem("paramSelections");
    if (data) {
      try {
        this.paramSelections = JSON.parse(data);
      } catch (e) {
        console.error("ParamStore: localStorage parse hatası", e);
        this.paramSelections = {};
      }
    }
  }
}

const paramStore = new ParamStore();
export default paramStore;
