import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton. Next.js hot-reloads modules in dev, which would
 * otherwise create a new PrismaClient (and a new DB connection pool) on
 * every edit. Caching it on `globalThis` in non-production avoids that.
 *
 * Server-only: never import this from a Client Component.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
