import express from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import AuthRouter from './auth.routes';
import ProjectRouter from './project.routes';
import MaterialRouter from './material.routes';
import MaterialTypeRouter from './material-type.routes';
import VendorRouter from './vendor.routes';
import dashboardRouter from './dashboard.routes';
import ExpenseRouter from './expense.routes';
const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/projects', authenticateToken, ProjectRouter);
router.use('/dashboard', authenticateToken, dashboardRouter);
router.use('/materials', authenticateToken, MaterialRouter);
router.use('/materials-type', authenticateToken, MaterialTypeRouter);
router.use('/vendors', authenticateToken, VendorRouter);
router.use('/expenses', authenticateToken, ExpenseRouter);

export default router;
