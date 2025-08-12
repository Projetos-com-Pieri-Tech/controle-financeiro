# 💰 API de Controle Financeiro

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![MySQL](https://img.shields.io/badge/mysql-8.0-blue)
![Architecture](https://img.shields.io/badge/architecture-hexagonal-purple)

## 📋 Sobre o Projeto

API REST robusta para controle financeiro pessoal desenvolvida com **Arquitetura Hexagonal** (Ports & Adapters), seguindo os princípios SOLID e Clean Architecture. Permite gerenciamento completo de usuários, contas, transações e categorias financeiras com alta performance e escalabilidade.

## 🚀 Status do Projeto

🎯 **Versão Estável - v1.0**

### ✅ Implementado
- **Arquitetura Hexagonal** - Estrutura completa e organizada
- **API REST** - Endpoints funcionais para todas as entidades
- **Autenticação JWT** - Sistema de login e autorização
- **Autorização por Roles** - Admin e User com permissões específicas
- **Validação de Dados** - Middleware de validação robusto
- **Rate Limiting** - Proteção contra ataques de força bruta
- **CORS & Security** - Headers de segurança configurados
- **Swagger Documentation** - Documentação API completa
- **Error Handling** - Tratamento global de erros
- **Database Schema** - Estrutura MySQL otimizada com UUIDs
- **Logging** - Sistema de logs com Morgan

### 🚧 Em Desenvolvimento
- **Testes Unitários** - Cobertura em implementação
- **Sistema de Migrations** - Versionamento do banco
- **CI/CD Pipeline** - Automação de deploy
- **Monitoring** - Métricas e observabilidade

## 🏗️ Arquitetura Hexagonal

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DRIVING       │    │      CORE       │    │     DRIVEN      │
│   ADAPTERS      │    │    (DOMAIN)     │    │    ADAPTERS     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │     WEB     │ │    │ │  ENTITIES   │ │    │ │ PERSISTENCE │ │
│ │ Controllers │ │───▶│ │   ENUMS     │ │◀───│ │ Repositories│ │
│ │   Routes    │ │    │ │VALUE OBJECTS│ │    │ │   Database  │ │
│ │ Middleware  │ │    │ └─────────────┘ │    │ └─────────────┘ │
│ └─────────────┘ │    │                 │    │                 │
│                 │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ ┌─────────────┐ │    │ │    PORTS    │ │    │ │  EXTERNAL   │ │
│ │     CLI     │ │    │ │(INTERFACES) │ │    │ │   APIs      │ │
│ │  Commands   │ │───▶│ │ Repositories│ │◀───│ │   Email     │ │
│ └─────────────┘ │    │ │  Services   │ │    │ │   Storage   │ │
│                 │    │ │  Use Cases  │ │    │ └─────────────┘ │
└─────────────────┘    │ └─────────────┘ │    └─────────────────┘
                       │                 │
                       │ ┌─────────────┐ │
                       │ │APPLICATION  │ │
                       │ │ Use Cases   │ │
                       │ │  Services   │ │
                       │ │    DTOs     │ │
                       │ └─────────────┘ │
                       └─────────────────┘
```

### 📁 Estrutura de Pastas

```
src/
├── domain/                         # 🎯 NÚCLEO - Lógica de Negócio
│   ├── entities/                   # Entidades do domínio
│   │   ├── account.ts             # Conta financeira
│   │   ├── category.ts            # Categoria de transação
│   │   ├── role.ts                # Role de usuário
│   │   ├── transaction.ts         # Transação financeira
│   │   └── user.ts                # Usuário do sistema
│   ├── enums/                     # Enumerações
│   │   ├── AccountType.ts         # Tipos de conta
│   │   └── TransactionType.ts     # Tipos de transação
│   ├── value-objects/             # Value Objects
│   └── ports/                     # Interfaces/Contratos
│       ├── repositories/          # Output Ports
│       ├── services/              # Output Ports
│       └── usecases/              # Input Ports
├── application/                    # 🔄 CASOS DE USO
│   ├── usecases/                  # Implementação dos Use Cases
│   │   ├── account/               # Casos de uso de contas
│   │   ├── auth/                  # Casos de uso de autenticação
│   │   ├── category/              # Casos de uso de categorias
│   │   ├── transaction/           # Casos de uso de transações
│   │   └── user/                  # Casos de uso de usuários
│   ├── services/                  # Application Services
│   │   ├── AccountService.ts      # Serviço de contas
│   │   ├── AdminService.ts        # Serviço administrativo
│   │   ├── AuthService.ts         # Serviço de autenticação
│   │   ├── CategoryService.ts     # Serviço de categorias
│   │   └── TransactionService.ts  # Serviço de transações
│   └── dtos/                      # Data Transfer Objects
└── infrastructure/                # 🔌 ADAPTADORES
    ├── web/                       # Adaptador Web (Driving)
    │   ├── controllers/           # Controllers REST
    │   ├── middleware/            # Middlewares
    │   ├── routes/                # Definição de rotas
    │   └── dtos/                  # DTOs específicos da web
    ├── persistence/               # Adaptador de Persistência (Driven)
    │   ├── repositories/          # Implementações MySQL
    │   ├── entities/              # Entidades do banco
    │   └── mappers/               # Mappers Domain↔DB
    ├── external/                  # Adaptadores Externos (Driven)
    │   ├── apis/                  # APIs externas
    │   └── email/                 # Serviços de email
    ├── config/                    # Configurações e DI
    │   ├── container.ts           # Dependency Injection
    │   ├── database.ts            # Configuração MySQL
    │   ├── server.ts              # Configuração Express
    │   └── swagger.ts             # Documentação API
    └── utils/                     # Utilitários
```

## 🛠️ Tecnologias e Ferramentas

### **Core**
- **Node.js 16+** - Runtime JavaScript
- **TypeScript 5.0** - Tipagem estática
- **Express.js** - Framework web minimalista

### **Banco de Dados**
- **MySQL 8.0** - Banco relacional principal
- **mysql2** - Driver MySQL com suporte a Promises

### **Segurança & Auth**
- **JWT** - Autenticação stateless
- **bcrypt** - Hash de senhas
- **Helmet** - Headers de segurança
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Proteção contra ataques

### **Validação & Documentação**
- **Joi** - Validação de schemas
- **Swagger/OpenAPI** - Documentação da API
- **Morgan** - Logging de requisições

### **Desenvolvimento**
- **ESLint** - Linter de código
- **Prettier** - Formatação de código
- **Jest** - Framework de testes
- **Nodemon** - Hot reload

## 🚀 Instalação e Configuração

### 1. **Pré-requisitos**
```bash
# Versões mínimas
node --version    # v16.0.0+
npm --version     # v8.0.0+
mysql --version   # v8.0.0+
```

### 2. **Clone e Instalação**
```bash
# Clone o repositório
git clone https://github.com/Projetos-com-Pieri-Tech/controle-financeiro.git
cd controle-financeiro/api

# Instale as dependências
npm install
```

### 3. **Configuração do Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure as variáveis de ambiente
nano .env
```

#### **Variáveis de Ambiente (.env)**
```env
# 🗄️ Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=controle_financeiro

# 🔐 Authentication
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# 🌐 Server
PORT=3000
NODE_ENV=development

# 📊 API
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. **Configuração do Banco de Dados**
```bash
# Execute o script SQL para criar as tabelas
mysql -u seu_usuario -p controle_financeiro < docs/database/schema-uuid.sql

# Ou use o cliente MySQL
mysql -u seu_usuario -p
source docs/database/schema-uuid.sql
```

### 5. **Executar a Aplicação**
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start

# Verificar compilação TypeScript
npm run type-check
```

## 📚 Documentação da API

### **Swagger UI**
Acesse a documentação interativa em: `http://localhost:3000/api-docs`

### **Principais Endpoints**

#### **🔐 Autenticação**
```bash
POST /api/auth/login          # Login do usuário
POST /api/auth/register       # Registro de novo usuário
```

#### **👥 Usuários**
```bash
GET    /api/users/profile     # Perfil do usuário logado
PUT    /api/users/profile     # Atualizar perfil
```

#### **💳 Contas**
```bash
GET    /api/accounts          # Listar contas do usuário
POST   /api/accounts          # Criar nova conta
GET    /api/accounts/:id      # Detalhes da conta
PUT    /api/accounts/:id      # Atualizar conta
DELETE /api/accounts/:id      # Deletar conta
GET    /api/accounts/:id/balance # Saldo da conta
```

#### **💰 Transações**
```bash
GET    /api/transactions      # Listar transações
POST   /api/transactions      # Criar transação
GET    /api/transactions/:id  # Detalhes da transação
PUT    /api/transactions/:id  # Atualizar transação
DELETE /api/transactions/:id  # Deletar transação
```

#### **📂 Categorias**
```bash
GET    /api/categories        # Listar categorias
POST   /api/categories        # Criar categoria
```

#### **👑 Admin** *(Requer role admin)*
```bash
GET    /api/admin/dashboard   # Dashboard administrativo
GET    /api/admin/users       # Listar todos os usuários
GET    /api/admin/transactions # Listar todas as transações
```

## 📊 Scripts Disponíveis

```bash
# 🚀 Desenvolvimento
npm run dev           # Inicia servidor com hot reload
npm run build         # Compila TypeScript para JavaScript
npm start             # Inicia servidor de produção

# 🔍 Qualidade de Código
npm run lint          # Executa ESLint
npm run lint:fix      # Corrige problemas do ESLint automaticamente
npm run format        # Formata código com Prettier
npm run type-check    # Verifica tipos TypeScript

# 🧪 Testes
npm test              # Executa todos os testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Testes com relatório de cobertura

# 🗄️ Banco de Dados
npm run db:reset      # Reset completo do banco (desenvolvimento)
npm run db:seed       # Popula banco com dados iniciais
```

## 🗃️ Banco de Dados

### **Estrutura Principal**
```sql
-- Estrutura com UUIDs para melhor performance e segurança
roles (id, name, description)
users (id, name, email, password_hash, role_id)
accounts (id, user_id, name, type, initial_balance)
categories (id, user_id, name)
transactions (id, account_id, category_id, type, amount, description, is_paid)
```

### **Relacionamentos**
- `users` ← `accounts` (1:N) - Um usuário pode ter várias contas
- `accounts` ← `transactions` (1:N) - Uma conta pode ter várias transações
- `categories` ← `transactions` (1:N) - Uma categoria pode ter várias transações
- `roles` ← `users` (1:N) - Uma role pode ter vários usuários

### **Dados Iniciais (Seeds)**
- **Roles**: `admin`, `user`
- **Categorias Globais**: Alimentação, Transporte, Saúde, Educação, etc.

## 🔒 Segurança

### **Implementado**
- ✅ **Autenticação JWT** - Tokens seguros com expiração
- ✅ **Hash de Senhas** - bcrypt com salt rounds
- ✅ **Rate Limiting** - Proteção contra força bruta
- ✅ **CORS** - Configuração de origins permitidas
- ✅ **Helmet** - Headers de segurança
- ✅ **Validação de Input** - Sanitização de dados
- ✅ **UUIDs** - IDs não sequenciais
- ✅ **Middleware de Autorização** - Controle por roles

## 👥 Contribuindo

### **Padrões de Desenvolvimento**

#### **Arquitetura**
- ✅ Siga rigorosamente a **Arquitetura Hexagonal**
- ✅ Domain não deve conhecer Infrastructure
- ✅ Use **Dependency Injection** no container
- ✅ Implemente **interfaces** antes de concretações

#### **Commits**
```bash
# Padrão Conventional Commits
feat: add account balance calculation
fix: resolve JWT token expiration issue
docs: update API documentation
refactor: improve error handling middleware
test: add unit tests for transaction service
```

### **Processo de Contribuição**
1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie branch** descritiva: `git checkout -b feat/nova-funcionalidade`
4. **Desenvolva** seguindo os padrões
5. **Teste** localmente: `npm test`
6. **Commit** com mensagem clara
7. **Push** para seu fork
8. **Abra Pull Request** com descrição detalhada

## 📞 Suporte e Contato

### **Links Úteis**
- 📖 **Documentação**: [Swagger UI](http://localhost:3000/api-docs)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Projetos-com-Pieri-Tech/controle-financeiro/issues)

### **Equipe**
- **Pieri Tech** - Arquitetura e Desenvolvimento

### **Contato**
- 🌐 **Website**: [Pieri Tech](https://github.com/Projetos-com-Pieri-Tech)
- 🐙 **GitHub**: [@Projetos-com-Pieri-Tech](https://github.com/Projetos-com-Pieri-Tech)

## 📄 Licença

Este projeto está licenciado sob a **Licença ISC** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**🏗️ Desenvolvido com ❤️ seguindo os princípios da Arquitetura Hexagonal**

[![GitHub](https://img.shields.io/badge/GitHub-Pieri%20Tech-blue?logo=github)](https://github.com/Projetos-com-Pieri-Tech)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal-purple)](https://alistair.cockburn.us/hexagonal-architecture/)
[![Clean Code](https://img.shields.io/badge/Code-Clean%20Architecture-green)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

</div>
