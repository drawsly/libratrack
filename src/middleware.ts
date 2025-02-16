import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register'
    ],
}

export async function middleware(request: NextRequest) {
    const hasSession = request.cookies.has('auth_session');

    const isAuthPage = ['/login', '/register'].includes(request.nextUrl.pathname);

    if (isAuthPage && hasSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isAuthPage && !hasSession) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}