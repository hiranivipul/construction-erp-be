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
import { requirePermission } from '@/middlewares/permission.middleware';
import { Permission } from '@/constants/permissions';

const ProjectRouter = Router();

// Routes
ProjectRouter.post('/',requirePermission(Permission.PROJECT_CREATE),validateRequest(createProjectSchema),create);
ProjectRouter.get('/',requirePermission(Permission.PROJECT_READ),list);
ProjectRouter.get('/thin', requirePermission(Permission.PROJECT_READ), getThinProjects);
ProjectRouter.get('/export',requirePermission(Permission.PROJECT_READ),getExport);
ProjectRouter.get('/:id',requirePermission(Permission.PROJECT_READ),getById);
ProjectRouter.put('/:id',requirePermission(Permission.PROJECT_UPDATE, [Permission.PROJECT_READ]),validateRequest(updateProjectSchema),update);
ProjectRouter.delete('/:id', requirePermission(Permission.PROJECT_DELETE), remove);

export default ProjectRouter;
