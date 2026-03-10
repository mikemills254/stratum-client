import { api } from "../utilities/config";
import type { ICreateQuestion, IEditQuestion, IQuestionResponse, IGetQuestionsResponse } from "../types/worksheets";
import type { IApiResponse } from "../types/types";

export type { ICreateQuestion, IEditQuestion, IQuestionResponse, IGetQuestionsResponse };

export const handleCreateQuestion = async (data: ICreateQuestion): Promise<IQuestionResponse> => {
    try {
        const response = await api.post("/question", data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to create question", success: false };
    }
};

export const handleGetQuestionsByWorksheet = async (worksheetId: string): Promise<IGetQuestionsResponse> => {
    try {
        const response = await api.get(`/question/worksheet/${worksheetId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to fetch questions", success: false };
    }
};

export const handleEditQuestion = async (id: string, data: IEditQuestion): Promise<IQuestionResponse> => {
    try {
        const response = await api.put(`/question/${id}`, data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to update question", success: false };
    }
};

export const handleDeleteQuestion = async (id: string): Promise<IApiResponse> => {
    try {
        const response = await api.delete(`/question/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to delete question", success: false };
    }
};
