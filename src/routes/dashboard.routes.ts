import { Router } from 'express';

import { requireRole, UserRole } from '@/middleware/role.middleware';
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
