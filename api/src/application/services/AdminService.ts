import { UserRepository } from '../../domain/ports/UserRepository';
import { AccountRepository } from '../../domain/ports/AccountRepository';
import { TransactionRepository } from '../../domain/ports/TransactionRepository';
import { CategoryRepository } from '../../domain/ports/CategoryRepository';
import { User } from '../../domain/entities/user';
import { Category } from '../../domain/entities/category';
import { TransactionType } from '../../domain/enums';

export interface SystemStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalCategories: number;
  totalRevenue: number;
  totalExpenses: number;
  lastMonthUsers: number;
  lastMonthTransactions: number;
}

export interface UserActivity {
  userId: string; // UUID
  userName: string;
  email: string;
  lastLoginAt?: Date;
  accountsCount: number;
  transactionsCount: number;
  totalRevenue: number;
  totalExpenses: number;
  createdAt: Date;
}

export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async getSystemStats(): Promise<SystemStats> {
    const [users, accounts, transactions, categories] = await Promise.all([
      this.userRepository.findAll(),
      this.accountRepository.findAll(),
      this.transactionRepository.findAll(),
      this.categoryRepository.findAll()
    ]);

    // Calcular receitas e despesas totais
    const totalRevenue = transactions
      .filter(t => t.type === TransactionType.RECEITA)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.DESPESA)
      .reduce((sum, t) => sum + t.amount, 0);

    // Usuários criados no último mês
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthUsers = users.filter(u => u.createdAt >= lastMonth).length;

    // Transações do último mês
    const lastMonthTransactions = transactions.filter(t => t.createdAt >= lastMonth).length;

    return {
      totalUsers: users.length,
      totalAccounts: accounts.length,
      totalTransactions: transactions.length,
      totalCategories: categories.length,
      totalRevenue,
      totalExpenses,
      lastMonthUsers,
      lastMonthTransactions
    };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserActivity(): Promise<UserActivity[]> {
    const users = await this.userRepository.findAll();
    
    const activities = await Promise.all(
      users.map(async (user) => {
        const [accounts, transactions] = await Promise.all([
          this.accountRepository.findByUserId(user.id),
          this.transactionRepository.findByUserId(user.id)
        ]);

        const totalRevenue = transactions
          .filter(t => t.type === TransactionType.RECEITA)
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
          .filter(t => t.type === TransactionType.DESPESA)
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          userId: user.id,
          userName: user.name,
          email: user.email,
          accountsCount: accounts.length,
          transactionsCount: transactions.length,
          totalRevenue,
          totalExpenses,
          createdAt: user.createdAt
        };
      })
    );

    return activities.sort((a, b) => b.transactionsCount - a.transactionsCount);
  }

  async deleteUser(userId: string): Promise<boolean> { // UUID
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Não permitir deletar admin (role UUID)
    if (user.roleId === '3e1e1e1e-1111-4111-8111-111111111111') {
      throw new Error('Cannot delete admin user');
    }

    return this.userRepository.delete(userId);
  }

  async updateUserRole(userId: string, newRoleId: string): Promise<User | null> { // UUID
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validar se o role existe (UUIDs válidos)
    const validRoleIds = [
      '3e1e1e1e-1111-4111-8111-111111111111', // admin
      '3e1e1e1e-1111-4111-8111-111111111112'  // user
    ];
    if (!validRoleIds.includes(newRoleId)) {
      throw new Error('Invalid role ID');
    }

    return this.userRepository.update(userId, { roleId: newRoleId });
  }

  async getGlobalCategories(): Promise<Category[]> {
    return this.categoryRepository.findByUserId(null); // null = categorias globais
  }

  async createGlobalCategory(name: string): Promise<Category> {
    // Verificar se categoria global já existe
    const existing = await this.categoryRepository.findByName(name, null);
    if (existing) {
      throw new Error('Global category already exists');
    }

    return this.categoryRepository.create({
      userId: null, // null = categoria global
      name
    });
  }

  async updateGlobalCategory(categoryId: string, name: string): Promise<Category | null> { // UUID
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Verificar se é categoria global
    if (category.userId !== null) {
      throw new Error('Can only update global categories');
    }

    return this.categoryRepository.update(categoryId, { name });
  }

  async deleteGlobalCategory(categoryId: string): Promise<boolean> { // UUID
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Verificar se é categoria global
    if (category.userId !== null) {
      throw new Error('Can only delete global categories');
    }

    // Verificar se há transações usando esta categoria
    const transactions = await this.transactionRepository.findByCategoryId(categoryId);
    if (transactions.length > 0) {
      throw new Error('Cannot delete category with existing transactions');
    }

    return this.categoryRepository.delete(categoryId);
  }

  async getAllTransactions(): Promise<any[]> {
    const transactions = await this.transactionRepository.findAll();
    
    // Buscar informações do usuário para cada transação
    const enrichedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await this.userRepository.findById(transaction.userId);
        const account = await this.accountRepository.findById(transaction.accountId);
        const category = transaction.categoryId 
          ? await this.categoryRepository.findById(transaction.categoryId)
          : null;

        return {
          ...transaction,
          user: user ? { id: user.id, name: user.name, email: user.email } : null,
          account: account ? { id: account.id, name: account.name, type: account.type } : null,
          category: category ? { id: category.id, name: category.name } : null
        };
      })
    );

    return enrichedTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
