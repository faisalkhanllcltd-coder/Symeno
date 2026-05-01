// src/types/api.ts
// Flexible response envelopes that do not break existing Svelte fetch requests

export type ApiError = { error: string; code?: string; details?: unknown };

// By allowing [key: string]: any, we permit flat responses like { success: true, orderId: "123" }
// without forcing a nested { data: { orderId: "123" } } structure.
export type ApiSuccess<T = Record<string, any>> = { success: true } & T;

export type ApiResponse<T = Record<string, any>> = ApiSuccess<T> | ApiError;

// Standard pagination structure for admin tables
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
