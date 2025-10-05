import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function verifyAuth(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // Return decoded payload (user info)
        return decoded;
    } catch (err) {
        console.error('Auth error:', err);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }
}
