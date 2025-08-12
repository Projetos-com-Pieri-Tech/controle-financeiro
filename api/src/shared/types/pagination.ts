export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export class PaginationHelper {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  static parsePaginationParams(query: Record<string, unknown>): PaginationParams {
    const page = Math.max(1, parseInt(String(query.page || this.DEFAULT_PAGE)));
    const limit = Math.min(
      this.MAX_LIMIT,
      Math.max(1, parseInt(String(query.limit || this.DEFAULT_LIMIT)))
    );
    const sortBy = typeof query.sortBy === 'string' ? query.sortBy : undefined;
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    return { page, limit, sortBy, sortOrder };
  }

  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    params: PaginationParams
  ): PaginatedResponse<T> {
    const page = params.page || this.DEFAULT_PAGE;
    const limit = params.limit || this.DEFAULT_LIMIT;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      ...(params.sortBy && {
        sort: {
          field: params.sortBy,
          order: params.sortOrder || 'asc'
        }
      })
    };
  }

  static getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}