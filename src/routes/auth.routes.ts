import { Router } from 'express';
import { register, login } from '@/modules/auth/auth.controller';
import { validateLoginInput } from '@/modules/auth/auth.validation';

const AuthRouter = Router();

// Routes
AuthRouter.post('/register', register);
AuthRouter.post('/login', validateLoginInput, login);

export default AuthRouter;
