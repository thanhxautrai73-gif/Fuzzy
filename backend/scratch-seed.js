const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Đang kết nối tới database và cập nhật người dùng...');

  // Reset/Tạo tài khoản admin
  const adminEmail = 'admin@gmail.com';
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      name: 'Admin',
      phone: '0123456789',
      avatar: '/images/profile.png'
    },
    create: {
      email: adminEmail,
      password: hashedAdminPassword,
      name: 'Admin',
      phone: '0123456789',
      avatar: '/images/profile.png'
    }
  });
  console.log('Đã cập nhật/tạo tài khoản admin mặc định:', { id: admin.id, email: admin.email });

  // Reset/Tạo tài khoản user thường
  const userEmail = 'user@gmail.com';
  const hashedUserPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      password: hashedUserPassword,
      name: 'Marlin Watkin',
      phone: '0987654321',
      avatar: '/images/profile.png'
    },
    create: {
      email: userEmail,
      password: hashedUserPassword,
      name: 'Marlin Watkin',
      phone: '0987654321',
      avatar: '/images/profile.png'
    }
  });
  console.log('Đã cập nhật/tạo tài khoản user mặc định:', { id: user.id, email: user.email });

  console.log('Hủy kết nối database thành công.');
}

main()
  .catch((e) => {
    console.error('Lỗi khi thực thi seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
