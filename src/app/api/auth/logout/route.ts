import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        (await cookies()).set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });

        return NextResponse.json({ message: '[logout/route.ts] Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: '[logout/route.ts] Error: Internal server error' }, { status: 500 });
    }
}
