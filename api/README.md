# API Controle Financeiro

API desenvolvida em Node.js com TypeScript seguindo a **Arquitetura Hexagonal** (Ports and Adapters).

## 🏗️ Arquitetura Hexagonal

A arquitetura hexagonal separa a aplicação em camadas bem definidas, promovendo baixo acoplamento e alta coesão.

### 📁 Estrutura de Pastas

```
src/
├── domain/                 # 🏛️ CAMADA DE DOMÍNIO
│   ├── entities/          # Entidades de negócio (regras fundamentais)
│   ├── usecases/          # Casos de uso (regras de aplicação)
│   └── ports/             # Interfaces/contratos para acesso externo
├── application/           # 🔧 CAMADA DE APLICAÇÃO
│   ├── services/          # Serviços de aplicação (orquestração)
│   └── ports/             # Interfaces para serviços externos
├── infrastructure/        # 🔌 CAMADA DE INFRAESTRUTURA
│   ├── adapters/          # Implementações dos ports
│   │   ├── repositories/  # Acesso a dados (BD, APIs externas)
│   │   └── controllers/   # Controllers HTTP (entrada da aplicação)
│   ├── config/            # Configurações (servidor, BD, etc.)
│   └── middleware/        # Middlewares HTTP (auth, logs, etc.)
└── index.ts               # Ponto de entrada da aplicação
```

## 📖 Descrição das Camadas

### 🏛️ Domain (Domínio)
**Camada mais interna - independente de frameworks e tecnologias**

- **`entities/`**: Entidades de negócio com regras fundamentais do domínio
- **`usecases/`**: Casos de uso que orquestram as regras de negócio
- **`ports/`**: Interfaces que definem contratos para comunicação com o mundo externo

### 🔧 Application (Aplicação)
**Camada intermediária - orquestra o domínio**

- **`services/`**: Serviços de aplicação que coordenam múltiplos casos de uso
- **`ports/`**: Interfaces para serviços externos (email, pagamento, etc.)

### 🔌 Infrastructure (Infraestrutura)
**Camada mais externa - implementações concretas**

- **`adapters/repositories/`**: Implementações de acesso a dados (PostgreSQL, MongoDB, APIs)
- **`adapters/controllers/`**: Controllers REST que recebem requisições HTTP
- **`config/`**: Configurações de servidor, banco de dados, variáveis de ambiente
- **`middleware/`**: Middlewares HTTP (autenticação, logs, validação, CORS)

## 🎯 Benefícios da Arquitetura

- **Testabilidade**: Domínio isolado permite testes unitários puros
- **Flexibilidade**: Troca de banco/framework sem afetar regras de negócio
- **Manutenibilidade**: Separação clara de responsabilidades
- **Escalabilidade**: Estrutura organizada facilita crescimento do projeto

## 🚀 Como Usar

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Testes
npm test
```

## 📊 Endpoints

- `GET /health` - Health check da aplicação

---

*Arquitetura baseada nos princípios de Clean Architecture e Hexagonal Architecture*