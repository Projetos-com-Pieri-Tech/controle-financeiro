import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Pool } from 'pg';

// Importar configurações
import { errorHandler } from './infrastructure/middleware/errorHandler';
import { apiRateLimiter } from './infrastructure/middleware/rateLimiter';

// Importar Repositories
import { PostgresUserRepository } from './infrastructure/adapters/repositories/PostgresUserRepository';
import { PostgresRoleRepository } from './infrastructure/adapters/repositories/PostgresRoleRepository';
import { PostgresAccountRepository } from './infrastructure/adapters/repositories/PostgresAccountRepository';
import { PostgresTransactionRepository } from './infrastructure/adapters/repositories/PostgresTransactionRepository';
import { PostgresCategoryRepository } from './infrastructure/adapters/repositories/PostgresCategoryRepository';

// Importar Services
import { AuthService } from './application/services/AuthService';
import { AccountService } from './application/services/AccountService';
import { TransactionService } from './application/services/TransactionService';
import { CategoryService } from './application/services/CategoryService';

// Importar Controllers
import { AuthController } from './infrastructure/adapters/controllers/AuthController';
import { AccountController } from './infrastructure/adapters/controllers/AccountController';
import { TransactionController } from './infrastructure/adapters/controllers/TransactionController';
import { CategoryController } from './infrastructure/adapters/controllers/CategoryController';

// Importar Routes
import { createAuthRoutes } from './infrastructure/routes/authRoutes';
import { createAccountRoutes } from './infrastructure/routes/accountRoutes';
import { createTransactionRoutes } from './infrastructure/routes/transactionRoutes';
import { createCategoryRoutes } from './infrastructure/routes/categoryRoutes';

// Carregar variáveis de ambiente
dotenv.config();

// Função para criar o pool de conexões do banco
function createDatabasePool(): Pool {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'controle_financeiro',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

// Função para criar o servidor Express
function createServer(): express.Application {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));
  
  // Rate limiting geral
  app.use('/api', apiRateLimiter);
  
  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }
  
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  return app;
}

// Função para inicializar o container de dependências
function initializeContainer(dbPool: Pool) {
  // Inicializar repositories
  const userRepository = new PostgresUserRepository(dbPool);
  const roleRepository = new PostgresRoleRepository(dbPool);
  const accountRepository = new PostgresAccountRepository(dbPool);
  const transactionRepository = new PostgresTransactionRepository(dbPool);
  const categoryRepository = new PostgresCategoryRepository(dbPool);
  
  // Inicializar services
  const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
  const authService = new AuthService(userRepository, jwtSecret);
  const accountService = new AccountService(accountRepository, transactionRepository);
  const transactionService = new TransactionService(
    transactionRepository,
    accountRepository,
    categoryRepository
  );
  const categoryService = new CategoryService(categoryRepository);
  
  // Inicializar controllers
  const authController = new AuthController(authService);
  const accountController = new AccountController(accountService);
  const transactionController = new TransactionController(transactionService);
  const categoryController = new CategoryController(categoryService);
  
  return {
    authController,
    accountController,
    transactionController,
    categoryController,
    authService
  };
}

// Função para configurar as rotas
function setupRoutes(app: express.Application, container: ReturnType<typeof initializeContainer>) {
  const router = express.Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // API info
  router.get('/', (req, res) => {
    res.json({
      name: 'Controle Financeiro API',
      version: '1.0.0',
      description: 'API para controle financeiro pessoal',
      endpoints: {
        auth: '/api/auth',
        accounts: '/api/accounts',
        transactions: '/api/transactions',
        categories: '/api/categories',
        health: '/api/health'
      }
    });
  });

  // Configurar rotas específicas
  router.use('/auth', createAuthRoutes(container.authController));
  router.use('/accounts', createAccountRoutes(container.accountController, container.authService));
  router.use('/transactions', createTransactionRoutes(container.transactionController, container.authService));
  router.use('/categories', createCategoryRoutes(container.categoryController, container.authService));

  // Aplicar rotas ao app
  app.use('/api', router);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Route not found',
      path: req.path,
      method: req.method
    });
  });

  // Error handler (deve ser o último middleware)
  app.use(errorHandler);
}

// Função principal para iniciar o servidor
async function startServer() {
  try {
    console.log('🚀 Starting Controle Financeiro API...');
    
    // Criar pool de conexões do banco
    const dbPool = createDatabasePool();
    
    // Testar conexão com o banco
    try {
      const result = await dbPool.query('SELECT NOW()');
      console.log('✅ Database connected successfully at', result.rows[0].now);
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      throw new Error('Failed to connect to database');
    }
    
    // Criar servidor Express
    const app = createServer();
    
    // Inicializar container de dependências
    const container = initializeContainer(dbPool);
    
    // Configurar rotas
    setupRoutes(app, container);
    
    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
      console.log(`🔍 Health check at http://localhost:${PORT}/api/health`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} signal received: closing HTTP server`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await dbPool.end();
          console.log('Database connections closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
      
      // Forçar shutdown após 10 segundos
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Registrar handlers de shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handler para erros não capturados
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Iniciar o servidor
startServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});