import { Router } from 'express';
import {
    create,
    list,
    getById,
    update,
    remove,
    getThinMaterialTypes,
    getExport,
} from '@/modules/material-type/material-type.controller';
import { validateRequest } from '@utils/validation';
import {
    createMaterialTypeSchema,
    updateMaterialTypeSchema,
} from '@/modules/material-type/material-type.validation';
import { requirePermission } from '@/middlewares/permission.middleware';
import { Permission } from '@/constants/permissions';

const router = Router();

router.post('/',requirePermission(Permission.MATERIAL_TYPE_CREATE),validateRequest(createMaterialTypeSchema),create);
router.get('/',requirePermission(Permission.MATERIAL_TYPE_READ),list);
router.get('/export', requirePermission(Permission.MATERIAL_TYPE_READ), getExport);
router.get('/thin', requirePermission(Permission.MATERIAL_TYPE_READ), getThinMaterialTypes);
router.get('/:id',requirePermission(Permission.MATERIAL_TYPE_READ),getById);
router.put('/:id', requirePermission(Permission.MATERIAL_TYPE_UPDATE, [Permission.MATERIAL_TYPE_READ]),validateRequest(updateMaterialTypeSchema), update);
router.delete('/:id', requirePermission(Permission.MATERIAL_TYPE_DELETE), remove);

export default router;
