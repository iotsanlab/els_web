import { makeAutoObservable } from 'mobx';

class LangStore {
  code: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadLang();
  }

  // Dil ayarını kaydetme
  async setLang(code: string) {
    this.code = code;
    try {
      localStorage.setItem('lang', code);  // localStorage kullanarak dil verisini saklıyoruz
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }

  // Dil ayarını yükleme
  async loadLang() {
    try {
      const code = localStorage.getItem('lang'); // localStorage'dan dil verisini alıyoruz
      if (code) {
        this.code = code;
      }
      return code;
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  }
}

const langStore = new LangStore();
export default langStore;
