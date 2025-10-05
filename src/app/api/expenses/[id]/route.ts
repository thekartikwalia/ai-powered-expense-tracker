import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { verifyAuth } from "@/middleware/auth";

const prisma = new PrismaClient();

const expenseUpdateSchema = z.object({
    title: z.string().optional(),
    amount: z.number().positive().optional(),
    categoryId: z.number().optional(),
    frequency: z.number().min(1).optional(),
    isRecurring: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await verifyAuth(req);
    if (!user || "error" in user) return user;
    const userId = (user as any).id;

    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid expense id" }, { status: 400 });

    const expense = await prisma.expense.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!expense || expense.userId !== userId) {
        return NextResponse.json({ error: "[expenses/[id]/route.ts] Error: Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ expense });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await verifyAuth(req);
        if (!user || "error" in user) return user;
        const userId = (user as any).id;

        const id = parseInt(params.id);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid expense id" }, { status: 400 });

        const body = await req.json();
        const data = expenseUpdateSchema.parse(body);

        const expense = await prisma.expense.update({
            where: { id },
            data: { ...data, total: data.amount ? (data.isRecurring ? data.amount * (data.frequency || 1) : data.amount) : undefined },
        });

        if (expense.userId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        return NextResponse.json({ message: "Expense updated", expense });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update expense" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await verifyAuth(req);
    if (!user || "error" in user) return user;
    const userId = (user as any).id;

    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid expense id" }, { status: 400 });

    try {
        const expense = await prisma.expense.delete({
            where: { id },
        });

        if (expense.userId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        return NextResponse.json({ message: "Expense deleted" });
    } catch {
        return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
}
