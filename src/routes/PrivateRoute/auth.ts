import { userStore } from "../../store/UserStore";
import { deviceStore } from "../../store/DeviceStore";
import deviceWorkStore from "../../store/DeviceTelemetry";
import warningStore from "../../store/Warnings";
import deviceAttributes from "../../store/DeviceAttributes";
import allDevices from "../../store/AllDevices";
import machineStore from "../../store/MachineStore";
import paramStore from "../../store/ParamStore";

interface AuthUtils {       
    isAuthenticated: () => boolean;
    getToken: () => string | null;
    logout: () => void;
}

// Tüm cache'lenmiş verileri ve localStorage'ı temizle
export const clearAllCachedData = (): void => {
    // Store'ları temizle
    userStore.clearData();
    deviceStore.clearData();
    deviceWorkStore.clear();
    warningStore.clear();
    deviceAttributes.clear();
    allDevices.clearData();
    machineStore.clearMachines();
    paramStore.clear();

    // Login/Auth ile ilgili localStorage key'lerini temizle
    localStorage.removeItem('justLoggedIn');
    localStorage.removeItem('attempts');
    localStorage.removeItem('cooldownUntil');
    
    console.log('✅ Tüm cache temizlendi');
};

export const authUtils: AuthUtils = {
    isAuthenticated: (): boolean => {
        return !!userStore.token;
    },

    getToken: (): string | null => {
        return userStore.token;
    },

    logout: (): void => {
        clearAllCachedData();
        window.location.href = '/login';
    }
};

export const { isAuthenticated, getToken, logout } = authUtils;