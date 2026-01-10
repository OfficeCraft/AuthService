import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateTokenAndsetCookie(userId: string): { token: string; cookieOptions: object } {
	const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '15d'});
	const cookieOptions = {
		httpOnly: true,
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		secure: false, // Set to true if using HTTPS
		sameSite: 'lax' as const,
	};
	return { token, cookieOptions };
}

export function verifyToken(token: string): { userId: string } | null {
	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
		return { userId: decoded.userId };
	} catch (error) {
		return null;
	}
}

