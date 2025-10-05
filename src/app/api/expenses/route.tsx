import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const decoded = await verifyAuth(req);

  // If verifyAuth returns a NextResponse (error), return it immediately
  if (decoded instanceof NextResponse) return decoded;

  const userId = (decoded as any).id;

  const expenses = await prisma.expense.findMany({ where: { userId } });
  return NextResponse.json(expenses);
}
