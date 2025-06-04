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
const router = Router();

// Create organization
router.post('/', validateRequest(createOrganizationSchema), create);

// List organizations
router.get('/', list);

// Get thin organizations list (for dropdowns)
router.get('/thin', getThinOrganizations);

// Get organization by ID
router.get('/:id', getById);

// Update organization
router.put('/:id', validateRequest(createOrganizationSchema), update);

// Delete organization
router.delete('/:id', remove);

export default router;
