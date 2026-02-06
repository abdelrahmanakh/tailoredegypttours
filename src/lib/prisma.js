import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // 1. Create a PostgreSQL connection pool
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })

  // 2. Create the Prisma Driver Adapter
  const adapter = new PrismaPg(pool)

  // 3. Initialize PrismaClient with the adapter (Required in Prisma 7+)
  return new PrismaClient({ adapter })
}

const globalForPrisma = global

export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma