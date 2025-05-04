import { Vendor } from '@database/models/vendor.model';

export interface ListVendorsParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ListVendorsResult {
    data: Vendor[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ThinVendor {
    id: string;
    vendorName: string;
} 