export const ADMIN_ROLES = ['SUPER_ADMIN', 'READ_EXPORT'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_PERMISSIONS = [
  'dashboard:read',
  'records:read',
  'exports:create',
  'imports:create',
  'credentials:decide',
  'referrals:manage',
  'founding:manage',
  'launch-benefits:manage',
  'markets:manage',
  'notifications:manage',
  'admins:manage',
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

const PERMISSIONS: Record<AdminRole, ReadonlySet<AdminPermission>> = {
  SUPER_ADMIN: new Set(ADMIN_PERMISSIONS),
  READ_EXPORT: new Set(['dashboard:read', 'records:read', 'exports:create']),
};

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && ADMIN_ROLES.includes(value as AdminRole);
}

export function canAdmin(
  role: AdminRole,
  permission: AdminPermission,
): boolean {
  return PERMISSIONS[role].has(permission);
}

export function adminRoleLabel(role: AdminRole): string {
  return role === 'SUPER_ADMIN' ? 'Super Admin' : 'Read & Export';
}
