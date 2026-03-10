import { api } from "../utilities/config";
import type { ICreateWorksheet, IEditWorksheet, IGetWorksheetsResponse, IWorksheetResponse } from "../types/worksheets";
import type { IApiResponse } from "../types/types";

export const handleCreateWorksheet = async (data: ICreateWorksheet): Promise<IWorksheetResponse> => {
    try {
        const response = await api.post("/worksheet", data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to create worksheet", success: false };
    }
};

export const handleGetWorksheetsByWorkbook = async (workbookId: string): Promise<IGetWorksheetsResponse> => {
    try {
        const response = await api.get(`/worksheet/workbook/${workbookId}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to fetch worksheets", success: false };
    }
};

export const handleGetWorksheet = async (id: string): Promise<IWorksheetResponse> => {
    try {
        const response = await api.get(`/worksheet/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to fetch worksheet", success: false };
    }
};

export const handleEditWorksheet = async (id: string, data: IEditWorksheet): Promise<IWorksheetResponse> => {
    try {
        const response = await api.put(`/worksheet/${id}`, data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to update worksheet", success: false };
    }
};

export const handleDeleteWorksheet = async (id: string): Promise<IApiResponse> => {
    try {
        const response = await api.delete(`/worksheet/${id}`);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { message: "Failed to delete worksheet", success: false };
    }
};
