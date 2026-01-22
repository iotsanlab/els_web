import { action, makeAutoObservable } from 'mobx';

interface IUserLogin {
  refreshToken: string;
  token: string;
  email: string | null;
  userId?: string;
  assetId?: string;
}

class UserStore {
  refreshToken: string | null;
  token: string | null;
  email: string | null;
  userId: string | null; // opsiyonel değil, net olsun diye
  assetId: string | null;

  constructor() {
    this.refreshToken = null;
    this.token = null;
    this.email = null;
    this.userId = null;
    this.assetId = null;

    makeAutoObservable(this);
    this.loadUserData();
  }

  // Kullanıcıyı ayarlama işlemi
  setUser = action(async (user: IUserLogin | null) => {
    if (user) {
      this.refreshToken = user.refreshToken;
      this.token = user.token;
      this.email = user.email || null;
      this.userId = user.userId || null; // ← EKLENDİ
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      await this.clearData();
    }
  });

  setAssetId = action((id: string) => {
    this.assetId = id;
  });

  // Sadece userId ayarla
  setUserId = action((id: string) => {
    this.userId = id;

    const userString = localStorage.getItem("user");
    if (userString) {
      const user: IUserLogin = JSON.parse(userString);
      const updatedUser = { ...user, userId: id };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  });

  // Kullanıcı verilerini localStorage'dan yükle
  async loadUserData() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: IUserLogin = JSON.parse(userString);
      this.setUser({
        ...user,
        email: user.email || null,
        userId: user.userId || null, // ← eklenmesi güvenli olur
        assetId: user.assetId || null,
      });
    }
  }

  // Temizle
  clearData = action(async () => {
    this.refreshToken = null;
    this.token = null;
    this.email = null;
    this.userId = null;
    this.assetId = null;
    localStorage.removeItem('user');
  });
}

export const userStore = new UserStore();
