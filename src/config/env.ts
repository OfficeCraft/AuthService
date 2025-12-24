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
};