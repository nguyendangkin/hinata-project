// middleware.ts (thay thế toàn bộ)
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // Nếu đã login mà vào login/register thì redirect
    if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
    ) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // Nếu chưa login mà vào protected routes thì redirect về login
    if (
        !isLoggedIn &&
        !nextUrl.pathname.startsWith("/login") &&
        !nextUrl.pathname.startsWith("/register")
    ) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Nếu không match điều kiện nào thì tiếp tục bình thường
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
