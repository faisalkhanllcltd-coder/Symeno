export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'staff' | 'customer';
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  basePrice: number;
  retailPrice: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  category: string;
  categorySlug: string;
  brand: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  created_at: string;
}
