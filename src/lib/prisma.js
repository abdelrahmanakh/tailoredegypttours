import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

// Create a connection pool
const pool = new Pool({ connectionString })

// Create the Prisma adapter
const adapter = new PrismaPg(pool)

// Instantiate Prisma Client with the adapter
const prisma = new PrismaClient({ adapter })

export { prisma }