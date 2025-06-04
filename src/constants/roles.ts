// import { UserRole as JSUserRole } from './roles.js';

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    ACCOUNTANT = 'accountant',
    PROJECT_MANAGER = 'project_manager',
    SUPERVISOR = 'supervisor',
    SITE_ENGINEER = 'site_engineer',
}

export const UserRoleWithoutSuperAdmin = Object.values(UserRole).filter(
    role => role !== UserRole.SUPER_ADMIN,
);

// Export the same values for JavaScript files
export const UserRoleValues = {
    SUPER_ADMIN: UserRole.SUPER_ADMIN,
    ADMIN: UserRole.ADMIN,
    ACCOUNTANT: UserRole.ACCOUNTANT,
    PROJECT_MANAGER: UserRole.PROJECT_MANAGER,
    SUPERVISOR: UserRole.SUPERVISOR,
    SITE_ENGINEER: UserRole.SITE_ENGINEER,
};
