import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const sqliteUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const prisma =
  global.prisma ??
  new PrismaClient({
    datasources: { db: { url: sqliteUrl } },
  });
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
