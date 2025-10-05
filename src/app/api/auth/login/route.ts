import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: '[login/route.ts] Error: Email and password required' }, { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: '[login/route.ts] Error: Invalid email or password' }, { status: 401 });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: '[login/route.ts] Error: Invalid email or password' }, { status: 401 });
        }

        // Create JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        // Send token in response
        return NextResponse.json({
            message: '[login/route.ts] Login successful',
            token,
            user: { id: user.id, email: user.email, username: user.username },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: '[login/route.ts] Error: Internal server error' }, { status: 500 });
    }
}
