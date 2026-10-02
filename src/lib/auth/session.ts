/**
 * Authentication/authorization boundary.
 *
 * Step 1 deliberately does NOT wire up a real identity provider or
 * session store yet — no fake login, no placeholder users. This file
 * defines the *shape* every route/component will depend on, so Step 2 can
 * implement it (Auth.js + Prisma adapter, scoped to StaffUser/Role) without
 * changing any calling code.
 *
 * Server-only. Never import into a Client Component.
 */

import { ROLE_HIERARCHY, type RoleName } from "@/domain/staff/types";

export interface StaffSession {
  staffId: string;
  hotelId: string;
  propertyId: string | null;
  email: string;
  role: RoleName;
}

/**
 * Returns the current staff session, or null when signed out.
 * TODO(step 2): implement against Auth.js session + StaffUser lookup.
 */
export async function getStaffSession(): Promise<StaffSession | null> {
  return null;
}

export function hasAtLeastRole(role: RoleName, minimum: RoleName): boolean {
  return ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimum);
}

/**
 * Guard for server actions/route handlers. Throws when unauthenticated or
 * under-privileged, so callers can rely on it rather than re-checking.
 * TODO(step 2): wire to getStaffSession() once real auth exists.
 */
export async function requireRole(minimum: RoleName): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  if (!hasAtLeastRole(session.role, minimum)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
