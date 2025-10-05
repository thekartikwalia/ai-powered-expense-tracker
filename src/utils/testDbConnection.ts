import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        // Try fetching all users
        const users = await prisma.user.findMany();
        console.log("Database connection successful. Users:", users);
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
