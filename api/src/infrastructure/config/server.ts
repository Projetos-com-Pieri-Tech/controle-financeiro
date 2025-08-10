import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from '../middleware/errorHandler';
import { apiRateLimiter } from '../middleware/rateLimiter';

export function createServer(): Application {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());
  app.use(cors());
  
  // Rate limiting geral
  app.use(apiRateLimiter);
  
  // Logging
  app.use(morgan('combined'));
  
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // TODO: Adicionar rotas aqui
  // app.use('/api', routes);
  
  // Error handling middleware (deve ser o último)
  app.use(errorHandler);
  
  return app;
}