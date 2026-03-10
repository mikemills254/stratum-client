import { api } from "../utilities/config";
import { handleAxiosError } from "../lib/axioErrorHandler";

export const handleRequestTwoFactor = async (role: string) => {
    try {
        const response = await api.post('/auth/request-2fa', { role });
        return { success: true, message: response.data.message };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleVerifyTwoFactor = async (code: string) => {
    try {
        const response = await api.post('/auth/verify', { code });
        return { success: true, message: response.data.message };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};
