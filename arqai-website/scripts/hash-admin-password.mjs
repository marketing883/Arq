#!/usr/bin/env node
// Prints an ADMIN_USERS entry for a new admin.
// Usage: node scripts/hash-admin-password.mjs <email-or-username> "<password>"
import bcrypt from "bcryptjs";

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error('Usage: node scripts/hash-admin-password.mjs <email-or-username> "<password>"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(`${username.toLowerCase().trim()}:${hash}`);
