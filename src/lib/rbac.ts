// Utility to verify user permissions before rendering sensitive admin components
export type Role = 'customer' | 'admin' | 'staff';

export function hasAccess(
  userRole: string | undefined,
  requiredRole: Role
): boolean {
  if (!userRole) return false;
  if (userRole === 'admin') return true; // Admins bypass all checks
  if (userRole === 'staff' && requiredRole !== 'admin') return true;
  return userRole === requiredRole;
}
