import { Request, Response } from 'express';
import { PermissionService } from './permission.service';
import { UserRole } from '@/constants/roles';

export const getUserPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRole = req.user?.role as UserRole;
        
        if (!userRole) {
         res.status(401).json({
                message: 'Unauthorized - No role found',
            });
            return
        }

        const permissions = await PermissionService.getUserPermissions(userRole);

     res.status(200).json({
            message: 'Permissions retrieved successfully',
            data: permissions,
        });
        return
    } catch (error) {
         res.status(500).json({
            message: 'Error retrieving permissions',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return
    }
}; 