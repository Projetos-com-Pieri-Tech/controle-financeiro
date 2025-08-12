export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private context: string;

  private constructor(context: string = 'Application') {
    this.context = context;
    this.logLevel = this.getLogLevelFromEnv();
  }

  static getInstance(context?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context);
    }
    return Logger.instance;
  }

  static createLogger(context: string): Logger {
    return new Logger(context);
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    switch (level) {
      case 'ERROR': return LogLevel.ERROR;
      case 'WARN': return LogLevel.WARN;
      case 'INFO': return LogLevel.INFO;
      case 'DEBUG': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      metadata,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
    };
  }

  private formatForConsole(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = entry.timestamp;
    const context = entry.context;
    
    let output = `[${timestamp}] ${levelName} [${context}]: ${entry.message}`;
    
    if (entry.metadata) {
      output += `\nMetadata: ${JSON.stringify(entry.metadata, null, 2)}`;
    }
    
    if (entry.error) {
      output += `\nError: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack) {
        output += `\nStack: ${entry.error.stack}`;
      }
    }
    
    return output;
  }

  private output(entry: LogEntry): void {
    const formatted = this.formatForConsole(entry);
    
    switch (entry.level) {
      case LogLevel.ERROR:
        // eslint-disable-next-line no-console
        console.error(formatted);
        break;
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(formatted);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(formatted);
        break;
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(formatted);
        break;
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, message, metadata, error);
    this.output(entry);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.createLogEntry(LogLevel.WARN, message, metadata);
    this.output(entry);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.createLogEntry(LogLevel.INFO, message, metadata);
    this.output(entry);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.createLogEntry(LogLevel.DEBUG, message, metadata);
    this.output(entry);
  }

  // Métodos específicos para contextos da aplicação
  database(message: string, metadata?: Record<string, unknown>): void {
    this.debug(`[DATABASE] ${message}`, metadata);
  }

  auth(message: string, metadata?: Record<string, unknown>): void {
    this.info(`[AUTH] ${message}`, metadata);
  }

  transaction(message: string, metadata?: Record<string, unknown>): void {
    this.info(`[TRANSACTION] ${message}`, metadata);
  }

  performance(message: string, duration: number, metadata?: Record<string, unknown>): void {
    this.info(`[PERFORMANCE] ${message}`, { 
      duration: `${duration}ms`,
      ...metadata 
    });
  }

  security(message: string, metadata?: Record<string, unknown>): void {
    this.warn(`[SECURITY] ${message}`, metadata);
  }
}

// Instâncias globais para diferentes contextos
export const logger = Logger.getInstance();
export const dbLogger = Logger.createLogger('Database');
export const authLogger = Logger.createLogger('Authentication');
export const apiLogger = Logger.createLogger('API');
export const errorLogger = Logger.createLogger('Error');