import { UserRole } from '@/constants/roles';

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization_id: string;
}

export interface LoginDto {
    email: string;
    password: string;
    code: string;
}

export interface AuthResponseDto {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    token: string;
}

export interface UserCreateResponseDto {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}
