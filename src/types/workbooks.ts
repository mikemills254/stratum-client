import type { IApiResponse } from "./types";

export interface Workbook {
    id: string;
    name: string;
    description?: string;
    directorId: string;
    createdAt: Date;
    updatedAt: Date;
    tag: string;
    isArchived: boolean
}

export interface IGetWorkBooks extends IApiResponse {
    data?: Workbook[]
}

export interface ICreateWorkBook {
    name: string;
    description?: string;
    tag?: string;
}

export interface ICreateWorkBookResponse extends IApiResponse {
    data?: Workbook
}

export interface IGetWorkBookResponse extends IApiResponse {
    data?: Workbook
}

export interface IWorkbookStats {
    teacherCount: number;
    studentCount: number;
    teachers: {
        uid: string;
        username: string;
        email: string;
        avatarUrl: string | null;
    }[];
}

export interface IGetWorkbookStatsResponse extends IApiResponse {
    data?: IWorkbookStats
}