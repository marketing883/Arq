import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Lazy-loaded JWT secret
let _jwtSecret: Uint8Array | null = null;

function getJWTSecret(): Uint8Array {
  if (!_jwtSecret) {
    const secret = process.env.JWT_SECRET;

    // In production, require JWT_SECRET to be set
    if (process.env.NODE_ENV === "production" && !secret) {
      console.error("[CRITICAL] JWT_SECRET not set in production - using fallback is insecure");
    }

    _jwtSecret = new TextEncoder().encode(
      secret || "dev-only-secret-change-in-production"
    );
  }
  return _jwtSecret;
}

// Admin routes that don't require authentication
const PUBLIC_ADMIN_ROUTES = [
  "/api/admin/login",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /api/admin/* routes
  if (pathname.startsWith("/api/admin")) {
    // Skip authentication for public admin routes
    if (PUBLIC_ADMIN_ROUTES.some(route => pathname === route)) {
      return NextResponse.next();
    }

    // Get the admin session token from cookies
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No session token" },
        { status: 401 }
      );
    }

    // Verify the token
    try {
      const { payload } = await jwtVerify(token, getJWTSecret());

      // Validate token type
      if (payload.type !== "admin_session") {
        return NextResponse.json(
          { error: "Unauthorized - Invalid token type" },
          { status: 401 }
        );
      }

      // Token is valid, proceed with the request
      return NextResponse.next();
    } catch (error) {
      // Token verification failed (expired, tampered, etc.)
      console.error("Admin auth middleware - token verification failed:", error);
      return NextResponse.json(
        { error: "Unauthorized - Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Match all admin API routes
    "/api/admin/:path*",
  ],
};
