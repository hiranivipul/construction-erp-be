import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '@/config/auth.config';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    // Skip authentication for login route
    if (req.path === '/api/auth/login') {
        return next();
    }

    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
        });
        return;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, authConfig.jwt.secret);

        // Add the decoded user information to the request
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.',
        });
        return;
    }
};
