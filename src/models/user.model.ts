import { db } from '../db';
import { User } from './user.types';

export async function insertUser(username: string, email: string, password: string, avatarUrl: string): Promise<string> {
    const result = await db.query(
        'INSERT INTO users (username, email, password_hash, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id',
        [username, email, password, avatarUrl]
    );
    return result.rows[0].id;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const result = await db.query<User>(
        'SELECT id, username, email, password_hash FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0] ?? null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const result = await db.query<User>(
        'SELECT id, username, email, password_hash FROM users WHERE username = $1',
        [username]
    );
    return result.rows[0] ?? null;
}

export async function checkForConnectedToDB(): Promise<void> {
    await db.query('SELECT 1');
}