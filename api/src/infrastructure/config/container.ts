import { Pool } from 'mysql2/promise';

// Repositories
import { MySQLUserRepository } from '../adapters/repositories/MySQLUserRepositoryUUID';
import { MySQLRoleRepositoryUUID } from '../adapters/repositories/MySQLRoleRepositoryUUID';
import { MySQLAccountRepository } from '../adapters/repositories/MySQLAccountRepositoryUUID';
import { MySQLTransactionRepository } from '../adapters/repositories/MySQLTransactionRepositoryUUID';
import { MySQLCategoryRepositoryUUID } from '../adapters/repositories/MySQLCategoryRepositoryUUID';

// Services
import { AuthService } from '../../application/services/AuthService';
import { AccountService } from '../../application/services/AccountService';
import { TransactionService } from '../../application/services/TransactionService';
import { CategoryService } from '../../application/services/CategoryService';
import { AdminService } from '../../application/services/AdminService';

// Controllers
import { AuthController } from '../adapters/controllers/AuthController';
import { AccountController } from '../adapters/controllers/AccountController';
import { TransactionController } from '../adapters/controllers/TransactionController';
import { CategoryController } from '../adapters/controllers/CategoryController';
import { AdminController } from '../adapters/controllers/AdminController';

export interface Container {
  // Database
  dbPool: Pool;
  
  // Repositories
  userRepository: MySQLUserRepository;
  roleRepository: MySQLRoleRepositoryUUID;
  accountRepository: MySQLAccountRepository;
  transactionRepository: MySQLTransactionRepository;
  categoryRepository: MySQLCategoryRepositoryUUID;
  
  // Services
  authService: AuthService;
  accountService: AccountService;
  transactionService: TransactionService;
  categoryService: CategoryService;
  adminService: AdminService;
  
  // Controllers
  authController: AuthController;
  accountController: AccountController;
  transactionController: TransactionController;
  categoryController: CategoryController;
  adminController: AdminController;
}

export function createContainer(dbPool: Pool): Container {
  // Inicializar repositories
  const userRepository = new MySQLUserRepository();
  const roleRepository = new MySQLRoleRepositoryUUID();
  const accountRepository = new MySQLAccountRepository();
  const transactionRepository = new MySQLTransactionRepository();
  const categoryRepository = new MySQLCategoryRepositoryUUID();
  
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
  const adminService = new AdminService(
    userRepository,
    accountRepository,
    transactionRepository,
    categoryRepository
  );
  
  // Inicializar controllers
  const authController = new AuthController(authService);
  const accountController = new AccountController(accountService);
  const transactionController = new TransactionController(transactionService);
  const categoryController = new CategoryController(categoryService);
  const adminController = new AdminController(adminService);
  
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
    adminService,
    authController,
    accountController,
    transactionController,
    categoryController,
    adminController
  };
}