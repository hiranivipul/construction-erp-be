import { Project } from '@database/models/project.model';

export interface ListProjectsParams {
    organization_id: string;
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
    project_name: string;
}
