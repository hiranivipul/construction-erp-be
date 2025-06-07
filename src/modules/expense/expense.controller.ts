import { Request, Response } from 'express';
import {
    createExpense,
    listExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    exportExpenses,
} from './expense.service';
import { validateExpenseInput } from './expense.validation';
import { getOrganizationId } from '@/utils/helper';

export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = validateExpenseInput(req.body);
        if (error?.details) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message,
                })),
            });
            return;
        }
        const organizationId = getOrganizationId(req);
        const expense = await createExpense(req.body, organizationId, req.user.id);

        res.status(201).json({
            message: 'Expense created successfully',
            data: expense,
        });
    } catch (error) {
        console.error('Create expense error:', error);
        if (error.message === 'Project ID is required for project expenses') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search, startDate, endDate } = req.query;
        const organizationId = getOrganizationId(req);
        const result = await listExpenses({
            organization_id: organizationId,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            search: search as string,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('List expenses error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const expense = await getExpenseById(organizationId, id);

        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
            return;
        }

        res.status(200).json({ data: expense });
        return;
    } catch (error) {
        console.error('Get expense error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = validateExpenseInput(req.body, true);
        if (error) {
            res.status(400).json({
                message: 'Validation failed',
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message,
                })),
            });
            return;
        }

        const organizationId = getOrganizationId(req);
        const expense = await updateExpense(id, req.body, organizationId);

        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
            return;
        }

        res.status(200).json({
            message: 'Expense updated successfully',
            data: expense,
        });
        return;
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = getOrganizationId(req);
        const success = await deleteExpense(organizationId, id);

        if (!success) {
            res.status(404).json({ message: 'Expense not found' });
            return;
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
        return;
    } catch (error) {
        console.error('Delete expense error:', error);
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

        const organizationId = getOrganizationId(req);
        const buffer = await exportExpenses(organizationId, parsedStartDate, parsedEndDate);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=expenses_export.xlsx',
        );
        res.send(buffer);
    } catch (error) {
        if (error.message === 'Date range cannot exceed 1 year') {
            res.status(400).json({ message: error.message });
        } else {
            console.error('Export expenses error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
