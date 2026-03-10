export interface IApiResponse<T = any> {
    message: string;
    success: boolean;
    data?: T;
}

export interface ErrorResponse {
    error: string;
    message: string;
    status?: number;
    details?: unknown
}

export enum Role {
    TEACHER = "TEACHER",
    DIRECTOR = "DIRECTOR",
    STUDENT = "STUDENT"
}