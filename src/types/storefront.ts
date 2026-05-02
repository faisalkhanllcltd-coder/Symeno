// src/types/storefront.ts

export interface Product {
  id: string;
  slug: string;
  brand: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  basePrice: number;
  retailPrice: number | null; // For calculating the 'strike-through' RRP
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  slug: string; // explicit replacement for sku
  title: string; // e.g., "Space Black" or "256GB"
  priceAdjustment: number; // e.g., +50.00 for higher storage
  inventoryQuantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: number; // Timestamp for session timeouts
}
