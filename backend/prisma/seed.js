const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Xóa sạch dữ liệu cũ
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Đã xóa dữ liệu cũ.');

  // Tạo tài khoản Admin mặc định
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      phone: '0987654321',
      dateOfBirth: '1990-01-01',
      avatar: '/images/profile.png'
    }
  });
  console.log('Đã tạo tài khoản Admin mặc định.');

  // Tạo các danh mục
  const categories = [
    { name: 'Sofa', icon: 'sofa.svg', slug: 'sofa' },
    { name: 'Chair', icon: 'chair.svg', slug: 'chair' },
    { name: 'Table', icon: 'table.svg', slug: 'table' },
    { name: 'Cabinets', icon: 'cabinets.svg', slug: 'cabinets' },
    { name: 'Cupboard', icon: 'cupboard.svg', slug: 'cupboard' },
    { name: 'Lamp', icon: 'lamp.svg', slug: 'lamp' },
    { name: 'Decor', icon: 'decor.svg', slug: 'decor' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.create({ data: cat });
    createdCategories.push(c);
  }
  console.log('Đã tạo danh mục mẫu.');

  // Tìm ID danh mục
  const sofaCat = createdCategories.find(c => c.slug === 'sofa');
  const chairCat = createdCategories.find(c => c.slug === 'chair');
  const tableCat = createdCategories.find(c => c.slug === 'table');
  const lampCat = createdCategories.find(c => c.slug === 'lamp');
  const decorCat = createdCategories.find(c => c.slug === 'decor');

  // Tạo các sản phẩm
  const products = [
    {
      name: 'Buddy Chair',
      description: 'Modern saddle arms',
      price: 20.00,
      salePrice: 14.00,
      stock: 15,
      image: '/images/1.png',
      images: '/images/1.png',
      sizes: 'Standard',
      colors: 'Yellow,Gray',
      categoryId: chairCat.id,
    },
    {
      name: 'Wingback Chair',
      description: 'Modern saddle arms',
      price: 20.00,
      salePrice: 14.00,
      stock: 15,
      image: '/images/2.png',
      images: '/images/2.png',
      sizes: 'Standard',
      colors: 'Green,Gray',
      categoryId: chairCat.id,
    },
    {
      name: 'Wingback Chair (Trending)',
      description: 'Modern arms chairs',
      price: 35.00,
      salePrice: 25.00,
      stock: 8,
      image: '/images/3.png',
      images: '/images/3.png',
      sizes: 'Standard',
      colors: 'Beige,Brown',
      categoryId: chairCat.id,
    },
    {
      name: 'Mid Century Sofa',
      description: 'Modern arms Sofa',
      price: 999.00,
      salePrice: null,
      stock: 5,
      image: '/images/4.png',
      images: '/images/4.png',
      sizes: '2 Seater,3 Seater',
      colors: 'Blue,Gray',
      categoryId: sofaCat.id,
    },
    {
      name: 'Beige Chair',
      description: 'Modern arms chair',
      price: 37.00,
      salePrice: null,
      stock: 10,
      image: '/images/5.png',
      images: '/images/5.png',
      sizes: 'Standard',
      colors: 'Beige',
      categoryId: chairCat.id,
    },
    {
      name: 'Table Lamp',
      description: 'Bedroom Study Table Lamp',
      price: 37.00,
      salePrice: null,
      stock: 20,
      image: '/images/6.png',
      images: '/images/6.png',
      sizes: 'Standard',
      colors: 'White,Black',
      categoryId: lampCat.id,
    },
    {
      name: 'Side Table',
      description: 'Solid wood console table',
      price: 45.00,
      salePrice: 37.00,
      stock: 12,
      image: '/images/7.png',
      images: '/images/7.png',
      sizes: 'Standard',
      colors: 'Brown,Natural Oak',
      categoryId: tableCat.id,
    },
    {
      name: 'Lounge Chair',
      description: 'Modern arms chair',
      price: 37.00,
      salePrice: null,
      stock: 15,
      image: '/images/8.png',
      images: '/images/8.png',
      sizes: 'Standard',
      colors: 'Gray,Black',
      categoryId: chairCat.id,
    },
    {
      name: 'Swing Chair',
      description: 'Modern steel swing chair',
      price: 37.00,
      salePrice: null,
      stock: 10,
      image: '/images/9.png',
      images: '/images/9.png',
      sizes: 'Standard',
      colors: 'White,Gray',
      categoryId: chairCat.id,
    },
    {
      name: 'Bubble Swing Chair',
      description: 'Modern Swing Chair',
      price: 120.00,
      salePrice: null,
      stock: 8,
      image: '/images/10.png',
      images: '/images/10.png',
      sizes: 'Standard',
      colors: 'Black,White',
      categoryId: chairCat.id,
    },
    {
      name: 'Lounge Chair (Accent)',
      description: 'Modern arms chair',
      price: 120.00,
      salePrice: null,
      stock: 12,
      image: '/images/11.png',
      images: '/images/11.png',
      sizes: 'Standard',
      colors: 'Gray,Green',
      categoryId: chairCat.id,
    },
    {
      name: 'Double Bed Sheet',
      description: 'Modern double bed sheet',
      price: 120.00,
      salePrice: null,
      stock: 25,
      image: '/images/12.png',
      images: '/images/12.png',
      sizes: 'Queen,King',
      colors: 'White,Blue,Pink',
      categoryId: decorCat.id,
    },
    {
      name: 'Hanging Light',
      description: 'Metal hanging light',
      price: 120.00,
      salePrice: null,
      stock: 15,
      image: '/images/13.png',
      images: '/images/13.png',
      sizes: 'Standard',
      colors: 'Gold,Black',
      categoryId: lampCat.id,
    }
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  console.log('Đã tạo các sản phẩm mẫu thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
