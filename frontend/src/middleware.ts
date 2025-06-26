import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const role = req.auth?.user?.role;

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
        !nextUrl.pathname.startsWith("/register") &&
        !nextUrl.pathname.startsWith("/forgot-password")
    ) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Nếu đã login nhưng cố vào /admin mà không có role admin thì
    if (
        isLoggedIn &&
        nextUrl.pathname.startsWith("/admin") &&
        role !== "admin"
    ) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // Nếu đã login và bị cấm (role === "ban") thì không được vào route /post
    if (isLoggedIn && role === "ban" && nextUrl.pathname.startsWith("/post")) {
        return NextResponse.redirect(new URL("/ban", nextUrl));
    }

    // nếu không match điều kiện nào thì tiếp tục bình thường
    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
