import { api } from "../utilities/config";
import { handleAxiosError } from "../lib/axioErrorHandler";

export const handleCreateAnnotation = async (data: { answerId: string; comment: string; suggestedText?: string }) => {
    try {
        const response = await api.post('/annotation', data);
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleGetAnnotationsByAnswer = async (answerId: string) => {
    try {
        const response = await api.get(`/annotation/answer/${answerId}`);
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleResolveAnnotation = async (id: string) => {
    try {
        const response = await api.patch(`/annotation/${id}/resolve`);
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleUpdateAnnotation = async (id: string, data: { comment?: string; suggestedText?: string }) => {
    try {
        const response = await api.patch(`/annotation/${id}`, data);
        return { success: true, message: response.data.message, data: response.data.data };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};

export const handleDeleteAnnotation = async (id: string) => {
    try {
        const response = await api.delete(`/annotation/${id}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        const err = handleAxiosError(error);
        return { success: false, message: err.message };
    }
};
