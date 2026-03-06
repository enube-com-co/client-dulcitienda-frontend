import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role hierarchy
const ROLES = {
  admin: 3,
  power_user: 2,
  customer: 1,
};

// Route permissions
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/admin": ["admin"],
  "/admin/products": ["admin"],
  "/admin/inventory": ["admin"],
  "/admin/users": ["admin"],
  "/admin/orders": ["admin", "power_user"],
  "/perfil": ["admin", "power_user", "customer"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Check if route requires authentication
  const requiresAuth = Object.keys(ROUTE_PERMISSIONS).some(route => 
    pathname.startsWith(route)
  );
  
  if (requiresAuth) {
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    const userRole = (token.role as string) || "customer";
    
    // Check route permissions
    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect based on role
          if (userRole === "customer") {
            return NextResponse.redirect(new URL("/perfil", request.url));
          } else if (userRole === "power_user") {
            return NextResponse.redirect(new URL("/admin/orders", request.url));
          }
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/perfil/:path*",
  ],
};
