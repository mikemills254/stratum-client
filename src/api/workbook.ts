import { handleAxiosError } from "../lib/axioErrorHandler";
import type { ICreateWorkBook, ICreateWorkBookResponse, IGetWorkBookResponse, IGetWorkBooks, IGetWorkbookStatsResponse } from "../types/workbooks";
import { api } from "../utilities/config";

export const handleGetWorkBooks = async (): Promise<IGetWorkBooks> => {
    try {
        const response = await api.get('/workbook');
        return {
            message: response.data.message,
            success: true,
            data: response.data.data
        }
    } catch (error) {
        const thisError = handleAxiosError(error)
        return {
            message: thisError.message,
            success: false
        }
    }
}

export const handleCreateWorkBook = async (data: ICreateWorkBook): Promise<ICreateWorkBookResponse> => {
    try {
        const response = await api.post('/workbook', data);
        return response.data
    } catch (error) {
        const thisError = handleAxiosError(error)
        return {
            message: thisError.message,
            success: false
        }
    }
}

export const handleGetWorkBook = async (id: string): Promise<IGetWorkBookResponse> => {
    try {
        const response = await api.get(`/workbook/${id}`);
        return response.data
    } catch (error) {
        const thisError = handleAxiosError(error)
        return {
            message: thisError.message,
            success: false
        }
    }
}

export const handleGetWorkbookStats = async (id: string): Promise<IGetWorkbookStatsResponse> => {
    try {
        const response = await api.get(`/workbook/${id}/stats`);
        return response.data
    } catch (error) {
        const thisError = handleAxiosError(error)
        return {
            message: thisError.message,
            success: false
        }
    }
}