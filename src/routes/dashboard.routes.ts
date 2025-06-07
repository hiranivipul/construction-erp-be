import { Router } from 'express';

import { requirePermission } from '@/middlewares/permission.middleware';
import { getState } from '@/modules/dashboard/dashboard.controller';
import { Permission } from '@/constants/permissions';

const dashboardRouter = Router();

dashboardRouter.get('/stats', requirePermission(Permission.DASHBOARD_READ), getState);

export default dashboardRouter;
