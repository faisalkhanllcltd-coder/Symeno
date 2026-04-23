export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "customer" | "staff";
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  wholesale_price: number;
  retail_price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  created_at: string;
}