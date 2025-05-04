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
import { requireRole, UserRole } from '@/middleware/role.middleware';

const router = Router();

// Create a new material type
router.post(
    '/',
    requireRole(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT),
    validateRequest(createMaterialTypeSchema),
    create,
);

// Get all material types
router.get(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
        UserRole.VENDOR,
    ),
    list,
);
router.get('/export', getExport);
router.get('/thin', getThinMaterialTypes);

// Get a material type by ID
router.get(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
        UserRole.VENDOR,
    ),
    getById,
);

// Update a material type
router.put(
    '/:id',
    requireRole(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT),
    validateRequest(updateMaterialTypeSchema),
    update,
);

// Delete a material type
router.delete('/:id', requireRole(UserRole.SUPER_ADMIN), remove);

export default router;
