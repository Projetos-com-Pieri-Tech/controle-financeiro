export interface RegisterSchema {
  name: string;
  email: string;
  password: string;
  roleId?: string;
}

export interface LoginSchema {
  email: string;
  password: string;
}

export interface CreateAccountSchema {
  name: string;
  type: 'checking' | 'savings' | 'investment';
  initialBalance?: number;
}

export interface CreateTransactionSchema {
  accountId: string;
  categoryId?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  transactionDate: string;
  isPaid?: boolean;
}

export interface UpdateTransactionSchema {
  accountId?: string;
  categoryId?: string;
  description?: string;
  amount?: number;
  type?: 'income' | 'expense';
  transactionDate?: string;
  isPaid?: boolean;
}

export interface CreateCategorySchema {
  name: string;
  color?: string;
  icon?: string;
}

export class InputValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static validateAmount(amount: number): boolean {
    return typeof amount === 'number' && amount > 0 && isFinite(amount);
  }

  static validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>"']/g, '');
  }

  static validateRegisterInput(data: unknown): { valid: boolean; errors: string[]; data?: RegisterSchema } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Invalid input data'] };
    }
    
    const input = data as Record<string, unknown>;
    
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!input.email || typeof input.email !== 'string' || !this.validateEmail(input.email)) {
      errors.push('Valid email is required');
    }
    
    if (!input.password || typeof input.password !== 'string') {
      errors.push('Password is required');
    } else {
      const passwordValidation = this.validatePassword(input.password);
      if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
      }
    }
    
    if (input.roleId && typeof input.roleId === 'string' && !this.validateUUID(input.roleId)) {
      errors.push('Invalid role ID format');
    }
    
    if (errors.length > 0) {
      return { valid: false, errors };
    }
    
    return {
      valid: true,
      errors: [],
      data: {
        name: this.sanitizeString(input.name as string),
        email: (input.email as string).toLowerCase().trim(),
        password: input.password as string,
        roleId: input.roleId as string | undefined
      }
    };
  }

  static validateLoginInput(data: unknown): { valid: boolean; errors: string[]; data?: LoginSchema } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Invalid input data'] };
    }
    
    const input = data as Record<string, unknown>;
    
    if (!input.email || typeof input.email !== 'string' || !this.validateEmail(input.email)) {
      errors.push('Valid email is required');
    }
    
    if (!input.password || typeof input.password !== 'string' || input.password.length === 0) {
      errors.push('Password is required');
    }
    
    if (errors.length > 0) {
      return { valid: false, errors };
    }
    
    return {
      valid: true,
      errors: [],
      data: {
        email: (input.email as string).toLowerCase().trim(),
        password: input.password as string
      }
    };
  }

  static validateCreateTransactionInput(data: unknown): { valid: boolean; errors: string[]; data?: CreateTransactionSchema } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Invalid input data'] };
    }
    
    const input = data as Record<string, unknown>;
    
    if (!input.accountId || typeof input.accountId !== 'string' || !this.validateUUID(input.accountId)) {
      errors.push('Valid account ID is required');
    }
    
    if (input.categoryId && typeof input.categoryId === 'string' && !this.validateUUID(input.categoryId)) {
      errors.push('Invalid category ID format');
    }
    
    if (!input.description || typeof input.description !== 'string' || input.description.trim().length < 1) {
      errors.push('Description is required');
    }
    
    if (!input.amount || typeof input.amount !== 'number' || !this.validateAmount(input.amount)) {
      errors.push('Valid positive amount is required');
    }
    
    if (!input.type || !['income', 'expense'].includes(input.type as string)) {
      errors.push('Transaction type must be either "income" or "expense"');
    }
    
    if (!input.transactionDate || typeof input.transactionDate !== 'string' || !this.validateDate(input.transactionDate)) {
      errors.push('Valid transaction date is required');
    }
    
    if (errors.length > 0) {
      return { valid: false, errors };
    }
    
    return {
      valid: true,
      errors: [],
      data: {
        accountId: input.accountId as string,
        categoryId: input.categoryId as string | undefined,
        description: this.sanitizeString(input.description as string),
        amount: input.amount as number,
        type: input.type as 'income' | 'expense',
        transactionDate: input.transactionDate as string,
        isPaid: input.isPaid as boolean | undefined
      }
    };
  }
}