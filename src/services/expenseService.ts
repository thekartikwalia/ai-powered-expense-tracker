import { PrismaClient, Expense } from "@prisma/client";
const prisma = new PrismaClient();

export class ExpenseService {
    /**
     * Calculate total amount for an expense.
     * If isRecurring is true, total = amount * frequency
     */
    static calculateTotal(expense: Pick<Expense, "amount" | "frequency" | "isRecurring">) {
        return expense.isRecurring ? expense.amount * expense.frequency : expense.amount;
    }

    /**
     * Create a new expense with total calculated
     */
    static async createExpense(data: {
        userId: number;
        title: string;
        amount: number;
        frequency: number;
        isRecurring: boolean;
        categoryId: number;
    }) {
        const total = this.calculateTotal(data);

        const expense = await prisma.expense.create({
            data: {
                ...data,
                total,
            },
            include: {
                category: true
            }
        });

        return expense;
    }

    /**
     * Update an existing expense and recalculate total
     */
    static async updateExpense(
        id: number,
        userId: number,
        updates: Partial<Pick<Expense, "title" | "amount" | "frequency" | "isRecurring" | "categoryId">>
    ) {
        if (updates.amount !== undefined || updates.frequency !== undefined || updates.isRecurring !== undefined) {
            const existing = await prisma.expense.findUnique({ where: { id, userId } });
            if (!existing) throw new Error("Expense not found");

            const updatedData = {
                ...updates,
                total: this.calculateTotal({
                    amount: updates.amount ?? existing.amount,
                    frequency: updates.frequency ?? existing.frequency,
                    isRecurring: updates.isRecurring ?? existing.isRecurring,
                }),
            };

            return prisma.expense.update({
                where: { id },
                data: updatedData,
            });
        }

        // If no amount/frequency/isRecurring updates, just update other fields
        return prisma.expense.update({
            where: { id },
            data: updates,
        });
    }

    /**
     * Get summary of all expenses for a user
     */
    static async getUserExpenses(userId: number) {
        return prisma.expense.findMany({
            where: { userId },
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
    }

    /**
     * Delete an expense
     */
    static async deleteExpense(id: number, userId: number) {
        return prisma.expense.deleteMany({
            where: { id, userId },
        });
    }
}
