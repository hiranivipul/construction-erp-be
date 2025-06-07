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
import { requirePermission } from '@/middlewares/permission.middleware';
import { Permission } from '@/constants/permissions';

const VendorRouter = Router();

// Routes
VendorRouter.post('/', requirePermission(Permission.VENDOR_CREATE), validateRequest(createVendorSchema), create);
VendorRouter.get('/', requirePermission(Permission.VENDOR_READ), list);
VendorRouter.get('/thin', requirePermission(Permission.VENDOR_READ), getThinVendors);
VendorRouter.get('/export', requirePermission(Permission.VENDOR_READ), getExport);
VendorRouter.get('/:id', requirePermission(Permission.VENDOR_READ), getById);
VendorRouter.put('/:id', requirePermission(Permission.VENDOR_UPDATE, [Permission.VENDOR_READ]), validateRequest(updateVendorSchema), update);
VendorRouter.delete('/:id', requirePermission(Permission.VENDOR_DELETE), remove);

export default VendorRouter;
