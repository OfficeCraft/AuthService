import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateTokenAndsetCookie(userId: string): { token: string; cookieOptions: object } {
	const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15d'});
	const cookieOptions = {
		httpOnly: true,
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: 'strict' as const,
	};
	return { token, cookieOptions };
}

