export type Role = "owner" | "admin" | "accountant" | "viewer";

type Permission =
  | "invoice:create"
  | "invoice:edit"
  | "invoice:delete"
  | "invoice:read"
  | "expense:create"
  | "expense:edit"
  | "expense:delete"
  | "expense:read"
  | "customer:create"
  | "customer:edit"
  | "customer:delete"
  | "customer:read"
  | "vendor:create"
  | "vendor:edit"
  | "vendor:delete"
  | "vendor:read"
  | "settings:read"
  | "settings:write"
  | "billing:manage"
  | "team:manage";

const ROLES_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    "invoice:create", "invoice:edit", "invoice:delete", "invoice:read",
    "expense:create", "expense:edit", "expense:delete", "expense:read",
    "customer:create", "customer:edit", "customer:delete", "customer:read",
    "vendor:create", "vendor:edit", "vendor:delete", "vendor:read",
    "settings:read", "settings:write", "billing:manage", "team:manage",
  ],
  admin: [
    "invoice:create", "invoice:edit", "invoice:delete", "invoice:read",
    "expense:create", "expense:edit", "expense:delete", "expense:read",
    "customer:create", "customer:edit", "customer:delete", "customer:read",
    "vendor:create", "vendor:edit", "vendor:delete", "vendor:read",
    "settings:read", "settings:write", "team:manage",
  ],
  accountant: [
    "invoice:create", "invoice:edit", "invoice:read",
    "expense:create", "expense:edit", "expense:read",
    "customer:create", "customer:edit", "customer:read",
    "vendor:create", "vendor:edit", "vendor:read",
    "settings:read",
  ],
  viewer: [
    "invoice:read",
    "expense:read",
    "customer:read",
    "vendor:read",
    "settings:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLES_PERMISSIONS[role].includes(permission);
}
