import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "arqai-admin-secret-key-change-in-production"
);

const ADMIN_CREDENTIALS = {
  username: "arqadmin",
  // Pre-hashed password for "Qautntumleap@1"
  passwordHash: "$2a$10$6KwZVXqOKqgQxzxqL.kQZefLZKqF7TBJvjHQvJiOj5/Q1qNB4Xk/.",
};

export interface AdminSession {
  username: string;
  iat: number;
  exp: number;
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (username !== ADMIN_CREDENTIALS.username) {
    return false;
  }

  // For demo, allow direct password check
  if (password === "Qautntumleap@1") {
    return true;
  }

  // Also support hashed password comparison
  try {
    return await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
  } catch {
    return false;
  }
}

/**
 * Create admin session token
 */
export async function createAdminSession(username: string): Promise<string> {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify admin session token
 */
export async function verifyAdminSession(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
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
 * Set admin session cookie
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
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
