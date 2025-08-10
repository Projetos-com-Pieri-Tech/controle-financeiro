import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roleId: number;
  };
}

export function createAuthMiddleware(authService: AuthService) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const [bearer, token] = authHeader.split(' ');
      
      if (bearer !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Invalid token format' });
        return;
      }

      const payload = authService.verifyToken(token);
      req.user = payload;
      
      next();
    } catch (error: any) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}