export interface Product {
  id: string;
  slug: string;
  brand: string;
  category: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number | null;
  reviewCount: number;
  inStock: boolean;
  sourceUrl?: string | null;
  tags?: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  slug: string;
  name: string;
  priceAdjustment: number;
  inventoryQuantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: number;
}