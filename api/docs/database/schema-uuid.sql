-- ========================================
-- MIGRAÇÃO PARA UUID - CONTROLE FINANCEIRO
-- ========================================

-- Criar database
CREATE DATABASE IF NOT EXISTS luis9046_controle_financeiro;
USE luis9046_controle_financeiro;

-- ========================================
-- TABELA: roles
-- ========================================
CREATE TABLE roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ========================================
-- TABELA: users
-- ========================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_users_email (email),
    INDEX idx_users_role_id (role_id)
);

-- ========================================
-- TABELA: accounts
-- ========================================
CREATE TABLE accounts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('conta_corrente', 'poupanca', 'cartao_credito', 'dinheiro', 'investimento') NOT NULL,
    initial_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_accounts_user_id (user_id)
);

-- ========================================
-- TABELA: categories
-- ========================================
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NULL, -- NULL = categoria global
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_categories_user_id (user_id)
);

-- ========================================
-- TABELA: transactions
-- ========================================
CREATE TABLE transactions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    account_id CHAR(36) NOT NULL,
    category_id CHAR(36) NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('receita', 'despesa') NOT NULL,
    transaction_date DATE NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_transactions_user_id (user_id),
    INDEX idx_transactions_account_id (account_id),
    INDEX idx_transactions_category_id (category_id),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_type (type)
);

-- ========================================
-- DADOS INICIAIS
-- ========================================

-- Inserir roles padrão com UUID
SET @admin_role_id = UUID();
SET @user_role_id = UUID();

INSERT INTO roles (id, name, description) VALUES 
(@admin_role_id, 'admin', 'Administrador do sistema'),
(@user_role_id, 'user', 'Usuário padrão');

-- Inserir categorias globais com UUID
INSERT INTO categories (id, user_id, name) VALUES 
(UUID(), NULL, 'Alimentação'),
(UUID(), NULL, 'Transporte'),
(UUID(), NULL, 'Saúde'),
(UUID(), NULL, 'Educação'),
(UUID(), NULL, 'Entretenimento'),
(UUID(), NULL, 'Casa'),
(UUID(), NULL, 'Roupas'),
(UUID(), NULL, 'Salário'),
(UUID(), NULL, 'Freelance'),
(UUID(), NULL, 'Investimentos');

-- ========================================
-- VERIFICAÇÕES
-- ========================================

-- Verificar estrutura
SHOW TABLES;

-- Verificar dados iniciais
SELECT id, name, description FROM roles;
SELECT id, name FROM categories WHERE user_id IS NULL;

-- Verificar se UUIDs foram gerados
SELECT 'Roles UUID gerados:' as info;
SELECT id, name FROM roles;

SELECT 'Categorias UUID geradas:' as info;
SELECT id, name FROM categories LIMIT 5;
