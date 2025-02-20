import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from 'next/server';

export const privateRoutes = ["/dashboard(.*)"];

const { auth } = NextAuth(authConfig);

export default auth(async (req, ev) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const isPrivateRoute = privateRoutes.some(route => new RegExp(route).test(nextUrl.pathname));
    const isAuthRoute = ["/login", "/register"].some(route => nextUrl.pathname.includes(route));
    const isApiRoute = nextUrl.pathname.includes("/api");

    if (isApiRoute) return NextResponse.next();

    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (isAuthRoute && !isLoggedIn) return NextResponse.next();

    if (!isLoggedIn && isPrivateRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};