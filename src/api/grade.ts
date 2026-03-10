import { api } from "../utilities/config";
import { handleAxiosError } from "../lib/axioErrorHandler";

export const handleAssignGrade = async (data: { answerId: string; score: number; feedback?: string }) => {
    try {
        const response = await api.post('/grade', data);
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleApproveGrade = async (id: string) => {
    try {
        const response = await api.patch(`/grade/${id}/approve`);
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleGetPendingApprovals = async () => {
    try {
        const response = await api.get('/grade/pending');
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};
