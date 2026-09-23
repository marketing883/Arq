import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Lazy-loaded JWT secret to avoid build-time errors
let _jwtSecret: Uint8Array | null = null;

function getJWTSecret(): Uint8Array {
  if (!_jwtSecret) {
    const secret = process.env.JWT_SECRET;

    // Require JWT_SECRET in production
    if (process.env.NODE_ENV === "production" && !secret) {
      throw new Error("[CRITICAL] JWT_SECRET environment variable must be set in production");
    }

    // Warn about weak secret
    if (secret && secret.length < 32) {
      console.warn("[SECURITY WARNING] JWT_SECRET should be at least 32 characters for security");
    }

    _jwtSecret = new TextEncoder().encode(
      secret || "dev-only-secret-change-in-production"
    );
  }
  return _jwtSecret;
}

// Admin credentials from environment (or database in production)
// Password hash can be generated with: node scripts/hash-admin-password.mjs "your-password"
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "arqadmin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ||
  // Default dev hash for "AdminDev2026!" - CHANGE IN PRODUCTION
  "$2a$12$DTnQmO4EalX9n/UeZUh.3OV2hTjtJD9dQBh2txDG8eQnTZR/GXaZu";

// Additional admins, one "username:bcrypt-hash" pair per entry, comma separated:
//   ADMIN_USERS='first@example.com:$2a$12$...,second@example.com:$2a$12$...'
// bcrypt hashes never contain ":" or ",", so the format is unambiguous.
// A "\$" left over from escaping the hash for dotenv is read as "$".
function parseAdminUsers(raw: string | undefined): Map<string, string> {
  const users = new Map<string, string>();
  users.set(ADMIN_USERNAME.toLowerCase().trim(), ADMIN_PASSWORD_HASH);

  for (const entry of (raw || "").split(",")) {
    const separator = entry.indexOf(":");
    if (separator <= 0) continue;
    const username = entry.slice(0, separator).toLowerCase().trim();
    const hash = entry.slice(separator + 1).trim().replace(/\\\$/g, "$");
    if (username && hash) {
      users.set(username, hash);
    }
  }
  return users;
}

const ADMIN_USERS = parseAdminUsers(process.env.ADMIN_USERS);

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
  const hash = ADMIN_USERS.get(username.toLowerCase().trim());

  if (!hash) {
    // Still run bcrypt to prevent timing attacks / username enumeration
    await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    return false;
  }

  // Verify password with bcrypt
  try {
    return await bcrypt.compare(password, hash);
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
    .setExpirationTime("2h") // Short session for security
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
    maxAge: 60 * 60 * 2, // 2 hours (matches token expiry)
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
