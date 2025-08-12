export class LogoutUser {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_token: string): Promise<void> {
    // Em uma implementação mais robusta, este use case poderia:
    // 1. Adicionar o token a uma blacklist
    // 2. Remover refresh tokens do banco
    // 3. Invalidar sessões ativas
    
    // Por enquanto, o logout é feito apenas no frontend
    // removendo o token do storage local
    
    // TODO: Implementar blacklist de tokens ou sistema de sessões
  }
}
