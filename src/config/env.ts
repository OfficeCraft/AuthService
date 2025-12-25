import dotenv from 'dotenv';

dotenv.config();

function requireEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required but not set.`);
    }
    return value;
}

export const env = {
    PORT: requireEnvVariable('PORT'),
    JWT_SECRET: requireEnvVariable('JWT_SECRET'),
    DB: {
        HOST: requireEnvVariable('DB_HOST'),
        PORT: parseInt(requireEnvVariable('DB_PORT'), 10),
        USER: requireEnvVariable('DB_USER'),
        PASSWORD: requireEnvVariable('DB_PASSWORD'),
        NAME: requireEnvVariable('DB_NAME'),
    },
};