import { Request, Response } from 'express';
import { AuthService } from '../../../application/services/AuthService';
import { AuthResponse } from '../../../application/dtos';
import { createErrorResponse } from '../../../shared/types/error';
import { ValidationError, UnauthorizedError } from '../errors';
import { DEFAULT_ROLE_ID } from '../../../shared/constants/roles';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, roleId = DEFAULT_ROLE_ID } = req.body;
      
      // Basic validation
      if (!name || !email || !password) {
        throw new ValidationError('Missing required fields: name, email, password');
      }
      
      const user = await this.authService.register(name, email, password, roleId);
      
      // Remover senha do retorno
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      const response: AuthResponse = { user: userWithoutPassword };
      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json(createErrorResponse(error, req.path));
      } else if (error instanceof Error) {
        res.status(400).json(createErrorResponse(error, req.path));
      } else {
        res.status(500).json(createErrorResponse('Internal server error', req.path));
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Basic validation
      if (!email || !password) {
        throw new ValidationError('Missing required fields: email, password');
      }

      const { user, token } = await this.authService.login(email, password);
      
      // Remover senha do retorno
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _pwd, ...userWithoutPassword } = user;
      
      const response: AuthResponse = { 
        user: userWithoutPassword,
        token 
      };
      res.json(response);
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) {
        res.status(error.statusCode).json(createErrorResponse(error, req.path));
      } else if (error instanceof Error) {
        res.status(401).json(createErrorResponse(error, req.path));
      } else {
        res.status(500).json(createErrorResponse('Internal server error', req.path));
      }
    }
  }
}
