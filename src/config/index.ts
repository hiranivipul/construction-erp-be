import { config as dotenvConfig } from 'dotenv';

const envFile = `.env`;
dotenvConfig({ path: envFile });

const getEnv = (key: string, defaultValue?: string) => {
    return process.env[key] || defaultValue;
};

export const PORT = getEnv('PORT');
export const NODE_ENV = getEnv('NODE_ENV');
export const BASE_URL = getEnv('BASE_URL');

export const DB_PORT = getEnv('DB_PORT');
export const DB_USERNAME = getEnv('DB_USERNAME');
export const DB_PASSWORD = getEnv('DB_PASSWORD');
export const DB_NAME = getEnv('DB_NAME');
export const DB_HOST = getEnv('DB_HOST');
export const DB_DIALECT = getEnv('DB_DIALECT');

export const MAIN_APP_URL = getEnv('MAIN_APP_URL');

interface Config {
    jwt: {
        secret: string;
        expiresIn: string;
    };
}

export const config: Config = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '24h',
    },
};
