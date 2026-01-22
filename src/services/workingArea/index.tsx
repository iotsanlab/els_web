import { userStore } from "../../store/UserStore";
import { saveWorkingAreas, getWorkingAreas } from "../auth/index";
import * as HttpClient from '../http-client.ts';
import * as ApiUrl from "../endpoints.ts";
import { IAssetResponse } from "../../models/assets.ts";

interface Coordinate {
  lat: number;
  lng: number;
}

interface ShapeInfo {
  id: string;
  name: string;
  color: string;          // örn: "hsl(314, 70%, 50%)"
  type: "polygon";        // Burada sadece polygon örneği var, dilersen union tipi genişletilebilir
  coordinates: Coordinate[];
  visible: boolean;
  createdAt: string;      // ISO tarih stringi
}

const token = userStore.token;



export const getUserAssetId = async (): Promise<IAssetResponse> => {
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await HttpClient.get(`${ApiUrl.assets}?pageSize=100&page=0`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  );
  return response.data;
};



export const saveWorkingAreaFonk = async (
  userId: string,
  workingArea: ShapeInfo
): Promise<boolean> => {
  try {
    const currentList = await getWorkingAreas(userId) || [];

    // Aynı ID varsa çıkar (yeniden eklenecek)
    const filtered = currentList.filter(item => item.id !== workingArea.id);

    // En başa ekle
    const updatedList = [workingArea, ...filtered].slice(0, 10);

    await saveWorkingAreas(userId, updatedList);
    return true;
  } catch (error) {
    console.error("workingArea güncellemesi başarısız:", error);
    return false;
  }
};