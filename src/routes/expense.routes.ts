import { Router } from 'express';
import {
    create,
    list,
    getById,
    update,
    remove,
    getExport,
} from '@/modules/expense/expense.controller';
import { validateRequest } from '@utils/validation';
import {
    createExpenseSchema,
    updateExpenseSchema,
} from '@/modules/expense/expense.validation';
import { requireRole, UserRole } from '@/middlewares/role.middleware';

const ExpenseRouter = Router();

// Routes
ExpenseRouter.post(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    validateRequest(createExpenseSchema),
    create,
);

ExpenseRouter.get(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    list,
);

ExpenseRouter.get(
    '/export',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    getExport,
);

ExpenseRouter.get(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    getById,
);

ExpenseRouter.put(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    validateRequest(updateExpenseSchema),
    update,
);

ExpenseRouter.delete(
    '/:id',
    requireRole(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT),
    remove,
);

export default ExpenseRouter;
