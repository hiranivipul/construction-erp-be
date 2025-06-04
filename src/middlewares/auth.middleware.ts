import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '@utils/config';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        organizationId: string;
    };
    organizationId?: string;
}

export const AuthMiddleware: RequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Invalid token format' });
            return;
        }

        const decoded = verify(token, config.jwt.secret) as {
            id: string;
            email: string;
            role: string;
            organizationId: string;
        };

        req.user = decoded;
        req.organizationId = decoded.organizationId;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.',
        });
        return;
    }
};
