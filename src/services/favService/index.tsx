import { getFavList, getRecentMachineList, saveFavList, saveRecentMachineList } from "../auth/index";

export type FavItem = {
  id: string;
  type: string;
  model: string;
  isTelehandlerV2?: boolean;
  subtype: string;
};

/**
 * Bir makineyi favorilere ekler veya çıkarır.
 */
export const toggleFavorite = async (
  userId: string,
  machine: FavItem
): Promise<boolean> => {
  try {
    const currentFavs = await getFavList(userId) || [];

    const exists = currentFavs.some(fav => fav.id === machine.id);
    const updatedFavs = exists
      ? currentFavs.filter(fav => fav.id !== machine.id)
      : [...currentFavs, machine];

    await saveFavList(userId, updatedFavs);
    return true;
  } catch (error) {
    console.error("Favori güncellemesi başarısız:", error);
    return false;
  }
};

export const updateRecentMachineList = async (
  userId: string,
  machine: FavItem
): Promise<boolean> => {
  try {
    const currentList = await getRecentMachineList(userId) || [];

    // Aynı ID varsa çıkar (yeniden eklenecek)
    const filtered = currentList.filter(item => item.id !== machine.id);

    // En başa ekle
    const updatedList = [machine, ...filtered].slice(0, 10);

    await saveRecentMachineList(userId, updatedList);
    return true;
  } catch (error) {
    console.error("recentMachine güncellemesi başarısız:", error);
    return false;
  }
};