import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "@/middleware/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || "error" in user) return user;
    const userId = (user as any).id;
  
    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json({ expenses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch expenses" }, { status: 400 });
  }
}
