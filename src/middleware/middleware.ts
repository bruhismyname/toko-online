import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export function middleware(req: Request) {
  const cookies = req.headers.get("cookie");
  const parsed = cookies ? parse(cookies) : {};
  const token = parsed.token;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
