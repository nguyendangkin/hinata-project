import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // nếu đã login mà vào login/register thì redirect
    if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
    ) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // nếu chưa login mà vào protected routes thì redirect về login
    if (
        !isLoggedIn &&
        !nextUrl.pathname.startsWith("/login") &&
        !nextUrl.pathname.startsWith("/register")
    ) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // nếu không match điều kiện nào thì tiếp tục bình thường
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
