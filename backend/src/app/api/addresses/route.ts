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

    if (id) {
      const address = await prisma.address.findUnique({
        where: { id, userId },
      });
      return NextResponse.json(address, { status: 200 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json(addresses, { status: 200 });
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
    const { receiverName, receiverPhone, province, district, ward, detailAddress, isDefault } = body;

    if (!receiverName || !receiverPhone || !province || !district || !ward || !detailAddress) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // If isDefault is true, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        receiverName,
        receiverPhone,
        province,
        district,
        ward,
        detailAddress,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
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
      return NextResponse.json({ message: 'Missing address ID' }, { status: 400 });
    }

    const body = await request.json();
    const { receiverName, receiverPhone, province, district, ward, detailAddress, isDefault } = body;

    // Check ownership
    const existing = await prisma.address.findUnique({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Address not found or unauthorized' }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        receiverName,
        receiverPhone,
        province,
        district,
        ward,
        detailAddress,
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json(address, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Missing address ID' }, { status: 400 });
    }

    const existing = await prisma.address.findUnique({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Address not found or unauthorized' }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
