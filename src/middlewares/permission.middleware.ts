import { Request, Response, NextFunction } from 'express';
import { Permission, RolePermissions } from '@/constants/permissions';
import { UserRole } from '@/constants/roles';

export const requirePermission = (
    permission: Permission,
    dependentPermissions?: Permission[],
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.user?.role as UserRole;

        if (!userRole) {
            res.status(401).json({
                message: 'Unauthorized - No role found',
            });
            return;
        }
        const userPermissions = RolePermissions[userRole] || [];
        const requiredPermissions = [
            permission,
            ...(dependentPermissions || []),
        ];

        const hasAllPermissions = requiredPermissions.every(perm =>
            userPermissions.includes(perm),
        );
        if (!hasAllPermissions) {
            res.status(403).json({
                message: 'Forbidden - Insufficient permissions',
            });
            return;
        }

        next();
    };
};
