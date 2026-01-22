import * as ApiUrl from "../endpoints";
import * as HttpClient from "../http-client";
import { IUserLogin } from "../../models/auth.ts";
import { userStore } from "../../store/UserStore.ts";
import { getAssetIDByUserId } from "../../data/Assets.ts";

export const UserLogin = async (
  username: string,
  password: string
): Promise<IUserLogin> => {
  const requestBody = {
    username: username,
    password: password,
  };

  const response = await HttpClient.post(ApiUrl.login, requestBody, {});

  return response.data;
};

export const refreshToken = async (
  refreshToken: string
): Promise<IUserLogin> => {
  const requestBody = {
    refreshToken: refreshToken,
  };

  const response = await HttpClient.post(ApiUrl.refreshToken, requestBody, {});

  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{}> => {
  const token = userStore.token;

  const requestBody = {
    currentPassword: currentPassword,
    newPassword: newPassword,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await HttpClient.post(ApiUrl.changePassword, requestBody, {
    headers,
  });

  return response.data;
};

export const getUserId = async (): Promise<string | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  const response = await HttpClient.get(ApiUrl.user, { headers });
  const userId = response.data?.id?.id;
  return userId || null;
};

export const getUserInfos = async (): Promise<any> => {
  let data = {
    email: "",
    name: "",
    surname: "",
    company: "",
  }
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };
  const response = await HttpClient.get(ApiUrl.user, { headers });
  data.email = response.data?.email || "";
  data.name = response.data?.firstName || "";
  data.surname = response.data?.lastName || "";
  return data;
}

export const getFavList = async (userId: string): Promise<any[] | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  let url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=fav`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value || [];
    return value;
  } catch (error) {
    console.error("Favoriler alınamadı:", error);
    return null;
  }
};

export const saveFavList = async (
  userId: string,
  favs: Array<{ id: string; type: string; model: string }>
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { fav: favs };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("Favori makineler kaydedilemedi:", error);
    return false;
  }
};

{
  /* 

const favs = [
  { id: "1test", type: "e", model: "e" },
  { id: "2test", type: "x", model: "x" }
];

await saveFavList(userId, favs);

  */
}

export const getRecentMachineList = async (
  userId: string
): Promise<any[] | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  let url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=recentMachine`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value || [];
    return value;
  } catch (error) {
    console.error("recentMachine alınamadı:", error);
    return null;
  }
};

export const saveRecentMachineList = async (
  userId: string,
  recentMachine: Array<{ id: string; type: string; model: string, subtype: string }>
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { recentMachine: recentMachine };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("recentMachine kaydedilemedi:", error);
    return false;
  }
};

interface Coordinate {
  lat: number;
  lng: number;
}

interface ShapeInfo {
  id: string;
  name: string;
  color: string; // örn: "hsl(314, 70%, 50%)"
  type: "polygon"; // Burada sadece polygon örneği var, dilersen union tipi genişletilebilir
  coordinates: Coordinate[];
  visible: boolean;
  createdAt: string; // ISO tarih stringi
}

//
export const getWorkingAreas = async (
  userId: string
): Promise<ShapeInfo[] | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  let url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=workingAreas`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value: ShapeInfo[] = response.data?.[0]?.value || [];
    return value;
  } catch (error) {
    console.error("working arealar alınamadı:", error);
    return null;
  }
};

export const getWorkingAreasFromAsset = async (): Promise<
  ShapeInfo[] | null
> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };


  const assetId = await getAssetIDByUserId() || "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f";


  const url = `https://makinanerede.com:8080/api/plugins/telemetry/ASSET/${assetId}/values/attributes?keys=workingAreas`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value: ShapeInfo[] = response.data?.[0]?.value || [];
    return value;
  } catch (error) {
    console.error("working arealar alınamadı:", error);
    return null;
  }
};

export const saveWorkingAreas = async (
  userId: string,
  workingAreas: Array<ShapeInfo>
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { workingAreas: workingAreas };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("working arealar kaydedilemedi:", error);
    return false;
  }
};

//timer

export const getTimerSetting = async (
  userId: string
): Promise<number | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  const url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=timer`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value;
    return typeof value === "number" ? value : null;
  } catch (error) {
    console.error("Zamanlayıcı değeri alınamadı:", error);
    return null;
  }
};

export const getWeatherCities = async (
  userId: string
): Promise<Array<string> | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  const url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=weatherCities`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value;
    return value;
  } catch (error) {
    console.error("Hava durumu şehirleri alınamadı:", error);
    return null;
  }
};

export const saveTimerSetting = async (
  userId: string,
  timer: number
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { timer };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("Zamanlayıcı değeri kaydedilemedi:", error);
    return false;
  }
};

export const saveWeatherCities = async (
  userId: string,
  weatherCitiesName: Array<string>
): Promise<boolean> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };
  const body = { weatherCities: weatherCitiesName };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
  } catch (error) {
    console.error("Hava durumu şehirleri kaydedilemedi:", error);
    return false;
  }
  return true;
};

export const saveWorkingAreasToAsset = async (
  workingAreas: Array<ShapeInfo>
): Promise<boolean> => {
  const assetId = await getAssetIDByUserId() || "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f"; // ASKO ASSET ID
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { workingAreas: workingAreas };

  try {
    await HttpClient.post(
      // `${ApiUrl.telemetry}/api/plugins/telemetry/ASSET/${ASSETID}/attributes/SERVER_SCOPE`,
      `https://makinanerede.com:8080/api/plugins/telemetry/ASSET/${assetId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("working arealar kaydedilemedi:", error);
    return false;
  }
};

export const saveWorkingAreasToDevice = async (
  id: string,
  coordinates: string
): Promise<boolean> => {
  // const ASSETID = "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f"; // ASKO ASSET ID
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { perimeter: coordinates };

  try {
    await HttpClient.post(
      `https://makinanerede.com:8080/api/plugins/telemetry/DEVICE/${id}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("working arealar kaydedilemedi:", error);
    return false;
  }
};

export const getAccountInfo = async (userId: string): Promise<any[] | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  let url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=accountInfo`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value || [];
    return value;
  } catch (error) {
    console.error("Favoriler alınamadı:", error);
    return null;
  }
};

export const saveAccountInfo = async (
  userId: string,
  accountInfo: Array<{
    name: string;
    surname: string;
    company: string;
    gender: string;
  }>
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = {
    accountInfo, // array direkt olarak burada veriliyor
  };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("Hesap bilgileri kaydedilemedi:", error);
    return false;
  }
};

export const resetPasswordByEmail = async (mail: string): Promise<boolean> => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = { email: mail };

  try {
    const success = await HttpClient.post(
      `https://makinanerede.com:8080/api/noauth/resetPasswordByEmail`,
      body,
      { headers }
    );
    if (success.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Şifre sıfırlamada hata", error);
    return false;
  }
};

export const resetPassword = async (
  token: string,
  password: string
): Promise<boolean> => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = { resetToken: token, password: password };

  try {
    await HttpClient.post(
      `https://makinanerede.com:8080/api/noauth/resetPassword`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("Şifre sıfırlamada hata", error);
    return false;
  }
};

// AI Chat Widget ayarlarını getirme
export const getAiChatSetting = async (
  userId: string
): Promise<boolean | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  const url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=aiChatEnabled`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value;
    return typeof value === "boolean" ? value : null;
  } catch (error) {
    console.error("AI Chat ayarı alınamadı:", error);
    return null;
  }
};

// AI Chat Widget ayarını kaydetme
export const saveAiChatSetting = async (
  userId: string,
  aiChatEnabled: boolean
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { aiChatEnabled };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("AI Chat ayarı kaydedilemedi:", error);
    return false;
  }
};

// Makine özel ayarları getirme
export const getMachineSpecificSettings = async (
  userId: string
): Promise<any | null> => {
  const token = userStore.token;
  const headers = { Authorization: `Bearer ${token}` };

  const url = `${ApiUrl.telemetry}/USER/${userId}/values/attributes?keys=machineSpecificSettings`;

  try {
    const response = await HttpClient.get(url, { headers });
    const value = response.data?.[0]?.value;
    return value || null;
  } catch (error) {
    console.error("Makine özel ayarları alınamadı:", error);
    return null;
  }
};

// Makine özel ayarları kaydetme
export const saveMachineSpecificSettings = async (
  userId: string,
  machineSpecificSettings: any
): Promise<boolean> => {
  const token = userStore.token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const body = { machineSpecificSettings };

  try {
    await HttpClient.post(
      `${ApiUrl.telemetry}/USER/${userId}/attributes/SERVER_SCOPE`,
      body,
      { headers }
    );
    return true;
  } catch (error) {
    console.error("Makine özel ayarları kaydedilemedi:", error);
    return false;
  }
};