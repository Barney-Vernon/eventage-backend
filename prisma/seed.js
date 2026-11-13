const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // 1. Create an Admin User (Upsert prevents duplicates)
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

  // 2. Create a Vendor User
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  await prisma.user.upsert({
    where: { email: 'vendor@soundsolutions.com' },
    update: {},
    create: {
      name: 'Sound Solutions Ltd',
      email: 'vendor@soundsolutions.com',
      password: vendorPassword,
      role: 'VENDOR',
    },
  });
  console.log('✅ Vendor user created: vendor@soundsolutions.com');

  // 3. Create a Client User
  const clientPassword = await bcrypt.hash('client123', 10);
  await prisma.user.upsert({
    where: { email: 'client@xyzltd.com' },
    update: {},
    create: {
      name: 'XYZ Corporation',
      email: 'client@xyzltd.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  });
  console.log('✅ Client user created: client@xyzltd.com');

  // 4. Clear existing resources to prevent duplicates
  await prisma.resource.deleteMany({}); 
  console.log('🧹 Cleared old resources');

  // 5. Create fresh Sample Resources
  const resources = [
    // Tents & Seating
    { name: 'Tent 20x20', totalQty: 10, availableQty: 10 },
    { name: 'Plastic Chair', totalQty: 500, availableQty: 500 },
    { name: 'VIP Banquet Chair', totalQty: 100, availableQty: 100 },
    
    // Tables
    { name: 'Round Table (Seats 8)', totalQty: 50, availableQty: 50 },
    { name: 'Rectangular Table', totalQty: 30, availableQty: 30 },
    
    // Sound & Lighting
    { name: 'JBL Sound System', totalQty: 5, availableQty: 5 },
    { name: 'Wireless Microphone', totalQty: 15, availableQty: 15 },
    { name: 'LED Stage Lighting Kit', totalQty: 20, availableQty: 20 },
    { name: 'Chandelier (Large)', totalQty: 8, availableQty: 8 },
    
    // Stage & Decor
    { name: 'Stage Platform (4x8 ft)', totalQty: 12, availableQty: 12 },
    { name: 'Red Carpet (20m)', totalQty: 4, availableQty: 4 },
    { name: 'Floral Backdrop', totalQty: 6, availableQty: 6 },
    
    // Power
    { name: 'Silent Generator 5kVA', totalQty: 3, availableQty: 3 }
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