/**
 * ArqAI Anti-Spam & Work Email Validation
 * Blocks free email providers, honeypot bots, and suspiciously fast submissions
 */

// Free/personal email domains to block — only work emails accepted
const BLOCKED_EMAIL_DOMAINS = new Set([
  // Google
  "gmail.com",
  "googlemail.com",
  // Yahoo
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "yahoo.ca",
  "yahoo.com.au",
  "rocketmail.com",
  // Microsoft
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.co.uk",
  "live.com",
  "msn.com",
  // Apple
  "icloud.com",
  "me.com",
  "mac.com",
  // Other free providers
  "aol.com",
  "mail.com",
  "protonmail.com",
  "protonmail.ch",
  "proton.me",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "gmx.com",
  "gmx.net",
  "tutanota.com",
  "tuta.io",
  "fastmail.com",
  "hushmail.com",
  "inbox.com",
  "mail.ru",
  "qq.com",
  "163.com",
  "126.com",
  "sina.com",
  "rediffmail.com",
  "hey.com",
  // ISP-based
  "cox.net",
  "sbcglobal.net",
  "verizon.net",
  "att.net",
  "comcast.net",
  "charter.net",
  "earthlink.net",
  "optonline.net",
  "bellsouth.net",
  // Disposable/temp email
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "yopmail.com",
  "trashmail.com",
]);

// Minimum time (ms) between form load and submission — bots submit instantly
const MIN_SUBMISSION_TIME_MS = 3000;

/**
 * Check if an email is from a work/business domain (not a free provider)
 */
export function isWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_EMAIL_DOMAINS.has(domain);
}

/**
 * Validate the honeypot field — should be empty for real users
 * Returns true if the submission is legitimate (field is empty/absent)
 */
export function validateHoneypot(honeypotValue: string | undefined | null): boolean {
  return !honeypotValue;
}

/**
 * Validate submission timing — reject if submitted too quickly after page load
 * Returns true if the timing is legitimate
 */
export function validateSubmissionTiming(formLoadedAt: number | undefined | null): boolean {
  if (!formLoadedAt || typeof formLoadedAt !== "number") return true; // Don't block if timestamp missing
  const elapsed = Date.now() - formLoadedAt;
  return elapsed >= MIN_SUBMISSION_TIME_MS;
}

/**
 * Combined anti-spam validation for form submissions.
 *
 * Returns:
 * - { passed: true } for legitimate submissions
 * - { passed: false, silent: true } for bot detections (return fake success to not tip off bots)
 * - { passed: false, silent: false, error: string } for work email failures (show error to user)
 */
export function validateAntiSpam(body: {
  email?: string;
  website_url?: string;
  _formLoadedAt?: number;
}): { passed: true } | { passed: false; silent: true } | { passed: false; silent: false; error: string } {
  const { email, website_url, _formLoadedAt } = body;

  // Honeypot check — bots fill hidden fields
  if (!validateHoneypot(website_url)) {
    return { passed: false, silent: true };
  }

  // Timing check — bots submit instantly
  if (!validateSubmissionTiming(_formLoadedAt)) {
    return { passed: false, silent: true };
  }

  // Work email check — show clear error to real users
  if (email && !isWorkEmail(email)) {
    return {
      passed: false,
      silent: false,
      error: "Please use your work email address. Free email providers (Gmail, Yahoo, Outlook, etc.) are not accepted.",
    };
  }

  return { passed: true };
}
