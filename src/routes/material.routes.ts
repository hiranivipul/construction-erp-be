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
import { requireRole, UserRole } from '@/middlewares/role.middleware';

const MaterialRouter = Router();

// Routes
MaterialRouter.post(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    validateRequest(createMaterialSchema),
    create,
);

MaterialRouter.get(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
        UserRole.VENDOR,
    ),
    list,
);
MaterialRouter.get('/thin', getThinMaterialTypes);

MaterialRouter.get('/export', getExport);

MaterialRouter.get(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
        UserRole.VENDOR,
    ),
    getById,
);

MaterialRouter.put(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    validateRequest(updateMaterialSchema),
    update,
);

MaterialRouter.delete(
    '/:id',
    requireRole(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT),
    remove,
);


export default MaterialRouter;
