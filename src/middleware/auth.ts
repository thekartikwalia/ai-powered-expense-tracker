import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function verifyAuth(req: NextRequest) {
    try {
        // const authHeader = req.headers.get('authorization');
        // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        // }
        
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Missing authentication token' }, { status: 401 });
        }
        // const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // Ensure decoded is object
        if (typeof decoded === 'string') {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 403 });
        }

        return decoded; // Now guaranteed to be JwtPayload
    } catch (err) {
        (await cookies()).set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        });
        console.error('Auth error:', err);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }
}