import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from '../web/middleware/errorHandler';
import { apiRateLimiter } from '../web/middleware/rateLimiter';
import { setupSwagger } from './swagger';
import { createRoutes } from '../web/routes';
import { Container } from './container';

export function createServer(container: Container): Application {
  const app = express();

  // Middlewares de segurança
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    }
  }));
  app.use(cors());
  
  // Rate limiting geral
  app.use(apiRateLimiter);
  
  // Logging
  app.use(morgan('combined'));
  
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Configurar Swagger
  setupSwagger(app);
  
  // Health check e API info
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      docs: '/api/docs'
    });
  });

  app.get('/api', (req, res) => {
    res.json({
      name: 'Controle Financeiro API',
      version: '1.0.0',
      description: 'API para controle financeiro pessoal',
      endpoints: {
        auth: '/api/auth',
        accounts: '/api/accounts',
        transactions: '/api/transactions',
        categories: '/api/categories',
        health: '/api/health',
        docs: '/api/docs'
      }
    });
  });
  
  // Configurar rotas da aplicação
  app.use('/api', createRoutes(container));
  
  // Error handling middleware (deve ser o último)
  app.use(errorHandler);
  
  return app;
}