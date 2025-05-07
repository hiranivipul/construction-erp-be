import { Router } from 'express';
import { validateRequest } from '@utils/validation';
import {
    createProjectSchema,
    updateProjectSchema,
} from '@/modules/project/project.validation';
import {
    create,
    list,
    getById,
    update,
    remove,
    getExport,
    getThinProjects,
} from '@/modules/project/project.controller';
import { requireRole, UserRole } from '@/middlewares/role.middleware';

const ProjectRouter = Router();

// Routes
ProjectRouter.post(
    '/',
    requireRole(UserRole.SUPER_ADMIN, UserRole.PROJECT_MANAGER),
    validateRequest(createProjectSchema),
    create,
);

ProjectRouter.get(
    '/',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    list,
);
ProjectRouter.get('/thin', getThinProjects);

ProjectRouter.get(
    '/export',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    getExport,
);
ProjectRouter.get(
    '/:id',
    requireRole(
        UserRole.SUPER_ADMIN,
        UserRole.ACCOUNTANT,
        UserRole.PROJECT_MANAGER,
    ),
    getById,
);

ProjectRouter.put(
    '/:id',
    requireRole(UserRole.SUPER_ADMIN, UserRole.PROJECT_MANAGER),
    validateRequest(updateProjectSchema),
    update,
);

ProjectRouter.delete('/:id', requireRole(UserRole.SUPER_ADMIN), remove);

export default ProjectRouter;
