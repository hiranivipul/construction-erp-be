export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    organizationId: string;
}

export interface LoginDto {
    email: string;
    password: string;
    organizationId: string;
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