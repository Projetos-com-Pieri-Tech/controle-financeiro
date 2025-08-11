import { Request, Response } from 'express';
import { AuthService } from '../../../application/services/AuthService';
import { RegisterRequest, LoginRequest, AuthResponse } from '../../../application/dtos';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, roleId = '3e1e1e1e-1111-4111-8111-111111111112' }: RegisterRequest = req.body; // roleId padrão para usuário comum
      
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const user = await this.authService.register(name, email, password, roleId);
      
      // Remover senha do retorno
      const { passwordHash, ...userWithoutPassword } = user;
      
      const response: AuthResponse = { user: userWithoutPassword };
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;
      
      if (!email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const { user, token } = await this.authService.login(email, password);
      
      // Remover senha do retorno
      const { passwordHash, ...userWithoutPassword } = user;
      
      const response: AuthResponse = { 
        user: userWithoutPassword,
        token 
      };
      res.json(response);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}