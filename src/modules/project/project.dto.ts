import { Project } from '@database/models/project.model';

export interface ListProjectsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ListProjectsResult {
    data: Project[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ThinProject {
    id: string;
    projectName: string;
} 