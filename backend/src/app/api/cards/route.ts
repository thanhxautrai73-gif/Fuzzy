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
      const card = await prisma.card.findFirst({
        where: { id, userId },
      });
      return NextResponse.json(card, { status: 200 });
    }

    const cards = await prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cards, { status: 200 });
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
    const { cardNumber, cardHolderName, cvv, expDate } = body;

    if (!cardNumber || !cardHolderName || !cvv || !expDate) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin thẻ' }, { status: 400 });
    }

    // Mask card number or save normally (since it's a demo, we can save normally or mask it)
    const card = await prisma.card.create({
      data: {
        userId,
        cardNumber,
        cardHolderName,
        cvv,
        expDate,
      },
    });

    return NextResponse.json(card, { status: 201 });
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
      return NextResponse.json({ message: 'Missing card ID' }, { status: 400 });
    }

    const existing = await prisma.card.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Không tìm thấy thẻ hoặc bạn không có quyền xóa' }, { status: 404 });
    }

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Xóa thẻ thành công' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
