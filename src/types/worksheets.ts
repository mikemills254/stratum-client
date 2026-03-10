import type { IApiResponse } from "./types";

export interface Question {
    id: string;
    text: string;
    worksheetId: string;
    isRequired?: boolean;
}

export interface Worksheet {
    id: string;
    title: string;
    description: string | null;
    workbookId: string;
    teacherId: string;
    questions?: Question[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateWorksheet {
    title: string;
    description?: string;
    workbookId: string;
}

export interface IEditWorksheet {
    title?: string;
    description?: string;
}

export interface IGetWorksheetsResponse extends IApiResponse {
    data?: Worksheet[];
}

export interface IWorksheetResponse extends IApiResponse {
    data?: Worksheet;
}

// Question types
export interface ICreateQuestion {
    text: string;
    worksheetId: string;
}

export interface IEditQuestion {
    text: string;
}

export interface IQuestionResponse extends IApiResponse {
    data?: Question;
}

export interface IGetQuestionsResponse extends IApiResponse {
    data?: Question[];
}
