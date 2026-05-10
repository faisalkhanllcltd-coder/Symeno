import { z } from 'zod';

// Centralized schema registry for the application
export const loginSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase().trim()),
  password: z.string().min(1),
});

// We can add future schemas here (e.g., checkoutSchema, registerSchema) 
// to keep your API routes lightweight and your validation logic strictly centralized.