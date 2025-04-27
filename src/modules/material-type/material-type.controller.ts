import { Request, Response } from 'express';
import {
    createMaterialType,
    listMaterialTypes,
    getMaterialTypeById,
    updateMaterialType,
    deleteMaterialType,
    listThinMaterialTypes,
    exportMaterialTypes,
} from './material-type.service';
import { AppError } from '@utils/app-error';

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const materialType = await createMaterialType(req.body);
        res.status(201).json({
            success: true,
            data: materialType,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            console.error('Error creating material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search } = req.query;
        const result = await listMaterialTypes({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
        });
        res.status(200).json(
            result
        );
    } catch (error) {
        console.error('Error fetching material types:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch material types',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const materialType = await getMaterialTypeById(req.params.id);
        res.status(200).json({
            success: true,
            data: materialType,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            console.error('Error fetching material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const materialType = await updateMaterialType(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: materialType,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            console.error('Error updating material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteMaterialType(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Material type deleted successfully',
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            console.error('Error deleting material type:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete material type',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
};

export const getThinMaterialTypes = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { search } = req.query;
        const materialTypes = await listThinMaterialTypes(search as string | undefined);
        res.status(200).json({
            success: true,
            data: materialTypes,
        });
    } catch (error) {
        console.error('Error in getThinMaterialTypes controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch thin material types',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
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
            res.status(400).json({
                success: false,
                message: 'Invalid start date format',
            });
            return;
        }
        if (parsedEndDate && isNaN(parsedEndDate.getTime())) {
            res.status(400).json({
                success: false,
                message: 'Invalid end date format',
            });
            return;
        }

        const buffer = await exportMaterialTypes(parsedStartDate, parsedEndDate);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=material_types_export.xlsx',
        );
        res.send(buffer);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to export material types',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
};
