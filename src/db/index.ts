import { Pool } from 'pg';
import { env } from '../config/env';

export const db = new Pool({
    host: env.DB.HOST,
    port: env.DB.PORT,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
});