import { Router } from 'express';
import {
    create,
    list,
    getById,
    update,
    remove,
    getThinVendors,
    getExport,
} from '@/modules/vendor/vendor.controller';
import { validateRequest } from '@utils/validation';
import {
    createVendorSchema,
    updateVendorSchema,
} from '@/modules/vendor/vendor.validation';
import { requireRole, UserRole } from '@/middleware/role.middleware';

const VendorRouter = Router();

// Routes
VendorRouter.post(
    '/',
    requireRole(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT),
    validateRequest(createVendorSchema),
    create,
);

VendorRouter.get(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    list,
);
VendorRouter.get('/thin', getThinVendors);
VendorRouter.get('/export', getExport);

VendorRouter.get(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    getById,
);

VendorRouter.put(
    '/:id',
    requireRole(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT),
    validateRequest(updateVendorSchema),
    update,
);

VendorRouter.delete('/:id', requireRole(UserRole.SUPER_ADMIN), remove);



export default VendorRouter;
