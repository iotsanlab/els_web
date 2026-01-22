import { userStore } from "../../store/UserStore";
import { deviceStore } from "../../store/DeviceStore";
import deviceWorkStore from "../../store/DeviceTelemetry";
import warningStore from "../../store/Warnings";

interface AuthUtils {       
    isAuthenticated: () => boolean;
    getToken: () => string | null;
    logout: () => void;
}

export const authUtils: AuthUtils = {
    isAuthenticated: (): boolean => {
        return !!userStore.token;
    },

    getToken: (): string | null => {
        return userStore.token;
    },

    logout: (): void => {
        userStore.clearData();
        deviceStore.clearData();
        deviceWorkStore.clear();
        warningStore.clear();
        window.location.href = '/login';
    }
};

export const { isAuthenticated, getToken, logout } = authUtils;