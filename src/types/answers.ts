import type { IApiResponse } from "./types";

export interface IAnnotation {
    id: string;
    comment: string;
    createdAt: string;
    teacher: {
        username: string;
        avatarUrl?: string
    };
}

export interface IGrade {
    id: string;
    score: number;
    feedback?: string;
}

export interface IAnswer {
    id: string;
    questionId: string;
    studentId: string;
    text: string;
    status: 'DRAFT' | 'SUBMITTED' | 'GRADED';
    submittedAt?: string;
    createdAt: string;
    updatedAt: string;
    student: {
        username: string;
        email?: string;
        avatarUrl?: string;
    };
    annotations: IAnnotation[];
    grade?: IGrade;
}

export interface IAnswerResponse extends IApiResponse {
    data?: IAnswer;
}
