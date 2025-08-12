import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../application/dtos';

export function requireAdmin() {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (req.user.roleId !== '3e1e1e1e-1111-4111-8111-111111111111') {
        res.status(403).json({ 
          error: 'Forbidden',
          message: 'You need administrator privileges to access this resource'
        });
        return;
      }

      next();
    } catch (error) {
      // Log authorization error for security monitoring
      const errorMessage = error instanceof Error ? error.message : 'Authorization check failed';
      console.error('Admin authorization check failed:', errorMessage);
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
      // Log authorization error for security monitoring
      const errorMessage = error instanceof Error ? error.message : 'Authorization check failed';
      console.error('Role authorization check failed:', errorMessage);
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
          message: 'You can only access your own resources or need special privileges'
        });
        return;
      }

      next();
    } catch (error) {
      // Log authorization error for security monitoring
      const errorMessage = error instanceof Error ? error.message : 'Authorization check failed';
      console.error('Ownership authorization check failed:', errorMessage);
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}
