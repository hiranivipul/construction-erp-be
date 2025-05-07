import { Router } from 'express';

import { requireRole, UserRole } from '@/middlewares/role.middleware';
import { getState } from '@/modules/dashboard/dashboard.controller';

const dashboardRouter = Router();

dashboardRouter.get(
    '/stats',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    getState,
);
export default dashboardRouter;
