const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // 1. Create an Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventage.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@eventage.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Sample Resources
  const resources = [
    { name: 'Tent 20x20', totalQty: 10, availableQty: 10 },
    { name: 'Plastic Chair', totalQty: 500, availableQty: 500 },
    { name: 'JBL Sound System', totalQty: 5, availableQty: 5 },
  ];

  for (const res of resources) {
    await prisma.resource.create({ data: res });
  }
  console.log('✅ Sample resources created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });