import { Router } from 'express';
import { register, login } from '@/modules/auth/auth.controller';
import { validateLoginInput } from '@/modules/auth/auth.validation';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Permission } from '@/constants/permissions';
import { requirePermission } from '@/middlewares/permission.middleware';

const AuthRouter = Router();
// Routes
AuthRouter.post('/register', AuthMiddleware, requirePermission(Permission.USER_CREATE), register);
AuthRouter.post('/login', validateLoginInput, login);

export default AuthRouter;
