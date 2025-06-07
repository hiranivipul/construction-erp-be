import { Permission } from '@/constants/permissions';
import { UserRole } from '@/constants/roles';
import { PermissionRepository } from './permission.repository';

export class PermissionService {
    static async getUserPermissions(role: UserRole): Promise<Permission[]> {
        return PermissionRepository.getUserPermissions(role);
    }
} 