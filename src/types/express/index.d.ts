declare namespace Express {
    export interface Request {
        schema?: string;
        user?: {
            id: string;
            email: string;
            role: string;
            organizationId: string;
        };
    }
} 