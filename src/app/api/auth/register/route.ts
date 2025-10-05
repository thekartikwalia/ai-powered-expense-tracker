import { NextRequest, NextResponse } from "next/server";
import { z, ZodError, treeifyError } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Zod schema for input validation
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate input
        const { username, email, password } = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "[route.ts] Error: Username or email already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
        });

        // Return user data without password
        const { passwordHash: _, ...userData } = newUser;

        return NextResponse.json({ user: userData }, { status: 201 });
    } catch (err: any) {
        if (err instanceof ZodError) {
            // Use treeifyError instead of flatten()
            return NextResponse.json(
                { error: treeifyError(err) },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: "[route.ts] Error: Internal Server Error" }, { status: 500 });
    }
}