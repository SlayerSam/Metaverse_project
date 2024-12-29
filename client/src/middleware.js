import { NextResponse } from "next/server";
import { loggedInCookieName } from "./utils/constants";

export function middleware(request) {
    const { value } = request.cookies.get(loggedInCookieName)
        ? request.cookies.get(loggedInCookieName)
        : false;
    const isLoggedIn = value === "true";
    const { pathname } = request.nextUrl;

    if (isLoggedIn && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}