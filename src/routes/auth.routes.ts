import { Router } from 'express';
import { register, login } from '@/modules/auth/auth.controller';
import { validateLoginInput } from '@/modules/auth/auth.validation';
import { schemaMiddleware } from '@/middleware/schema.middleware';

const AuthRouter = Router();
// AuthRouter.use(schemaMiddleware);
// Routes
AuthRouter.post('/register', register);
AuthRouter.post('/login', validateLoginInput, login);

export default AuthRouter;
