import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../application/dtos';

export function requireAdmin() {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (req.user.roleId !== "admin") { // "admin" = admin role
        res.status(403).json({ 
          error: 'Admin access required',
          message: 'You need administrator privileges to access this resource'
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}

export function requireRole(roleId: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (req.user.roleId !== roleId) {
        res.status(403).json({ 
          error: 'Insufficient privileges',
          requiredRole: roleId,
          userRole: req.user.roleId
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}

export function requireRoleOrOwnership(roleId: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const resourceUserId = req.params.userId || req.body.userId;
      const isOwner = req.user.userId === resourceUserId;
      const hasRequiredRole = req.user.roleId === roleId;

      if (!isOwner && !hasRequiredRole) {
        res.status(403).json({ 
          error: 'Access denied',
          message: 'You can only access your own resources or need higher privileges'
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}
