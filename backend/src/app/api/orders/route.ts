import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isAdmin = searchParams.get('admin') === 'true'; // Xác định vai trò Admin từ frontend client

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
      return NextResponse.json(order, { status: 200 });
    }

    let orders;
    if (isAdmin) {
      // Admin lấy toàn bộ đơn hàng
      orders = await prisma.order.findMany({
        include: {
          user: {
            select: { name: true, email: true },
          },
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // User lấy đơn hàng của họ
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { totalPrice, paymentMethod, address, items } = body;

    if (!totalPrice || !paymentMethod || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Missing fields or empty items' }, { status: 400 });
    }

    // Giao dịch an toàn để giảm số lượng hàng tồn kho và tạo đơn hàng
    const order = await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra tồn kho của tất cả sản phẩm
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Sản phẩm "${product.name}" đã hết hàng hoặc không đủ tồn kho.`);
        }

        // 2. Trừ hàng tồn kho
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 3. Tạo Đơn hàng
      return await tx.order.create({
        data: {
          userId,
          totalPrice: parseFloat(totalPrice),
          status: 'PENDING', // PENDING -> PREPARING -> SHIPPING -> COMPLETED
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PAID', // Bank transfer/VNPAY/Momo mặc định là PAID sau khi mô phỏng thành công
          address: typeof address === 'string' ? address : JSON.stringify(address),
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: parseInt(item.quantity),
              price: parseFloat(item.price),
              size: item.size || '',
              color: item.color || '',
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Missing order ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, paymentStatus } = body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
