// Generic error interfaces for cross-cutting concerns
export interface ErrorResponse {
  error: string;
  details?: string[];
  timestamp?: string;
  path?: string;
}

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Utility function to create standardized error responses
export function createErrorResponse(error: any, path?: string): ErrorResponse {
  return {
    error: error.message || 'Internal Server Error',
    details: error.details || undefined,
    timestamp: new Date().toISOString(),
    path: path
  };
}
