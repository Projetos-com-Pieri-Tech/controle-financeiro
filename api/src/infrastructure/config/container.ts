import { Pool } from 'mysql2/promise';

// Repositories
import { MySQLUserRepository } from '../persistence/repositories/MySQLUserRepositoryUUID';
import { MySQLRoleRepositoryUUID } from '../persistence/repositories/MySQLRoleRepositoryUUID';
import { MySQLAccountRepository } from '../persistence/repositories/MySQLAccountRepositoryUUID';
import { MySQLTransactionRepository } from '../persistence/repositories/MySQLTransactionRepositoryUUID';
import { MySQLCategoryRepositoryUUID } from '../persistence/repositories/MySQLCategoryRepositoryUUID';

// Services
import { 
  AuthService,
  AccountService,
  TransactionService,
  CategoryService,
  AdminService
} from '../../application/services';

// Controllers
import { AuthController } from '../web/controllers/AuthController';
import { AccountController } from '../web/controllers/AccountController';
import { TransactionController } from '../web/controllers/TransactionController';
import { CategoryController } from '../web/controllers/CategoryController';
import { AdminController } from '../web/controllers/AdminController';

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
  const userRepository = new MySQLUserRepository(dbPool);
  const roleRepository = new MySQLRoleRepositoryUUID(dbPool);
  const accountRepository = new MySQLAccountRepository(dbPool);
  const transactionRepository = new MySQLTransactionRepository(dbPool);
  const categoryRepository = new MySQLCategoryRepositoryUUID(dbPool);
  
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