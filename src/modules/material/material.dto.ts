export interface ListMaterialsParams {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
}

export interface ListMaterialsResult {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ThinMaterial {
    id: string;
    vendorId: string;
    materialTypeId: string;
    projectId: string;
} 