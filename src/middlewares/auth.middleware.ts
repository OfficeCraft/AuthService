import { Request, Response, NextFunction} from 'express';
import { verifyToken } from '../utils/tokenManager';

interface AuthenticatedRequest extends Request {
    userId: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['auth_token'];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        (req as AuthenticatedRequest).userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
    }
}

