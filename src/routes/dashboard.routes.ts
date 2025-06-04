import { Router } from 'express';

import { requireRole } from '@/middlewares/role.middleware';
import { getState } from '@/modules/dashboard/dashboard.controller';
import { UserRole } from '@/constants/roles';

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
