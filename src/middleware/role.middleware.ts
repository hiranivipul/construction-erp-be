import { Request, Response, NextFunction, RequestHandler } from 'express';

interface AuthRequest extends Request {
    user?: {
        role: UserRole;
        [key: string]: any;
    };
}
export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ACCOUNTANT = 'accountant',
    PROJECT_MANAGER = 'project-manager',
    VENDOR = 'vendor',
}

export const requireRole = (...roles: UserRole[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole) {
            res.status(403).json({
                success: false,
                message: 'Access denied. User role not found.',
            });
            return;
        }

        if (!roles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: `Access denied. ${userRole} role does not have permission for this action.`,
            });
            return;
        }

        next();
    };
};
