import { UserRole } from '@/constants/roles';

export enum Permission {
    // Dashboard permissions
    DASHBOARD_READ = 'dashboard.read',

    // Organization permissions
    ORGANIZATION_READ = 'organization.read',
    ORGANIZATION_CREATE = 'organization.create',
    ORGANIZATION_UPDATE = 'organization.update',
    ORGANIZATION_DELETE = 'organization.delete',

    // Project permissions
    PROJECT_READ = 'project.read',
    PROJECT_CREATE = 'project.create',
    PROJECT_UPDATE = 'project.update',
    PROJECT_DELETE = 'project.delete',

    // Material permissions
    MATERIAL_READ = 'material.read',
    MATERIAL_CREATE = 'material.create',
    MATERIAL_UPDATE = 'material.update',
    MATERIAL_DELETE = 'material.delete',

    //Material Type permissions
    MATERIAL_TYPE_READ = 'material_type.read',
    MATERIAL_TYPE_CREATE = 'material_type.create',
    MATERIAL_TYPE_UPDATE = 'material_type.update',
    MATERIAL_TYPE_DELETE = 'material_type.delete',

    // Expense permissions
    EXPENSE_READ = 'expense.read',
    EXPENSE_CREATE = 'expense.create',
    EXPENSE_UPDATE = 'expense.update',
    EXPENSE_DELETE = 'expense.delete',

    //vendor permissions
    VENDOR_READ = 'vendor.read',
    VENDOR_CREATE = 'vendor.create',
    VENDOR_UPDATE = 'vendor.update',
    VENDOR_DELETE = 'vendor.delete',

    //user permissions
    USER_READ = 'user.read',
    USER_CREATE = 'user.create',
    USER_UPDATE = 'user.update',
}

// Define role-based permissions mapping
export const RolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.SUPER_ADMIN]: Object.values(Permission), // Super admin has all permissions
    [UserRole.ADMIN]: [
        Permission.DASHBOARD_READ,

        Permission.PROJECT_READ,
        Permission.PROJECT_CREATE,
        Permission.PROJECT_UPDATE,
        Permission.PROJECT_DELETE,

        Permission.MATERIAL_READ,
        Permission.MATERIAL_CREATE,
        Permission.MATERIAL_UPDATE,
        Permission.MATERIAL_DELETE,

        Permission.EXPENSE_READ,
        Permission.EXPENSE_CREATE,
        Permission.EXPENSE_UPDATE,
        Permission.EXPENSE_DELETE,

        Permission.VENDOR_READ,
        Permission.VENDOR_CREATE,
        Permission.VENDOR_UPDATE,
        Permission.VENDOR_DELETE,

        Permission.MATERIAL_TYPE_READ,
        Permission.MATERIAL_TYPE_CREATE,
        Permission.MATERIAL_TYPE_UPDATE,
        Permission.MATERIAL_TYPE_DELETE,
        //
        Permission.USER_READ,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
    ],
    [UserRole.ACCOUNTANT]: [
        Permission.DASHBOARD_READ,

        Permission.PROJECT_READ,

        Permission.EXPENSE_READ,
        Permission.EXPENSE_CREATE,
        Permission.EXPENSE_UPDATE,

        Permission.MATERIAL_READ,
        Permission.MATERIAL_CREATE,
        Permission.MATERIAL_UPDATE,
    ],
    [UserRole.PROJECT_MANAGER]: [
        Permission.DASHBOARD_READ,

        Permission.PROJECT_READ,
        Permission.PROJECT_UPDATE,

        Permission.MATERIAL_READ,
        Permission.MATERIAL_CREATE,
        Permission.MATERIAL_UPDATE,

        Permission.EXPENSE_READ,
        Permission.EXPENSE_CREATE,
    ],
    [UserRole.SUPERVISOR]: [
        Permission.DASHBOARD_READ,

        Permission.PROJECT_READ,

        Permission.MATERIAL_READ,
        Permission.MATERIAL_CREATE,

        Permission.EXPENSE_READ,
        Permission.EXPENSE_CREATE,
    ],
    [UserRole.SITE_ENGINEER]: [
        Permission.DASHBOARD_READ,
        Permission.PROJECT_READ,
        Permission.MATERIAL_READ,
        Permission.EXPENSE_READ,
    ],
};
