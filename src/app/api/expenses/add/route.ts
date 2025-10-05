import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { verifyAuth } from "@/middleware/auth";

const prisma = new PrismaClient();

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
        if (!user || "error" in user) return user;
        
        const userId = (user as any).id;

        const body = await req.json();
        const data = expenseSchema.parse(body);

        // Calculate total if recurring
        const total = data.isRecurring ? data.amount * data.frequency : data.amount;

        const expense = await prisma.expense.create({
            data: {
                ...data,
                userId,
                total,
            },
        });

        return NextResponse.json({ message: "Expense added", expense }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to add expense" }, { status: 400 });
    }
}
