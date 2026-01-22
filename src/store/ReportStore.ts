import { makeAutoObservable, runInAction } from "mobx";
import { CheckboxItem } from "../pages/ReportPage/type";

import AsyncStorage from '@react-native-async-storage/async-storage';


interface TimeRange {
  startDate: string;
  endDate: string;
}

interface ReportStore {
  id: string;
  reportName: string;
  reportType: string;
  timeRange: TimeRange;
  selectedMachines: CheckboxItem[];
}

class ReportStoreClass {
  reports: ReportStore[] = [];
  isLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadReports(); // Initial load of reports when the store is created
  }

  // Raporları AsyncStorage'dan yükle
  async loadReports() {
    try {
      const storedReports = await AsyncStorage.getItem('reports');
      runInAction(() => {
        if (storedReports) {
          this.reports = JSON.parse(storedReports);
        }
        this.isLoaded = true;
      });
    } catch (error) {
      console.error("AsyncStorage'dan raporlar yüklenirken hata oluştu:", error);
      runInAction(() => {
        this.isLoaded = true;
      });
    }
  }

  // Raporu AsyncStorage'a kaydet
  async saveReports() {
    try {
      await AsyncStorage.setItem('reports', JSON.stringify(this.reports));
    } catch (error) {
      console.error("AsyncStorage'a raporlar kaydedilirken hata oluştu:", error);
    }
  }

  // Benzersiz bir ID oluştur
  generateUniqueId(): string {
    // Mevcut en büyük ID'yi bul
    let maxId = 0;
    this.reports.forEach(report => {
      const reportId = parseInt(report.id, 10);
      if (!isNaN(reportId) && reportId > maxId) {
        maxId = reportId;
      }
    });
    
    // Bir sonraki ID'yi döndür
    return String(maxId + 1);
  }

  // Rapor ekleme
  addReport(report: ReportStore) {
    // Benzersiz bir ID ata
    if (!report.id) {
      report.id = this.generateUniqueId();
    }
    
    // Mevcut raporlara ekle
    this.reports.push(report);
    this.saveReports(); // Yeni raporu kaydet
  }

  // Tüm raporları al
  getAllReports(): ReportStore[] {
    return this.reports;
  }

  // Belirli bir raporu id'ye göre al
  getReportById(id: string): ReportStore | undefined {
    return this.reports.find(report => report.id === id);
  }

  // Raporu id'ye göre sil
  async removeReport(id: string) {
    this.reports = this.reports.filter(report => report.id !== id);
    this.saveReports(); // Rapor silindiğinde, veritabanını güncelle
  }
}

export const reportStore = new ReportStoreClass();
