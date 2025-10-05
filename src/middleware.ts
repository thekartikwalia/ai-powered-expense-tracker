import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token || token=='') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // try {
    //     jwt.verify(token, process.env.JWT_SECRET!);
    //     return NextResponse.next();
    // } catch {
    //     return NextResponse.redirect(new URL('/login', req.url));
    // }
}

// Apply middleware to protected routes
export const config = {
    matcher: ['/dashboard/:path*', '/expenses/:path*', '/reports/:path*'],
};
