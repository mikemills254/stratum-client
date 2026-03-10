import { api } from "../utilities/config";
import { handleAxiosError } from "../lib/axioErrorHandler";
import type { IAnswer, IAnswerResponse } from "../types/answers";

export type { IAnswer, IAnswerResponse };

export const handleGetOrCreateAnswer = async (questionId: string): Promise<IAnswerResponse> => {
    try {
        const response = await api.post('/answer', { questionId });
        return response.data;
    } catch (error) {
        const thisError = handleAxiosError(error);
        return {
            message: thisError.message,
            success: false
        };
    }
};

export const handleSubmitAnswer = async (answerId: string): Promise<IAnswerResponse> => {
    try {
        const response = await api.post(`/answer/${answerId}/submit`);
        return response.data;
    } catch (error) {
        const thisError = handleAxiosError(error);
        return {
            message: thisError.message,
            success: false
        };
    }
};

export const handleGetAnswer = async (answerId: string): Promise<IAnswerResponse> => {
    try {
        const response = await api.get(`/answer/${answerId}`);
        return response.data;
    } catch (error) {
        const thisError = handleAxiosError(error);
        return {
            message: thisError.message,
            success: false
        };
    }
};

export const handleUpdateAnswerText = async (answerId: string, text: string): Promise<IAnswerResponse> => {
    try {
        const response = await api.put(`/answer/${answerId}/text`, { text });
        return response.data;
    } catch (error) {
        const thisError = handleAxiosError(error);
        return {
            message: thisError.message,
            success: false
        };
    }
};
