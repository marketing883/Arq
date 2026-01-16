import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSession,
  setAdminSessionCookie,
} from "@/lib/auth/admin-auth";
import { applyRateLimit } from "@/lib/security/rate-limiter";
import { validateInput, adminLoginSchema } from "@/lib/security/validation";

export async function POST(request: NextRequest) {
  console.log("Admin login attempt - checking env vars...");
  console.log("JWT_SECRET set:", !!process.env.JWT_SECRET);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  try {
    // Apply strict rate limiting for auth endpoints
    const rateLimitResult = applyRateLimit(request, "/api/admin/login", "auth");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    const body = await request.json();

    // Validate input with zod
    const validation = validateInput(adminLoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    const { username, password } = validation.data!;

    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      // Generic error message to prevent username enumeration
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers: rateLimitResult.headers }
      );
    }

    // Create session token
    const token = await createAdminSession(username);

    // Set session cookie
    await setAdminSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { headers: rateLimitResult.headers }
    );
  } catch (error) {
    // Log error with stack trace for debugging
    console.error("Admin login error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
