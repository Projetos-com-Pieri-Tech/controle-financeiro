# Arquitetura do Banco de Dados - Controle Financeiro

## 📊 Visão Geral

Este documento detalha a arquitetura do banco de dados do sistema de controle financeiro, incluindo todas as tabelas, relacionamentos e índices otimizados para performance.

## 🗂️ Diagrama de Entidades e Relacionamentos

```dbml
// --- Arquitetura para App de Controle Financeiro ---

// Definição dos tipos ENUM para garantir a consistência dos dados
enum account_type {
  conta_corrente
  poupanca
  cartao_credito
  dinheiro
  investimento
}

enum transaction_type {
  receita
  despesa
}

Table users {
  id integer [primary key]
  name varchar(255) [not null]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  role_id integer [not null, ref: > roles.id]

  created_at datetime [not null]
  updated_at datetime [not null]
  deleted_at datetime
}

Table roles {
  id integer [primary key]
  name varchar(50) [unique, not null]
  description text

  created_at datetime [not null]
  updated_at datetime [not null]
  deleted_at datetime
}

Table accounts {
  id integer [primary key]
  user_id integer [not null, ref: > users.id]
  name varchar(100) [not null]
  type account_type [not null]
  initial_balance decimal(15, 2) [not null, default: 0]

  created_at datetime [not null]
  updated_at datetime [not null]
  deleted_at datetime
  
  // Índice para acelerar a busca de contas por usuário
  indexes {
    user_id
  }
}

Table transactions {
  id integer [primary key]
  user_id integer [not null, ref: > users.id]
  account_id integer [not null, ref: > accounts.id]
  category_id integer [ref: > categories.id]
  description varchar(255) [not null]
  amount decimal(15, 2) [not null]
  type transaction_type [not null]
  transaction_date date [not null]
  is_paid boolean [not null, default: true]

  created_at datetime [not null]
  updated_at datetime [not null]
  deleted_at datetime
  
  // Índices para acelerar as buscas mais comuns em transações
  indexes {
    user_id
    account_id
    category_id
  }
}

Table categories {
  id integer [primary key]
  user_id integer [ref: > users.id] 
  name varchar(100) [not null]

  created_at datetime [not null]
  updated_at datetime [not null]
  deleted_at datetime
  
  // Índice para acelerar a busca de categorias por usuário
  indexes {
    user_id
  }
}
```

## 📋 Descrição das Tabelas

### 👥 Users (Usuários)
Armazena informações dos usuários do sistema.

- **id**: Chave primária
- **name**: Nome completo do usuário
- **email**: Email único para login
- **password_hash**: Senha criptografada
- **role_id**: Referência para a tabela de roles
- **Campos de auditoria**: created_at, updated_at, deleted_at

### 🔐 Roles (Funções)
Define os tipos de usuário e suas permissões.

- **id**: Chave primária
- **name**: Nome único da função (admin, user, etc.)
- **description**: Descrição da função
- **Campos de auditoria**: created_at, updated_at, deleted_at

### 🏦 Accounts (Contas)
Representa as contas financeiras dos usuários.

- **id**: Chave primária
- **user_id**: Referência para o usuário proprietário
- **name**: Nome da conta (ex: "Conta Corrente Banco X")
- **type**: Tipo da conta (enum: conta_corrente, poupanca, cartao_credito, dinheiro, investimento)
- **initial_balance**: Saldo inicial da conta
- **Campos de auditoria**: created_at, updated_at, deleted_at

### 💰 Transactions (Transações)
Registra todas as movimentações financeiras.

- **id**: Chave primária
- **user_id**: Referência para o usuário
- **account_id**: Referência para a conta
- **category_id**: Referência para a categoria (opcional)
- **description**: Descrição da transação
- **amount**: Valor da transação
- **type**: Tipo da transação (enum: receita, despesa)
- **transaction_date**: Data da transação
- **is_paid**: Indica se a transação foi efetivada
- **Campos de auditoria**: created_at, updated_at, deleted_at

### 🏷️ Categories (Categorias)
Categorias para organizar as transações.

- **id**: Chave primária
- **user_id**: Referência para o usuário (permite categorias personalizadas)
- **name**: Nome da categoria
- **Campos de auditoria**: created_at, updated_at, deleted_at

## 🔗 Relacionamentos

1. **Users ↔ Roles**: Many-to-One (um usuário tem uma role)
2. **Users ↔ Accounts**: One-to-Many (um usuário pode ter várias contas)
3. **Users ↔ Transactions**: One-to-Many (um usuário pode ter várias transações)
4. **Users ↔ Categories**: One-to-Many (um usuário pode ter várias categorias)
5. **Accounts ↔ Transactions**: One-to-Many (uma conta pode ter várias transações)
6. **Categories ↔ Transactions**: One-to-Many (uma categoria pode ter várias transações)

## 📈 Índices para Performance

### Índices Criados
- **accounts.user_id**: Acelera busca de contas por usuário
- **transactions.user_id**: Acelera busca de transações por usuário
- **transactions.account_id**: Acelera busca de transações por conta
- **transactions.category_id**: Acelera busca de transações por categoria
- **categories.user_id**: Acelera busca de categorias por usuário

### Índices Nativos
- **users.email**: Único, acelera login
- **roles.name**: Único, acelera busca por role

## 🛡️ Considerações de Segurança

1. **Soft Delete**: Todas as tabelas usam `deleted_at` para exclusão lógica
2. **Password Hash**: Senhas são armazenadas como hash
3. **Isolation**: Dados são isolados por usuário (user_id em todas as tabelas principais)
4. **Validação**: ENUMs garantem consistência dos dados

## 🔄 Auditoria

Todas as tabelas incluem campos de auditoria:
- **created_at**: Timestamp de criação
- **updated_at**: Timestamp da última atualização
- **deleted_at**: Timestamp de exclusão (soft delete)

## 📊 Consultas Otimizadas

### Saldo de uma Conta
```sql
SELECT 
  a.initial_balance + COALESCE(SUM(
    CASE 
      WHEN t.type = 'receita' THEN t.amount 
      ELSE -t.amount 
    END
  ), 0) as current_balance
FROM accounts a
LEFT JOIN transactions t ON a.id = t.account_id AND t.deleted_at IS NULL
WHERE a.id = ? AND a.deleted_at IS NULL
GROUP BY a.id, a.initial_balance;
```

### Transações de um Período
```sql
SELECT * FROM transactions 
WHERE user_id = ? 
  AND transaction_date BETWEEN ? AND ?
  AND deleted_at IS NULL
ORDER BY transaction_date DESC;
```

## 🚀 Próximas Melhorias

- [ ] Adicionar tabela de attachments para comprovantes
- [ ] Implementar tabela de budgets (orçamentos)
- [ ] Criar tabela de recurring_transactions (transações recorrentes)
- [ ] Adicionar campos de geolocalização nas transações
- [ ] Implementar sistema de tags adicionais

---

**Este esquema foi projetado para escalabilidade e performance, seguindo as melhores práticas de design de banco de dados.**
