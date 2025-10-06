import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAuth } from "@/middleware/auth";
import { ExpenseService } from "@/services/expenseService";

const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  categoryId: z.number(),
  frequency: z.number().min(1),
  isRecurring: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || "error" in user) return NextResponse.json({ status: 401 });
    const userId = (user as any).id;

    const body = await req.json();
    const data = expenseSchema.parse(body);

    const expense = await ExpenseService.createExpense({
      ...data,
      userId,
    });

    return NextResponse.json(
      { message: "Expense added", expense },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to add expense" },
      { status: 400 }
    );
  }
}
