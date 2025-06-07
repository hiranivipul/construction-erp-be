import express from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import AuthRouter from './auth.routes';
import ProjectRouter from './project.routes';
import MaterialRouter from './material.routes';
import MaterialTypeRouter from './material-type.routes';
import VendorRouter from './vendor.routes';
import dashboardRouter from './dashboard.routes';
import ExpenseRouter from './expense.routes';
import OrganizationRouter from './organization.routes';
import PermissionRouter from './permission.routes';
const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/projects', AuthMiddleware, ProjectRouter);
router.use('/dashboard', AuthMiddleware, dashboardRouter);
router.use('/materials', AuthMiddleware, MaterialRouter);
router.use('/materials-type', AuthMiddleware, MaterialTypeRouter);
router.use('/vendors', AuthMiddleware, VendorRouter);
router.use('/expenses', AuthMiddleware, ExpenseRouter);
router.use('/permissions', AuthMiddleware, PermissionRouter);
router.use('/organization', AuthMiddleware, OrganizationRouter);

export default router;
