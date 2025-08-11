import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Controle Financeiro API',
      version: '1.0.0',
      description: `
        API REST para controle financeiro pessoal desenvolvida com arquitetura hexagonal.
        
        ## Funcionalidades:
        - 🔐 Autenticação JWT
        - 👥 Sistema de usuários com roles
        - 💳 Gerenciamento de contas
        - 🏷️ Categorização de transações
        - 💰 Controle de receitas e despesas
        
        ## Autenticação:
        A maioria dos endpoints requer autenticação via JWT. 
        Após fazer login, use o token no header: \`Authorization: Bearer {token}\`
      `,
      contact: {
        name: 'Pieri Tech',
        email: 'contato@pieritech.com.br'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no endpoint de login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            roleId: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Account: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012' },
            userId: { type: 'string', format: 'uuid', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
            name: { type: 'string', example: 'Conta Corrente' },
            type: { 
              type: 'string', 
              enum: ['conta_corrente', 'poupanca', 'cartao_credito', 'dinheiro', 'investimento'],
              example: 'conta_corrente'
            },
            initialBalance: { type: 'number', format: 'decimal', example: 1000.50 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'c3d4e5f6-g7h8-9012-cdef-345678901234' },
            userId: { type: 'string', format: 'uuid', nullable: true, example: null },
            name: { type: 'string', example: 'Alimentação' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'd4e5f6g7-h8i9-0123-defg-456789012345' },
            userId: { type: 'string', format: 'uuid', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
            accountId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012' },
            categoryId: { type: 'string', format: 'uuid', nullable: true, example: 'c3d4e5f6-g7h8-9012-cdef-345678901234' },
            description: { type: 'string', example: 'Almoço no restaurante' },
            amount: { type: 'number', format: 'decimal', example: 45.90 },
            type: { type: 'string', enum: ['receita', 'despesa'], example: 'despesa' },
            transactionDate: { type: 'string', format: 'date', example: '2025-08-11' },
            isPaid: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
            details: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Campo obrigatório']
            }
          }
        },
        // Request DTOs
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' },
            roleId: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }
          }
        },
        CreateAccountRequest: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: { type: 'string', example: 'Conta Corrente' },
            type: { 
              type: 'string', 
              enum: ['conta_corrente', 'poupanca', 'cartao_credito', 'dinheiro', 'investimento'],
              example: 'conta_corrente'
            },
            initialBalance: { type: 'number', format: 'decimal', example: 1000.50 }
          }
        },
        UpdateAccountRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Conta Corrente Atualizada' },
            type: { 
              type: 'string', 
              enum: ['conta_corrente', 'poupanca', 'cartao_credito', 'dinheiro', 'investimento'],
              example: 'poupanca'
            }
          }
        },
        CreateTransactionRequest: {
          type: 'object',
          required: ['accountId', 'description', 'amount', 'type', 'transactionDate'],
          properties: {
            accountId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012' },
            categoryId: { type: 'string', format: 'uuid', example: 'c3d4e5f6-g7h8-9012-cdef-345678901234' },
            description: { type: 'string', example: 'Almoço no restaurante' },
            amount: { type: 'number', format: 'decimal', example: 45.90 },
            type: { type: 'string', enum: ['receita', 'despesa'], example: 'despesa' },
            transactionDate: { type: 'string', format: 'date', example: '2025-08-11' },
            isPaid: { type: 'boolean', example: true }
          }
        },
        UpdateTransactionRequest: {
          type: 'object',
          properties: {
            accountId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012' },
            categoryId: { type: 'string', format: 'uuid', example: 'c3d4e5f6-g7h8-9012-cdef-345678901234' },
            description: { type: 'string', example: 'Almoço no restaurante atualizado' },
            amount: { type: 'number', format: 'decimal', example: 50.00 },
            type: { type: 'string', enum: ['receita', 'despesa'], example: 'despesa' },
            transactionDate: { type: 'string', format: 'date', example: '2025-08-11' },
            isPaid: { type: 'boolean', example: false }
          }
        },
        CreateCategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Alimentação' },
            isGlobal: { type: 'boolean', example: false }
          }
        },
        UpdateCategoryRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Alimentação Atualizada' }
          }
        },
        // Response DTOs
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        },
        AccountBalanceResponse: {
          type: 'object',
          properties: {
            accountId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6g7-8901-bcde-f23456789012' },
            balance: { type: 'number', format: 'decimal', example: 1245.75 },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/infrastructure/routes/*.ts',
    './src/infrastructure/adapters/controllers/*.ts'
  ]
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Controle Financeiro API - Documentação',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    }
  }));

  // JSON da documentação
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export { specs };
