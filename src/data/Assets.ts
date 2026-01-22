import { getUserId } from "../services/auth";
import { userStore } from "../store/UserStore";

interface Asset {
    type: string;
    email: string;
    name: string;
    id: string;
    user_id: string;
}

export const assets: Asset[] = [
    {
        "type": "Develon",
        "email": "develon@sanlab.net",
        "name": "Develon Excavator",
        "id": "1c1cf750-b33e-11f0-a8a3-17916a2f6ce0",
        "user_id": "050b7c10-b336-11f0-a8a3-17916a2f6ce0"
    },
    {
        "type": "Mst",
        "email": "mst@sanlab.net",
        "name": "USA Excavator",
        "id": "9aa2fa40-a8d4-11ef-b104-9baf3c6cae9f",
        "user_id": "e64c3ba0-a8d9-11ef-92df-9921364503a5"
    }
]

export const getAssetIDByUserId = async () => {

    if (userStore.assetId) {
        return userStore.assetId;
    }

    const userId = await getUserId();
    const findId = assets.find((asset) => asset.user_id === userId);



    if (!findId) {
        return null;
    }

    return findId?.id;
    
}