import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../../utils/logger';
import { createErrorResponse } from '../../../shared/types/error';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log estruturado do erro
  errorLogger.error(`Request error: ${message}`, err, {
    statusCode,
    path: req.path,
    method: req.method,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    body: req.body
  });
  
  const errorResponse = createErrorResponse(err, req.path);
  
  res.status(statusCode).json({
    ...errorResponse,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}