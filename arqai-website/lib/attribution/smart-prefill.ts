/**
 * Smart pre-fill helpers for lead forms:
 * - infer a company name from a work-email domain
 * - recognize returning visitors from the chat widget's stored info
 */

/** Domains that never imply a company (submissions from these are rejected
 * later by the work-email check anyway, so never infer from them). */
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "yandex.com",
  "yandex.ru",
  "rediffmail.com",
]);

/** Second-level labels that mean "not the company name" (co.uk, com.au...). */
const GENERIC_SECOND_LEVEL = new Set(["co", "com", "org", "net", "gov", "ac", "edu"]);

/**
 * Infer a display-ready company name from a work-email address.
 * "jane@acme-health.io" -> "Acme Health"; free providers -> "".
 */
export function inferCompanyFromEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return "";
  const domain = email.slice(at + 1).toLowerCase().trim();
  if (!domain.includes(".") || FREE_EMAIL_DOMAINS.has(domain)) return "";

  const labels = domain.split(".");
  // Walk left past the TLD (and country-code second levels like co.uk).
  let idx = labels.length - 2;
  if (idx > 0 && GENERIC_SECOND_LEVEL.has(labels[idx])) idx -= 1;
  const core = labels[idx];
  if (!core || core.length < 2) return "";

  return core
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export type ReturningVisitor = {
  name: string;
  email: string;
  company: string;
};

/**
 * Info the visitor previously shared with the chat widget
 * (localStorage "arqai_user_info"), or null.
 */
export function getReturningVisitor(): ReturningVisitor | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("arqai_user_info");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
    const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
    if (!name && !email) return null;
    return {
      name,
      email,
      company: typeof parsed.company === "string" ? parsed.company.trim() : "",
    };
  } catch {
    return null;
  }
}
