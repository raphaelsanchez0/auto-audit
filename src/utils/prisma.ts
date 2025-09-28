import { PrismaClient } from "../generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL!,
      },
    },
    log: ["query", "error", "warn"], // optional logs
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
