import { Project } from '@database/models/project.model';
import { Vendor } from '@database/models/vendor.model';

export const getProjectCount = async (): Promise<number> => {
    return Project.count();
};

export const getVendorCount = async (): Promise<number> => {
    return Vendor.count();
};