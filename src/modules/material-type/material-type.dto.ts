import { MaterialType } from '@database/models/material-type.model';

export interface ListMaterialTypesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ListMaterialTypesResult {
    data: MaterialType[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ThinMaterialType {
    id: string;
    name: string;
    slug: string;
}

export interface CreateMaterialTypeInput {
    name: string;
    description?: string;
}

export interface UpdateMaterialTypeInput {
    name?: string;
    description?: string;
} 