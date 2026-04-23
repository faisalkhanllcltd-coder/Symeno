// Utility to verify user permissions before rendering sensitive admin components
export type Role = "customer" | "admin" | "manager";

export function hasAccess(userRole: string | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  if (userRole === "admin") return true; // Admins bypass all checks
  if (userRole === "manager" && requiredRole !== "admin") return true;
  return userRole === requiredRole;
}
