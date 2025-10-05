import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/middleware/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || "error" in user) return user;
    const userId = (user as any).id;
  
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [expenses, totalExpenses] = await prisma.$transaction([
      prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.expense.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      expenses,
      totalExpenses,
      currentPage: page,
      totalPages: Math.ceil(totalExpenses / limit),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch expenses" }, { status: 400 });
  }
}
