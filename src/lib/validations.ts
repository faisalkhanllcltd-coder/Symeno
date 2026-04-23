// src/lib/validations.ts
import { z } from 'zod';

// Global API payload protectors
export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  base_price: z.number().positive("Price must be strictly positive"),
  retail_price: z.number().positive().optional(),
  description: z.string().optional(),
  brand: z.string().min(1),
});

export const addressSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  country: z.string().min(2),
  state: z.string().min(2),
  city: z.string().min(2),
  line1: z.string().min(5),
  line2: z.string().optional(),
  landmark: z.string().optional()
});

// Utility to wrap API calls with Zod validation
export function validatePayload<T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.errors[0].message };
}