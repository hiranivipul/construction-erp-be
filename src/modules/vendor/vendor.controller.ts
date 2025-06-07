import { Request, Response } from 'express';
import { VendorAttributes } from '@database/models/vendor.model';
import {
    createVendor,
    listVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    listThinVendors,
    exportVendors,
} from './vendor.service';
import { getOrganizationId } from '@/utils/helper';
import { ForeignKeyConstraintError } from 'sequelize';

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const organizationId = getOrganizationId(req);
        const vendor = await createVendor({...req.body, organization_id: organizationId});
        console.log('create vendor', vendor);
        res.status(201).json({
            message: 'Vendor created successfully',
            data: vendor,
        });
        return;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({
                message: 'Vendor with same name already exists',
                error: error.errors[0].message,
                success: false,
            });
            return;
        }
        console.error('Create vendor error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search } = req.query;
        const organizationId = getOrganizationId(req);
        const result = await listVendors({
            organization_id: organizationId,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
        });
        
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error('List vendors error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req); 
        const vendor = await getVendorById(organizationId, id);

        if (!vendor) {
            res.status(404).json({ message: 'Vendor not found' });
            return;
        }

        res.status(200).json({ data: vendor });
        return;
    } catch (error) {
        console.error('Get vendor error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const vendor = await updateVendor(id, {...req.body, organization_id: organizationId});

        if (!vendor) {
            res.status(404).json({ message: 'Vendor not found' });
            return;
        }

        res.status(200).json({
            message: 'Vendor updated successfully',
            data: vendor,
        });
        return;
    } catch (error) {
        console.error('Update vendor error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const success = await deleteVendor(organizationId, id);

        if (!success) {
            res.status(404).json({ message: 'Vendor not found' });
            return;
        }

        res.status(200).json({ message: 'Vendor deleted successfully' });
        return;
    } catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
            res.status(400).json({
                success: false,
                message: 'Vendor is associated with other module, please delete first from other module',
            });
        }
        console.error('Delete vendor error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getThinVendors = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { search } = req.query;
        const organizationId = getOrganizationId(req);
        const vendors = await listThinVendors(organizationId, search as string | undefined);
        res.status(200).json({ data: vendors });
    } catch (error) {
        console.error('Error in getThinVendors controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getExport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;
        const organizationId = getOrganizationId(req);
        // Parse dates if provided
        const parsedStartDate = startDate
            ? new Date(startDate as string)
            : undefined;
        const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

        // Validate dates
        if (parsedStartDate && isNaN(parsedStartDate.getTime())) {
            res.status(400).json({ message: 'Invalid start date format' });
            return;
        }
        if (parsedEndDate && isNaN(parsedEndDate.getTime())) {
            res.status(400).json({ message: 'Invalid end date format' });
            return;
        }

        const buffer = await exportVendors(organizationId, parsedStartDate, parsedEndDate);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=vendors_export.xlsx',
        );
        res.send(buffer);
    } catch (error) {
        if (error.message === 'Date range cannot exceed 1 year') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
