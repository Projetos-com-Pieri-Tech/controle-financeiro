import { Request, Response, NextFunction } from 'express';

interface ValidationError {
  details: { message: string }[];
}

interface ValidationSchema {
  validate(data: unknown): { error?: ValidationError };
}

export function validateRequest(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        error: 'Validation error',
        details: error.details.map((d) => d.message)
      });
      return;
    }
    
    next();
  };
}