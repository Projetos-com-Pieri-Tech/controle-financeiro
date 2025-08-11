import { UuidAdapter } from '../utils/uuid-adapter';

/**
 * Inicializa dados UUID para desenvolvimento
 */
export class UuidInitializer {
  static initialize() {
    // IDs conhecidos do sistema
    const knownMappings = [
      // Roles
      { id: 1, uuid: '3e1e1e1e-1111-4111-8111-111111111111' }, // admin
      { id: 2, uuid: '3e1e1e1e-1111-4111-8111-111111111112' }, // user
      
      // Usuários de teste
      { id: 1, uuid: '550e8400-e29b-41d4-a716-446655440000' }, // admin
      { id: 2, uuid: '550e8400-e29b-41d4-a716-446655440001' }, // user teste
      
      // Categorias
      { id: 1, uuid: '660e8400-e29b-41d4-a716-446655440000' }, // Alimentação
      { id: 2, uuid: '660e8400-e29b-41d4-a716-446655440001' }, // Transporte
      { id: 3, uuid: '660e8400-e29b-41d4-a716-446655440002' }, // Salário
      { id: 4, uuid: '660e8400-e29b-41d4-a716-446655440003' }, // Freelance
      
      // Contas
      { id: 1, uuid: '770e8400-e29b-41d4-a716-446655440000' }, // Conta Corrente
      { id: 2, uuid: '770e8400-e29b-41d4-a716-446655440001' }, // Poupança
      
      // Transações
      { id: 1, uuid: '880e8400-e29b-41d4-a716-446655440000' }, // Salário
      { id: 2, uuid: '880e8400-e29b-41d4-a716-446655440001' }, // Supermercado
    ];

    UuidAdapter.initializeMapping(knownMappings);
    
    console.log('🔄 UUID Adapter inicializado com', knownMappings.length, 'mapeamentos');
  }
}
