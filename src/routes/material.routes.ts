import { Router } from 'express';
import {
    create,
    list,
    getById,
    update,
    remove,
    getThinMaterialTypes,
    getExport,
} from '@/modules/material/material.controller';
import { validateRequest } from '@utils/validation';
import {
    createMaterialSchema,
    updateMaterialSchema,
} from '@/modules/material/material.validation';
import { Permission } from '@/constants/permissions';
import { requirePermission } from '@/middlewares/permission.middleware';

const MaterialRouter = Router();

// Routes
MaterialRouter.post('/',requirePermission(Permission.MATERIAL_CREATE),validateRequest(createMaterialSchema),create);
MaterialRouter.get('/',requirePermission(Permission.MATERIAL_READ),list);
MaterialRouter.get('/thin',requirePermission(Permission.MATERIAL_READ), getThinMaterialTypes);
MaterialRouter.get('/export',requirePermission(Permission.MATERIAL_READ), getExport);
MaterialRouter.get('/:id',requirePermission(Permission.MATERIAL_READ),getById);
MaterialRouter.put('/:id',requirePermission(Permission.MATERIAL_UPDATE, [Permission.MATERIAL_READ]),validateRequest(updateMaterialSchema),update);
MaterialRouter.delete('/:id',requirePermission(Permission.MATERIAL_DELETE),remove);

export default MaterialRouter;
