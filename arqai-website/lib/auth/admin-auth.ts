import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Lazy-loaded JWT secret to avoid build-time errors
let _jwtSecret: Uint8Array | null = null;

function getJWTSecret(): Uint8Array {
  if (!_jwtSecret) {
    const secret = process.env.JWT_SECRET;

    // Warn in production if secret is not set
    if (process.env.NODE_ENV === "production" && !secret) {
      console.error("[SECURITY WARNING] JWT_SECRET not set in production environment");
    }

    _jwtSecret = new TextEncoder().encode(
      secret || "dev-only-secret-change-in-production"
    );
  }
  return _jwtSecret;
}

// Admin credentials from environment (or database in production)
// Password hash can be generated with: npx bcryptjs hash "your-password"
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "arqadmin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ||
  // Default dev hash for "AdminDev2026!" - CHANGE IN PRODUCTION
  "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4edVy3qPF0nS5.Ey";

export interface AdminSession {
  username: string;
  iat: number;
  exp: number;
}

/**
 * Verify admin credentials securely
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // Timing-safe comparison for username
  if (username.length !== ADMIN_USERNAME.length) {
    // Still run bcrypt to prevent timing attacks
    await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    return false;
  }

  let usernameMatch = true;
  for (let i = 0; i < username.length; i++) {
    if (username[i] !== ADMIN_USERNAME[i]) {
      usernameMatch = false;
    }
  }

  if (!usernameMatch) {
    // Still run bcrypt to prevent timing attacks
    await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    return false;
  }

  // Verify password with bcrypt
  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch {
    return false;
  }
}

/**
 * Create admin session token with enhanced security
 */
export async function createAdminSession(username: string): Promise<string> {
  const token = await new SignJWT({
    username,
    type: "admin_session",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // Reduced from 24h for security
    .setJti(crypto.randomUUID()) // Unique token ID
    .sign(getJWTSecret());

  return token;
}

/**
 * Verify admin session token
 */
export async function verifyAdminSession(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJWTSecret());

    // Validate token type
    if (payload.type !== "admin_session") {
      return null;
    }

    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

/**
 * Get current admin session from cookies
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return null;
  }

  return verifyAdminSession(token);
}

/**
 * Set admin session cookie with secure attributes
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Changed from "lax" for better CSRF protection
    maxAge: 60 * 60 * 8, // 8 hours (matches token expiry)
    path: "/",
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

/**
 * Generate a secure password hash (utility function)
 */
export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
