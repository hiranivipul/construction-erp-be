import { Request, Response } from 'express';
import { ProjectStatusEnum } from '@database/models/project.model';
import {
    createProject,
    listProjects,
    getProjectById,
    updateProject,
    deleteProject,
    exportProject,
    listThinProjects,
} from './project.service';
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await createProject(req.body);
        res.status(201).json({
            message: 'Project created successfully',
            data: project,
        });
        return;
    } catch (error) {
        console.error('Create project error:', error);

        // Check for Sequelize unique constraint error
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({
                message: 'Project name already exists',
                error: error.errors[0].message,
                success: false,
            });
            return;
        }

        // Handle all other errors
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            success: false,
        });
        return;
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search, status } = req.query;

        const result = await listProjects({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
            status: status as ProjectStatusEnum,
        });

        res.status(200).json(result);
        return;
    } catch (error) {
        console.error('List projects error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await getProjectById(id);

        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.status(200).json({ data: project });
        return;
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
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

        const buffer = await exportProject(parsedStartDate, parsedEndDate);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=projects_export.xlsx',
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

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await updateProject(id, req.body);

        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.status(200).json({
            message: 'Project updated successfully',
            project,
        });
        return;
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const success = await deleteProject(id);

        if (!success) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.status(200).json({ message: 'Project deleted successfully' });
        return;
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const getThinProjects = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { search } = req.query;
        const projects = await listThinProjects(search as string | undefined);
        res.status(200).json({ data: projects });
    } catch (error) {
        console.error('Error in getThinProjects controller:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
