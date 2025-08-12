import jwt from 'jsonwebtoken';

export interface RefreshTokenData {
  userId: string;
  email: string;
  roleId: string;
}

export class RefreshToken {
  constructor(private readonly jwtSecret: string) {}

  async execute(currentToken: string): Promise<string> {
    try {
      // Verificar se o token atual é válido
      const decoded = jwt.verify(currentToken, this.jwtSecret) as RefreshTokenData;
      
      // Gerar novo token com os mesmos dados
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          email: decoded.email,
          roleId: decoded.roleId
        },
        this.jwtSecret,
        { expiresIn: '7d' }
      );

      return newToken;
    } catch (error) {
      throw new Error('Invalid token for refresh');
    }
  }
}
