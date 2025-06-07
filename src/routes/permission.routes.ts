import { Router } from 'express';
import { getUserPermissions } from '@/modules/permission/permission.controller';

const permissionRouter = Router();

permissionRouter.get('/', getUserPermissions);

export default permissionRouter;
