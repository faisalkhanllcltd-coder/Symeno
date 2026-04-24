// src/utils/validation.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordStrength = (
  password: string
): { valid: boolean; error?: string } => {
  if (password.length < 8)
    return { valid: false, error: 'Password must be at least 8 characters.' };
  if (!/[A-Z]/.test(password))
    return {
      valid: false,
      error: 'Password must contain an uppercase letter.',
    };
  if (!/[0-9]/.test(password))
    return { valid: false, error: 'Password must contain a number.' };
  return { valid: true };
};

export const sanitizeInput = (input: string): string => {
  // Basic XSS mitigation: strip potentially dangerous HTML brackets
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
