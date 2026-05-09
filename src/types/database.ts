export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'staff' | 'customer';
  created_at: string;
}

export interface CatalogCache {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  images_json: string;
  rating: number | null;
  review_count: number;
  source: string;
  source_url: string | null;
  scraped_at: number;
  in_stock: number;
  variants_json: string | null;
  tags_json: string | null;
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