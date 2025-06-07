import { Request, Response } from 'express';
import {
    createMaterial,
    listMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
    exportMaterials,
    listThinMaterials,
} from './material.service';
import { validateImage } from './material.validation';
import { S3Service } from '@utils/third-party/s3/s3.service';
import { getOrganizationId } from '@/utils/helper';
import { AppError } from '@/utils/app-error';

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate receipt image if present
        if (req.body.receipt) {
            const validationResult = validateImage(req.body.receipt);
            if (!validationResult.isValid) {
                res.status(400).json({
                    message: 'Validation failed',
                    errors: validationResult.errors,
                });
                return;
            }
        }

        req.body.billDate = new Date();
        const organizationId = getOrganizationId(req);
        const material = await createMaterial({...req.body, organization_id: organizationId});

        // Add signed URL for receipt if present
        const materialData = material.toJSON();
        if (materialData.receipt) {
            const s3Service = new S3Service();
            const signedUrl = await s3Service.getSignedUrl(
                materialData.receipt,
            );
            materialData.receipt = signedUrl;
        }

        res.status(201).json({
            message: 'Material created successfully',
            data: materialData,
        });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create material',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search } = req.query;
        const organizationId = getOrganizationId(req);
        const result = await listMaterials({
            organization_id: organizationId,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
        });

        res.status(200).json(result);
        return;
    } catch (error) {
        console.error('List materials error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const material = await getMaterialById(organizationId, id);

        if (!material) {
            res.status(404).json({ message: 'Material not found' });
            return;
        }

        // Add signed URL for receipt if present
        const materialData = material.toJSON();
        if (materialData.receipt) {
            const s3Service = new S3Service();
            const signedUrl = await s3Service.getSignedUrl(
                materialData.receipt,
            );
            materialData.receipt = signedUrl;
        }

        res.status(200).json({ data: materialData });
        return;
    } catch (error) {
        console.error('Get material error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const material = await updateMaterial(id, {...req.body, organization_id: organizationId});

        if (!material) {
            res.status(404).json({ message: 'Material not found' });
            return;
        }

        res.status(200).json({
            message: 'Material updated successfully',
            data: material,
        });
        return;
    } catch (error) {
        console.error('Update material error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const success = await deleteMaterial(organizationId, id);

        if (!success) {
            res.status(404).json({ message: 'Material not found' });
            return;
        }

        res.status(200).json({ message: 'Material deleted successfully' });
        return;
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete material',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
};

export const getThinMaterialTypes = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { search } = req.query;
        const organizationId = getOrganizationId(req);
        const materialTypes = await listThinMaterials(
            organizationId,
            search as string | undefined,
        );
        res.status(200).json({ data: materialTypes });
    } catch (error) {
        console.error('Error in getThinMaterialTypes controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getExport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { startDate, endDate } = req.query;

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

        const organizationId = getOrganizationId(req);
        const buffer = await exportMaterials(organizationId, parsedStartDate, parsedEndDate);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=materials_export.xlsx',
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
