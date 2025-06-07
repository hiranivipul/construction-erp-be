import { Router } from 'express';
import {
    create,
    list,
    getById,
    update,
    remove,
    getThinOrganizations,
} from '@/modules/organization/organization.controller';
import { createOrganizationSchema } from '@/modules/organization/organization.validation';
import { validateRequest } from '@utils/validation';
import { Permission } from '@/constants/permissions';
import { requirePermission } from '@/middlewares/permission.middleware';
const router = Router();

router.post('/', requirePermission(Permission.ORGANIZATION_CREATE), validateRequest(createOrganizationSchema), create);
router.get('/', requirePermission(Permission.ORGANIZATION_READ), list);
router.get('/thin', requirePermission(Permission.ORGANIZATION_READ), getThinOrganizations);
router.get('/:id', requirePermission(Permission.ORGANIZATION_READ), getById);
router.put('/:id', requirePermission(Permission.ORGANIZATION_UPDATE, [Permission.ORGANIZATION_READ]), validateRequest(createOrganizationSchema), update);
router.delete('/:id', requirePermission(Permission.ORGANIZATION_DELETE), remove);

export default router;
