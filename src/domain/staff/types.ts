/**
 * Role vocabulary for staff access control.
 *
 * Kept here, in the domain layer, rather than imported from the generated
 * Prisma client: application code (auth guards, UI role checks) should
 * depend on a stable domain type, not on whether `prisma generate` has
 * been run. This union is kept in sync with the `RoleName` enum in
 * `prisma/schema.prisma` by hand — they describe the same concept from
 * two layers (domain vs. persistence) on purpose.
 */
export type RoleName = "OWNER" | "MANAGER" | "FRONT_DESK" | "HOUSEKEEPING" | "STAFF";

/** Ascending privilege order, least to most privileged. */
export const ROLE_HIERARCHY: RoleName[] = [
  "STAFF",
  "HOUSEKEEPING",
  "FRONT_DESK",
  "MANAGER",
  "OWNER",
];
