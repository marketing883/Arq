/**
 * Validation Utilities
 *
 * Input validation and sanitization functions.
 */

import { z } from "zod";

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(255, "Email too long")
  .transform((v) => v.toLowerCase().trim());

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .transform((v) => v.trim());

/**
 * Company validation schema
 */
export const companySchema = z
  .string()
  .max(200, "Company name too long")
  .transform((v) => v.trim())
  .optional();

/**
 * Phone validation schema
 */
export const phoneSchema = z
  .string()
  .regex(/^[+\d\s\-()]+$/, "Invalid phone number")
  .max(30, "Phone number too long")
  .optional();

/**
 * Message validation schema
 */
export const messageSchema = z
  .string()
  .min(1, "Message is required")
  .max(5000, "Message too long")
  .transform((v) => v.trim());

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url("Invalid URL")
  .max(2000, "URL too long")
  .optional();

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  jobTitle: z.string().max(100).optional(),
  phone: phoneSchema,
  message: messageSchema,
  inquiryType: z
    .enum(["general", "demo", "pricing", "support", "partnership"])
    .default("general"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Partner enquiry validation schema
 */
export const partnerEnquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: companySchema,
  phone: phoneSchema,
  jobTitle: z.string().max(100).optional(),
  partnershipType: z
    .enum(["reseller", "technology", "consulting", "referral", "other"])
    .default("other"),
  companySize: z.enum(["startup", "smb", "mid-market", "enterprise"]).optional(),
  message: z.string().max(5000).optional(),
  website: urlSchema,
});

export type PartnerEnquiryData = z.infer<typeof partnerEnquirySchema>;

/**
 * Newsletter subscription schema
 */
export const newsletterSchema = z.object({
  email: emailSchema,
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

/**
 * Chat message validation schema
 */
export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message too long"),
  sessionId: z.string().min(1),
  pageContext: z
    .object({
      currentPage: z.string(),
      referrer: z.string().optional(),
    })
    .optional(),
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;

/**
 * Validate data against a schema
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map((e) => e.message),
  };
}

/**
 * Check if email is from a free email provider
 */
export function isFreeEmailProvider(email: string): boolean {
  const freeProviders = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "icloud.com",
    "mail.com",
    "protonmail.com",
    "zoho.com",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return freeProviders.includes(domain);
}

/**
 * Extract domain from email
 */
export function extractEmailDomain(email: string): string | null {
  const match = email.match(/@([^@]+)$/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Check if string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
