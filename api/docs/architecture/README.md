# 🏗️ Arquitetura do Sistema

## 📐 **Hexagonal Architecture (Ports & Adapters)**

### **Visão Geral**
```
        🌐 WEB LAYER           🎯 CORE DOMAIN          🗄️ PERSISTENCE
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   Controllers   │    │    Entities     │    │  Repositories   │
    │     Routes      │───▶│     Enums       │◀───│    Database     │
    │   Middleware    │    │ Value Objects   │    │     MySQL       │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
            │                        ▲                        ▲
            ▼                        │                        │
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │  HTTP/Express   │    │  Use Cases      │    │     Config      │
    │    Swagger      │    │   Services      │    │   Container     │
    │   Validation    │    │     DTOs        │    │      DI         │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🎯 Princípios Aplicados**

#### **1. Dependency Inversion**
- Domain não conhece Infrastructure
- Uso de interfaces (Ports) para abstrair dependências
- Dependency Injection via Container

#### **2. Single Responsibility**
- Cada Use Case tem uma responsabilidade específica
- Services orquestram múltiplos Use Cases
- Controllers focam apenas em HTTP

#### **3. Open/Closed**
- Fácil extensão via novos adapters
- Domain fechado para modificação
- Infrastructure aberta para extensão

### **📂 Estrutura de Camadas**

```
src/
├── domain/                    # 🎯 CORE - Regras de Negócio
│   ├── entities/             # Entidades do domínio
│   ├── enums/                # Enumerações
│   ├── value-objects/        # Value Objects
│   └── ports/                # Interfaces/Contratos
│       ├── repositories/     # Contratos de persistência
│       └── services/         # Contratos de serviços
├── application/              # 🔄 ORQUESTRAÇÃO
│   ├── usecases/             # Casos de uso específicos
│   ├── services/             # Orquestradores
│   └── dtos/                 # Data Transfer Objects
└── infrastructure/           # 🔌 ADAPTADORES
    ├── web/                  # Adapter Web (HTTP)
    │   ├── controllers/      # Controllers REST
    │   ├── routes/           # Definição de rotas
    │   └── middleware/       # Middlewares HTTP
    ├── persistence/          # Adapter Persistência
    │   └── repositories/     # Implementações MySQL
    ├── config/               # Configurações
    │   ├── container.ts      # Dependency Injection
    │   ├── database.ts       # Config MySQL
    │   └── server.ts         # Config Express
    └── utils/                # Utilitários
```

---

## 🎨 **Design Patterns Utilizados**

### **1. Repository Pattern** 🗄️
```typescript
// Port (Interface)
interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(user: CreateUserData): Promise<User>;
}

// Adapter (Implementação)
class MySQLUserRepository implements UserRepository {
  // Implementação específica do MySQL
}
```

### **2. Dependency Injection** 💉
```typescript
// Container centralizado
export function createContainer(): Container {
  const userRepo = new MySQLUserRepository();
  const authService = new AuthService(userRepo);
  const authController = new AuthController(authService);
  
  return { userRepo, authService, authController };
}
```

### **3. Factory Pattern** 🏭
```typescript
// Server Factory
export function createServer(container: Container): Application {
  const app = express();
  // Configura servidor com dependências
  return app;
}
```

### **4. Command Pattern** 📋
```typescript
// Use Cases como comandos
class CreateUser {
  execute(data: CreateUserData): Promise<User> {
    // Lógica específica de criação
  }
}
```

### **5. Adapter Pattern** 🔌
```typescript
// Adapta MySQL para interface do domain
class MySQLUserRepository implements UserRepository {
  // Converte dados MySQL ↔ Domain entities
}
```

---

## 🔄 **Fluxo de Dados**

### **Request Flow**
```
1. HTTP Request → Controller
2. Controller → Application Service  
3. Service → Use Case(s)
4. Use Case → Repository (via Port)
5. Repository → Database
6. Database → Repository → Use Case → Service → Controller
7. Controller → HTTP Response
```

### **Exemplo Prático: Criar Transação**
```typescript
// 1. HTTP Request
POST /api/transactions { amount: 100, type: 'RECEITA' }

// 2. Controller
TransactionController.create(req, res)

// 3. Application Service  
TransactionService.createTransaction(data)

// 4. Use Case
CreateTransaction.execute(data)

// 5. Repository
TransactionRepository.create(transaction)

// 6. Response
{ id: "uuid", amount: 100, type: "RECEITA" }
```

---

## 🧪 **Testabilidade**

### **Estratégia de Testes**
```
📊 Pirâmide de Testes
        ┌─────────┐
        │   E2E   │  ← Cypress (API completa)
        └─────────┘
      ┌─────────────┐
      │ Integration │  ← Supertest (HTTP + DB)
      └─────────────┘
    ┌─────────────────┐
    │   Unit Tests    │  ← Jest (Use Cases + Services)
    └─────────────────┘
```

### **Mocking Strategy**
```typescript
// Mock Repository para Use Case
const mockUserRepo = {
  findById: jest.fn(),
  create: jest.fn(),
} as jest.Mocked<UserRepository>;

// Test Use Case isoladamente
const createUser = new CreateUser(mockUserRepo);
```

---

## 🚀 **Deployment Architecture**

### **Development**
```
Developer Machine
├── API (Node.js + TypeScript)
├── MySQL (Local/Docker)
└── Frontend (Angular - futuro)
```

### **Production**
```
Cloud Infrastructure
├── Load Balancer
├── API Instances (PM2/Docker)
├── Database (MySQL Cluster)
├── Redis (Cache/Sessions)
└── CDN (Static Assets)
```

---

## 📈 **Escalabilidade**

### **Horizontal Scaling**
- API stateless (JWT)
- Database read replicas
- Microservices (futuro)

### **Performance**
- Connection pooling
- Query optimization
- Caching strategy
- CDN para assets

### **Monitoring**
- Application metrics
- Database performance
- Error tracking
- Log aggregation

---

## 🔒 **Security**

### **Implemented**
- JWT Authentication
- bcrypt Password hashing
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention (parameterized queries)

### **Future Enhancements**
- HTTPS enforcement
- API versioning
- OAuth2 integration
- Audit logging
- Database encryption
