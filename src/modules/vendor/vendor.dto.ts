import { Vendor } from '@database/models/vendor.model';

export interface ListVendorsParams {
    organization_id: string;
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
    vendor_name: string;
}
