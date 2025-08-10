import { Request, Response } from 'express';
import { AuthService } from '../../../application/services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, roleId = 2 } = req.body; // roleId 2 = usuário padrão
      
      if (!name || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const user = await this.authService.register(name, email, password, roleId);
      
      // Remover senha do retorno
      const { passwordHash, ...userWithoutPassword } = user;
      
      res.status(201).json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const { user, token } = await this.authService.login(email, password);
      
      // Remover senha do retorno
      const { passwordHash, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}