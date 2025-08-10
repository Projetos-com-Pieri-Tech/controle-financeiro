# API de Controle Financeiro

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-0%25-red)

## 📋 Sobre o Projeto

API REST para controle financeiro pessoal desenvolvida com arquitetura hexagonal (ports and adapters), permitindo o gerenciamento de contas, transações e categorias financeiras.

## 📊 Status do Projeto

🚧 **Em Desenvolvimento Ativo**

- ✅ Arquitetura hexagonal implementada
- ✅ API REST funcional
- ✅ Autenticação JWT
- ✅ Validação de dados
- ✅ Configuração de testes
- ⚠️ Testes unitários (0% cobertura - em desenvolvimento)
- ⚠️ Documentação API (Swagger pendente)
- ⚠️ Migrações de banco (em desenvolvimento)

## 🏗️ Arquitetura

O projeto segue a **Arquitetura Hexagonal** com as seguintes camadas:

### Domain Layer (Núcleo)
- **Entities**: Modelos de domínio (User, Account, Transaction, Category, Role)
- **Ports**: Interfaces dos repositórios
- **Use Cases**: Lógica de negócio principal

### Application Layer
- **Services**: Orquestração dos use cases e lógica adicional

### Infrastructure Layer
- **Controllers**: Endpoints da API
- **Repositories**: Implementação dos repositórios (PostgreSQL)
- **Middleware**: Autenticação, validação, rate limiting
- **Config**: Configuração do servidor e banco de dados

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Joi** - Validação de dados
- **Helmet** - Segurança
- **Rate Limiting** - Proteção contra abuso

## �️ Banco de Dados

O sistema utiliza PostgreSQL com uma arquitetura otimizada para performance e escalabilidade:

- **5 tabelas principais**: users, roles, accounts, transactions, categories
- **Soft delete**: Exclusão lógica em todas as tabelas
- **Índices otimizados**: Para consultas frequentes
- **ENUMs**: Para garantir consistência de dados
- **Auditoria completa**: Timestamps de criação, atualização e exclusão

📋 **[Ver documentação completa do banco de dados](./docs/database-schema.md)**

### Estrutura Principal
- **Users & Roles**: Sistema de usuários com controle de acesso
- **Accounts**: Contas financeiras (corrente, poupança, cartão, etc.)
- **Transactions**: Movimentações financeiras (receitas e despesas)
- **Categories**: Categorização personalizável por usuário

## �📦 Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/Projetos-com-Pieri-Tech/controle-financeiro.git
cd controle-financeiro/api
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Valor Padrão | Obrigatório |
|----------|-----------|--------------|-------------|
| `PORT` | Porta do servidor | 3001 | Não |
| `NODE_ENV` | Ambiente de execução | development | Não |
| `DB_HOST` | Host do PostgreSQL | localhost | Sim |
| `DB_PORT` | Porta do PostgreSQL | 5432 | Não |
| `DB_NAME` | Nome do banco | controle_financeiro | Sim |
| `DB_USER` | Usuário do banco | postgres | Sim |
| `DB_PASSWORD` | Senha do banco | - | Sim |
| `JWT_SECRET` | Chave secreta JWT | - | Sim |

4. **Configure o banco de dados**

Crie o banco de dados:
```sql
CREATE DATABASE controle_financeiro;
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor compilado
- `npm test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:coverage` - Executa os testes com cobertura
- `npm run lint` - Verifica o código
- `npm run lint:fix` - Corrige problemas de lint

## 📚 Documentação da API

### Base URL
```
http://localhost:3001/api
```

### Autenticação

A API usa JWT para autenticação. Inclua o token no header:
```
Authorization: Bearer <token>
```

### Endpoints

#### 🔐 Autenticação

##### Registro
```http
POST /auth/register
```
Body:
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

##### Login
```http
POST /auth/login
```
Body:
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### 💳 Contas

##### Criar conta
```http
POST /accounts
Authorization: Bearer <token>
```
Body:
```json
{
  "name": "Conta Corrente",
  "type": "conta_corrente",
  "initialBalance": 1000.00
}
```

Tipos válidos:
- `conta_corrente`
- `poupanca`
- `cartao_credito`
- `dinheiro`
- `investimento`

##### Listar contas
```http
GET /accounts
Authorization: Bearer <token>
```

##### Obter conta com saldo
```http
GET /accounts/:id
Authorization: Bearer <token>
```

##### Atualizar conta
```http
PUT /accounts/:id
Authorization: Bearer <token>
```
Body:
```json
{
  "name": "Nova Conta Corrente",
  "type": "conta_corrente",
  "initialBalance": 2000.00
}
```

##### Deletar conta
```http
DELETE /accounts/:id
Authorization: Bearer <token>
```

#### 💰 Transações

##### Criar transação
```http
POST /transactions
Authorization: Bearer <token>
```
Body:
```json
{
  "accountId": 1,
  "categoryId": 1,
  "description": "Compra no supermercado",
  "amount": 150.50,
  "type": "despesa",
  "transactionDate": "2024-01-15",
  "isPaid": true
}
```

Tipos válidos:
- `receita`
- `despesa`

##### Listar transações
```http
GET /transactions
Authorization: Bearer <token>
```

Query params opcionais:
- `accountId` - Filtrar por conta
- `categoryId` - Filtrar por categoria
- `type` - Filtrar por tipo (receita/despesa)
- `startDate` - Data inicial
- `endDate` - Data final
- `isPaid` - Filtrar por status de pagamento (true/false)

Exemplo:
```http
GET /transactions?accountId=1&type=despesa&startDate=2024-01-01&endDate=2024-01-31
```

##### Obter transação
```http
GET /transactions/:id
Authorization: Bearer <token>
```

##### Atualizar transação
```http
PUT /transactions/:id
Authorization: Bearer <token>
```
Body (todos os campos são opcionais):
```json
{
  "accountId": 2,
  "categoryId": 3,
  "description": "Nova descrição",
  "amount": 200.00,
  "type": "receita",
  "transactionDate": "2024-01-20",
  "isPaid": false
}
```

##### Deletar transação
```http
DELETE /transactions/:id
Authorization: Bearer <token>
```

#### 🏷️ Categorias

##### Criar categoria
```http
POST /categories
Authorization: Bearer <token>
```
Body:
```json
{
  "name": "Entretenimento"
}
```

##### Listar categorias
```http
GET /categories
Authorization: Bearer <token>
```
Retorna categorias globais + categorias do usuário

##### Atualizar categoria
```http
PUT /categories/:id
Authorization: Bearer <token>
```
Body:
```json
{
  "name": "Novo nome"
}
```

##### Deletar categoria
```http
DELETE /categories/:id
Authorization: Bearer <token>
```

### Respostas de Erro

A API retorna erros no formato:
```json
{
  "error": "Mensagem de erro"
}
```

Códigos de status HTTP comuns:
- `200` - Sucesso
- `201` - Criado com sucesso
- `204` - Deletado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação via JWT
- Rate limiting para prevenir abuso
- Helmet para headers de segurança
- Soft delete para manter histórico
- Validação de entrada de dados

## 📊 Modelo de Dados

### Tabelas

- **users** - Usuários do sistema
- **roles** - Papéis de usuário (admin, user)
- **accounts** - Contas financeiras
- **transactions** - Transações financeiras
- **categories** - Categorias de transações

### Relacionamentos

- Um usuário possui múltiplas contas
- Um usuário possui múltiplas transações
- Uma conta possui múltiplas transações
- Uma transação pertence a uma categoria
- Categorias podem ser globais (user_id = NULL) ou do usuário

## 📊 Qualidade do Código

### Code Quality Tools
- **ESLint** - Análise estática de código
- **TypeScript** - Tipagem estática
- **Jest** - Framework de testes
- **Prettier** - Formatação de código (recomendado)

### Métricas de Qualidade
- **Arquitetura**: ⭐⭐⭐⭐⭐ Hexagonal/Clean Architecture
- **Tipagem**: ⭐⭐⭐⭐⭐ TypeScript strict mode
- **Testes**: ⭐⭐⭐⚪⚪ Estrutura pronta, implementação pendente
- **Documentação**: ⭐⭐⭐⭐⭐ README completo
- **Segurança**: ⭐⭐⭐⭐⚪ JWT, bcrypt, helmet

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## � Performance e Monitoramento

### Performance
- **Rate Limiting** - Proteção contra spam e DDoS
- **Connection Pooling** - Pool de conexões PostgreSQL
- **Middleware otimizado** - Express.js com middlewares essenciais
- **Compressão** - Resposta gzip (recomendado implementar)

### Monitoramento
- **Morgan** - Logging HTTP requests
- **Health Check** - Endpoint de saúde da aplicação
- **Error Handling** - Tratamento centralizado de erros

### Próximos Passos para Performance
- [ ] Implementar cache Redis
- [ ] Adicionar métricas Prometheus
- [ ] Configurar APM (Application Performance Monitoring)
- [ ] Implementar circuit breaker
- [ ] Adicionar rate limiting por usuário

## �🗺️ Roadmap

- [ ] Implementar testes unitários
- [ ] Adicionar testes de integração
- [ ] Documentação com Swagger/OpenAPI
- [ ] Sistema de notificações
- [ ] Relatórios financeiros
- [ ] Backup automático
- [ ] API de importação de extratos
- [ ] Dashboard em tempo real
- [ ] Suporte a múltiplas moedas
- [ ] Integração com bancos

## 📝 Estrutura do Projeto

```
api/
├── src/
│   ├── domain/           # Camada de domínio
│   │   ├── entities/     # Entidades do domínio
│   │   ├── ports/        # Interfaces (contratos)
│   │   └── usecases/     # Casos de uso
│   ├── application/      # Camada de aplicação
│   │   └── services/     # Serviços da aplicação
│   └── infrastructure/   # Camada de infraestrutura
│       ├── adapters/     # Adaptadores
│       │   ├── controllers/
│       │   └── repositories/
│       ├── config/       # Configurações
│       ├── middleware/   # Middlewares
│       └── routes/       # Rotas
├── tests/               # Testes
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências
├── tsconfig.json        # Configuração TypeScript
└── README.md           # Este arquivo
```

## 👥 Contribuindo

### Pré-requisitos para Desenvolvimento
- Node.js v16+
- PostgreSQL v12+
- Git

### Padrões de Código
- Use TypeScript
- Siga o ESLint configurado
- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes acima de 80%
- Siga os princípios SOLID
- Mantenha a arquitetura hexagonal

### Processo de Contribuição
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça suas alterações seguindo os padrões
4. Execute os testes: `npm test`
5. Execute o linter: `npm run lint`
6. Commit: `git commit -m 'feat: adiciona nova feature'`
7. Push: `git push origin feature/minha-feature`
8. Abra um Pull Request

### Convenções de Commit
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Tarefas de build/configuração

## 📄 Licença

Este projeto está sob a licença ISC.

## 📧 Contato

Pieri Tech - [GitHub](https://github.com/Projetos-com-Pieri-Tech)

Project Link: [https://github.com/Projetos-com-Pieri-Tech/controle-financeiro](https://github.com/Projetos-com-Pieri-Tech/controle-financeiro)

---

**Desenvolvido com ❤️ seguindo os princípios da Arquitetura Hexagonal**