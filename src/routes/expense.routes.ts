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
import { requirePermission } from '@/middlewares/permission.middleware';
import { Permission } from '@/constants/permissions';

const ExpenseRouter = Router();

// Routes
ExpenseRouter.post('/',requirePermission(Permission.EXPENSE_CREATE),validateRequest(createExpenseSchema),create);
ExpenseRouter.get('/',requirePermission(Permission.EXPENSE_READ),list);
ExpenseRouter.get('/export',requirePermission(Permission.EXPENSE_READ),getExport);
ExpenseRouter.get('/:id',requirePermission(Permission.EXPENSE_READ),getById);
ExpenseRouter.put('/:id',requirePermission(Permission.EXPENSE_UPDATE),validateRequest(updateExpenseSchema),update);
ExpenseRouter.delete('/:id',requirePermission(Permission.EXPENSE_DELETE),remove);

export default ExpenseRouter;
