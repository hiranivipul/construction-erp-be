import { Permission, RolePermissions } from '@/constants/permissions';
import { UserRole } from '@/constants/roles';

export class PermissionRepository {
    static async getUserPermissions(role: UserRole): Promise<Permission[]> {
        return RolePermissions[role] || [];
    }
}
