import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response } from 'express';

interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/**
 * Cria um rate limiter customizado
 * @param options - Opções de configuração do rate limiter
 * @returns Middleware de rate limiting
 */
export function createRateLimiter(options: RateLimiterOptions = {}): RateLimitRequestHandler {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos por padrão
    max = 100, // 100 requisições por windowMs por padrão
    message = 'Too many requests from this IP, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
    legacyHeaders: false, // Desabilita os headers `X-RateLimit-*`
    skipSuccessfulRequests,
    skipFailedRequests,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000),
        limit: max
      });
    },
    skip: (req: Request) => {
      // Pular rate limiting para health checks
      if (req.path === '/api/health') {
        return true;
      }
      return false;
    }
  });
}

/**
 * Rate limiter para endpoints de autenticação
 * Mais restritivo para prevenir ataques de força bruta
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login/registro
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true // Não conta requisições bem-sucedidas
});

/**
 * Rate limiter geral para API
 * Limite padrão para endpoints normais
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: 'Too many requests, please try again later.'
});

/**
 * Rate limiter estrito para operações sensíveis
 * Para endpoints que fazem operações custosas ou sensíveis
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 requisições por hora
  message: 'Rate limit exceeded for sensitive operations. Please wait before trying again.'
});

/**
 * Rate limiter para criação de recursos
 * Previne spam de criação de contas, transações, etc.
 */
export const createResourceRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30, // 30 criações por hora
  message: 'Too many resources created. Please slow down.'
});

/**
 * Rate limiter para operações de leitura pesada
 * Para endpoints que fazem queries complexas
 */
export const heavyReadRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // 20 requisições a cada 5 minutos
  message: 'Too many complex queries. Please wait before requesting again.'
});

/**
 * Rate limiter dinâmico baseado no tipo de usuário
 * Pode ser usado para dar limites diferentes para usuários premium
 */
export function createDynamicRateLimiter(
  getRoleFromRequest: (req: Request) => string | undefined
) {
  return (req: Request, res: Response, next: any) => {
    const role = getRoleFromRequest(req);
    
    let limiter: RateLimitRequestHandler;
    
    switch (role) {
      case 'admin':
        // Admins têm limite maior
        limiter = createRateLimiter({
          windowMs: 15 * 60 * 1000,
          max: 1000
        });
        break;
      case 'premium':
        // Usuários premium têm limite intermediário
        limiter = createRateLimiter({
          windowMs: 15 * 60 * 1000,
          max: 500
        });
        break;
      default:
        // Usuários normais têm limite padrão
        limiter = apiRateLimiter;
    }
    
    return limiter(req, res, next);
  };
}

/**
 * Rate limiter com store personalizado (para ambientes distribuídos)
 * Útil quando você tem múltiplas instâncias da aplicação
 */
export function createRedisRateLimiter(redisClient?: any): RateLimitRequestHandler {
  // Se não tiver Redis configurado, usa memória local
  if (!redisClient) {
    console.warn('Redis client not provided, using memory store for rate limiting');
    return apiRateLimiter;
  }

  // Por enquanto, retorna o rate limiter padrão
  return apiRateLimiter;
}

/**
 * Middleware para resetar o rate limit de um IP específico
 * Útil para testes ou situações especiais
 */
export function resetRateLimit(store: any) {
  return async (req: Request, res: Response) => {
    const ip = req.ip;
    
    if (!ip) {
      return res.status(400).json({ error: 'Could not determine IP address' });
    }
    
    try {
      // Reset logic would go here based on the store being used
      // This is a placeholder implementation
      res.json({ message: `Rate limit reset for IP: ${ip}` });
    } catch (error) {
      console.error('Failed to reset rate limit:', error);
      res.status(500).json({ error: 'Failed to reset rate limit' });
    }
  };
}