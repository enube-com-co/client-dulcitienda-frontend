import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Role hierarchy
const ROLES = {
  admin: 3,      // Full access
  power_user: 2, // Manage orders only
  customer: 1,   // Buy only
};

// Route permissions
const ROUTE_PERMISSIONS = {
  // Admin only routes
  "/admin": ["admin"],
  "/admin/products": ["admin"],
  "/admin/inventory": ["admin"],
  "/admin/users": ["admin"],
  "/admin/categories": ["admin"],
  
  // Power user + Admin routes (order management)
  "/admin/orders": ["admin", "power_user"],
  "/pedidos/gestion": ["admin", "power_user"],
  
  // Customer + Power user + Admin (their own profile)
  "/perfil": ["admin", "power_user", "customer"],
  "/mis-pedidos": ["admin", "power_user", "customer"],
  "/carrito": ["admin", "power_user", "customer"],
};

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    const userRole = (token?.role as string) || "customer";
    
    // Check if route requires specific permissions
    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect based on role
          if (userRole === "customer") {
            return NextResponse.redirect(new URL("/perfil", req.url));
          } else if (userRole === "power_user") {
            return NextResponse.redirect(new URL("/admin/orders", req.url));
          }
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Public routes don't require auth
        const publicRoutes = ["/", "/catalogo", "/producto", "/login", "/buscar"];
        if (publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return true;
        }
        
        // All other routes require authentication
        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/perfil/:path*",
    "/mis-pedidos/:path*",
    "/pedidos/gestion/:path*",
  ],
};
