import type { IApiResponse } from "./types";

export interface IUser {
    uid: string;
    username: string;
    email: string;
    avatarUrl: string | null;
    role?: string;
    isMember?: boolean;
}

export interface IUserSearchResponse extends IApiResponse {
    data?: IUser[];
}
