import { Router } from 'express';
import { register, login } from '@/modules/auth/auth.controller';
import { validateLoginInput } from '@/modules/auth/auth.validation';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

const AuthRouter = Router();
// Routes
AuthRouter.post('/register', AuthMiddleware, register);
AuthRouter.post('/login', validateLoginInput, login);

export default AuthRouter;
