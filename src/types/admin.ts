// src/types/admin.ts
import type { User, Order } from './database';

export interface DashboardStats {
  revenue: number;
  orderCount: number;
  activeUsers: number;
  lowStockItems: number;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: 'UPDATE_INVENTORY' | 'PROCESS_REFUND' | 'DELETE_USER' | 'UPDATE_SETTINGS';
  details: string;
  timestamp: Date;
}
