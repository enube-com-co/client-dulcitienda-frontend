import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect admin routes — require a session cookie.
  // NOTE: This is a preliminary guard. Full server-side auth verification
  // should be added once a proper auth provider (NextAuth / Convex Auth) is integrated.
  // For now it blocks unauthenticated direct navigation to /admin.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = request.cookies.get("dulcitienda_session");
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
