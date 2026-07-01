import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/auth';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: Request) {
  try {
    const adminId = getUserIdFromRequest(request);
    if (!adminId) {
      return NextResponse.json({ message: 'Unauthorized. Invalid or expired token.' }, { status: 401 });
    }

    // Xác thực xem người gửi yêu cầu có phải là tài khoản Admin hay không
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!adminUser || adminUser.email !== 'admin@gmail.com') {
      return NextResponse.json({ message: 'Quyền truy cập bị từ chối. Chỉ dành cho Admin.' }, { status: 403 });
    }

    // Lấy danh sách toàn bộ người dùng, ẩn mật khẩu
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        dateOfBirth: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Lỗi khi lấy danh sách user:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const adminId = getUserIdFromRequest(request);
    if (!adminId) {
      return NextResponse.json({ message: 'Unauthorized. Invalid or expired token.' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!adminUser || adminUser.email !== 'admin@gmail.com') {
      return NextResponse.json({ message: 'Quyền truy cập bị từ chối. Chỉ dành cho Admin.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Thiếu mã người dùng (ID)' }, { status: 400 });
    }

    if (id === adminId) {
      return NextResponse.json({ message: 'Bạn không thể tự xóa chính mình.' }, { status: 400 });
    }

    // Xóa user khỏi cơ sở dữ liệu (Address và Order liên kết sẽ được tự động xóa theo onDelete Cascade)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Xóa người dùng thành công!' }, { status: 200 });
  } catch (error: any) {
    console.error('Lỗi khi xóa user:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
