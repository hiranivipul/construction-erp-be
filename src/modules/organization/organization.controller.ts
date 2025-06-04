import { Request, Response } from 'express';
import {
    createOrganization,
    listOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    listThinOrganizations,
} from './organization.service';
import { AppError } from '@utils/app-error';

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const organization = await createOrganization(req.body, req);
        res.status(201).json({
            message: 'Organization created successfully',
            data: organization,
            success: true,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
            });
            return;
        }
        // Handle all other errors
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search } = req.query;
        const result = await listOrganizations({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
        });

        res.status(200).json({
            ...result,
            success: true,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
            });
            return;
        }

        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organization = await getOrganizationById(id);

        res.status(200).json({
            data: organization,
            success: true,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
            });
            return;
        }

        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organization = await updateOrganization(id, req.body);

        res.status(200).json({
            message: 'Organization updated successfully',
            data: organization,
            success: true,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
            });
            return;
        }

        // Handle validation errors
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({
                message: error.message,
                success: false,
            });
            return;
        }

        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteOrganization(id);

        res.status(200).json({
            message: 'Organization deleted successfully',
            success: true,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
            });
            return;
        }

        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

export const getThinOrganizations = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { search } = req.query;
        const organizations = await listThinOrganizations(
            search as string | undefined,
        );
        res.status(200).json({
            data: organizations,
            success: true,
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message,
                success: false,
            });
            return;
        }

        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};
