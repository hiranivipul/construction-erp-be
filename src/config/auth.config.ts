interface AuthConfig {
    jwt: {
        secret: string;
        expiresIn: string;
    };
}

export const authConfig: AuthConfig = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h',
    },
};
