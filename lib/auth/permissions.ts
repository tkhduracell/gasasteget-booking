import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserWithPermissions } from "./types";

export const PERMISSIONS = {
  BOOKINGS_CREATE: "bookings.create",
  BOOKINGS_READ: "bookings.read",
  BOOKINGS_UPDATE: "bookings.update",
  BOOKINGS_DELETE: "bookings.delete",
  USERS_READ: "users.read",
  USERS_MANAGE: "users.manage",
  ROLES_ASSIGN: "roles.assign",
} as const;

export type PermissionAction = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Get the current authenticated user with their roles and permissions.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<UserWithPermissions | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch user roles
  const { data: userRoles } = await supabase.rpc("get_user_roles", {
    p_user_id: user.id,
  });

  const roles = (userRoles as { role_name: string }[] | null)?.map(
    (r) => r.role_name
  ) ?? [];

  // Fetch permissions based on roles
  const { data: rolePermissions } = await supabase
    .from("user_roles")
    .select(
      `
      roles:role_id (
        role_permissions (
          permissions:permission_id (
            action
          )
        )
      )
    `
    )
    .eq("user_id", user.id);

  const permissions = new Set<string>();
  if (rolePermissions) {
    for (const ur of rolePermissions) {
      const roles = ur.roles as unknown as {
        role_permissions: { permissions: { action: string } }[];
      };
      if (roles?.role_permissions) {
        for (const rp of roles.role_permissions) {
          if (rp.permissions?.action) {
            permissions.add(rp.permissions.action);
          }
        }
      }
    }
  }

  return {
    id: user.id,
    email: user.email ?? "",
    roles,
    permissions: Array.from(permissions),
  };
}

/**
 * Check if the current user has a specific permission.
 */
export async function hasPermission(action: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.permissions.includes(action);
}

/**
 * Require a specific permission. Redirects to /dashboard if denied.
 */
export async function requirePermission(action: string): Promise<void> {
  const allowed = await hasPermission(action);
  if (!allowed) {
    redirect("/dashboard");
  }
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(roleName: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.roles.includes(roleName);
}

/**
 * Require a specific role. Redirects to /dashboard if denied.
 */
export async function requireRole(roleName: string): Promise<void> {
  const allowed = await hasRole(roleName);
  if (!allowed) {
    redirect("/dashboard");
  }
}
