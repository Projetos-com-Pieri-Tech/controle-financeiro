import { Pool } from 'pg';

// Repositories
import { PostgresUserRepository } from '../adapters/repositories/PostgresUserRepository';
import { PostgresRoleRepository } from '../adapters/repositories/PostgresRoleRepository';
import { PostgresAccountRepository } from '../adapters/repositories/PostgresAccountRepository';
import { PostgresTransactionRepository } from '../adapters/repositories/PostgresTransactionRepository';
import { PostgresCategoryRepository } from '../adapters/repositories/PostgresCategoryRepository';

// Services
import { AuthService } from '../../application/services/AuthService';
import { AccountService } from '../../application/services/AccountService';
import { TransactionService } from '../../application/services/TransactionService';
import { CategoryService } from '../../application/services/CategoryService';

// Controllers
import { AuthController } from '../adapters/controllers/AuthController';
import { AccountController } from '../adapters/controllers/AccountController';
import { TransactionController } from '../adapters/controllers/TransactionController';
import { CategoryController } from '../adapters/controllers/CategoryController';

export interface Container {
  // Database
  dbPool: Pool;
  
  // Repositories
  userRepository: PostgresUserRepository;
  roleRepository: PostgresRoleRepository;
  accountRepository: PostgresAccountRepository;
  transactionRepository: PostgresTransactionRepository;
  categoryRepository: PostgresCategoryRepository;
  
  // Services
  authService: AuthService;
  accountService: AccountService;
  transactionService: TransactionService;
  categoryService: CategoryService;
  
  // Controllers
  authController: AuthController;
  accountController: AccountController;
  transactionController: TransactionController;
  categoryController: CategoryController;
}

export function createContainer(dbPool: Pool): Container {
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
    dbPool,
    userRepository,
    roleRepository,
    accountRepository,
    transactionRepository,
    categoryRepository,
    authService,
    accountService,
    transactionService,
    categoryService,
    authController,
    accountController,
    transactionController,
    categoryController
  };
}