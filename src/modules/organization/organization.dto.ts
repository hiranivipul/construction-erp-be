import { Organization } from '@database/models/organization.model';

export interface ListOrganizationsParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ListOrganizationsResult {
    data: Organization[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ThinOrganization {
    id: string;
    name: string;
    code: string;
}


export interface OrganizationCreationAttributes {
    name: string;
    code: string;
    address?: string;
    contact_no?: string;
    email: string;
    password: string;
}
