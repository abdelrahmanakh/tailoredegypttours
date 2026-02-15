// 1. Import the prisma instance from your lib (use the relative path)
const { prisma } = require('../src/lib/prisma') 
const bcrypt = require('bcryptjs')

async function main() {
  const email = process.env.ADMIN_USER || 'admin@tailoredegypt.com'
  
  if (!process.env.ADMIN_PASS) {
    throw new Error('Please set ADMIN_PASS in your .env file.')
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 12)

  // Use the imported prisma instance
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {}, 
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
    },
  })

  console.log(`✅ Admin account ensured for: ${email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Standard cleanup
    await prisma.$disconnect()
  })