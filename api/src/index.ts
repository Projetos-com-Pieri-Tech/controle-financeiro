import dotenv from 'dotenv';
import { createDatabasePool, testConnection, closeDatabasePool } from './infrastructure/config/database';
import { createContainer } from './infrastructure/config/container';
import { createServer } from './infrastructure/config/server';

// Carregar variáveis de ambiente
dotenv.config();

async function startServer(): Promise<void> {
  try {
    console.log('🚀 Iniciando servidor...');

    // 1. Conectar ao banco de dados
    console.log('📡 Conectando ao banco de dados...');
    const dbPool = await createDatabasePool();
    
    // Testar conexão
    await testConnection();
    console.log('✅ Conexão com banco de dados estabelecida!');

    // 2. Criar container de dependências
    console.log('🔧 Configurando dependências...');
    const container = createContainer(dbPool);

    // 3. Criar e configurar servidor
    console.log('⚡ Configurando servidor Express...');
    const app = createServer(container);

    // 4. Iniciar servidor
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🎉 Servidor rodando na porta ${PORT}`);
      console.log(`📖 Documentação disponível em: http://localhost:${PORT}/api/docs`);
      console.log(`🏥 Health check em: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('🔑 Rotas disponíveis:');
      console.log('  POST /api/auth/register   - Registrar usuário');
      console.log('  POST /api/auth/login      - Login');
      console.log('  GET  /api/accounts        - Listar contas');
      console.log('  GET  /api/transactions    - Listar transações');
      console.log('  GET  /api/categories      - Listar categorias');
      console.log('  GET  /api/admin/stats     - Estatísticas (admin)');
      console.log('  GET  /api/admin/users     - Gerenciar usuários (admin)');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🔄 Recebido SIGTERM. Fechando servidor graciosamente...');
      await closeDatabasePool();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🔄 Recebido SIGINT. Fechando servidor graciosamente...');
      await closeDatabasePool();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Capturar erros não tratados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception thrown:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();
