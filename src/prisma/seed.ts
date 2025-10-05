import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Seed Categories
    const categories = [
        { name: "Food", description: "Meals, groceries, dining out" },
        { name: "Travel", description: "Transport, flights, fuel, cabs" },
        { name: "Rent", description: "Housing expenses" },
        { name: "Utilities", description: "Electricity, water, internet, phone bills" },
        { name: "Others", description: "Miscellaneous expenses" },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }
    console.log("[seed.ts]: Default categories seeded successfully");

    // Seed Users
    const users = [
        { username: "admin", email: "admin@example.com", password: "admin123" },
        { username: "testuser", email: "test@example.com", password: "test123" },
    ];

    const createdUsers = [];

    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                username: u.username,
                email: u.email,
                passwordHash: hashedPassword,
            },
        });
        createdUsers.push(user);
    }
    console.log("[seed.ts]: Default users seeded successfully");

    // Seed Sample Expenses for each user
    const categoryMap = await prisma.category.findMany();
    const getCategoryByName = (name: string) =>
        categoryMap.find((c) => c.name === name);

    for (const user of createdUsers) {
        const sampleExpenses = [
            {
                title: "Lunch at cafe",
                category: getCategoryByName("Food"),
                amount: 12.5,
                frequency: 1,
                isRecurring: false,
            },
            {
                title: "Monthly Rent",
                category: getCategoryByName("Rent"),
                amount: 500,
                frequency: 1,
                isRecurring: true,
            },
            {
                title: "Internet Bill",
                category: getCategoryByName("Utilities"),
                amount: 40,
                frequency: 1,
                isRecurring: true,
            },
            {
                title: "Taxi Ride",
                category: getCategoryByName("Travel"),
                amount: 15,
                frequency: 2,
                isRecurring: false,
            },
        ];

        for (const exp of sampleExpenses) {
            if (!exp.category) continue; // skip if category not found
            await prisma.expense.create({
                data: {
                    title: exp.title,
                    amount: exp.amount,
                    frequency: exp.frequency,
                    isRecurring: exp.isRecurring,
                    total: exp.amount * exp.frequency,
                    userId: user.id,
                    categoryId: exp.category?.id,
                },
            });
        }
    }

    console.log("[seed.ts]: Sample expenses seeded successfully");
}

main()
    .catch((e) => {
        console.error("[seed.ts] Error: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
