/**
 * Slug Generator Module
 *
 * Utilities for generating URL-safe slugs from titles.
 */

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, "-")
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, "")
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    // Limit length
    .substring(0, 100);
}

/**
 * Validate a slug format
 */
export function isValidSlug(slug: string): boolean {
  // Must be lowercase, alphanumeric with hyphens only
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Sanitize a slug
 */
export function sanitizeSlug(slug: string): string {
  return generateSlug(slug);
}

/**
 * Generate slug with timestamp suffix for uniqueness
 */
export function generateTimestampedSlug(title: string): string {
  const baseSlug = generateSlug(title);
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

/**
 * Extract base slug (without numeric suffix)
 */
export function getBaseSlug(slug: string): string {
  // Remove trailing -N suffix if present
  return slug.replace(/-\d+$/, "");
}

/**
 * Generate slug variations for search
 */
export function generateSlugVariations(slug: string): string[] {
  const baseSlug = getBaseSlug(slug);
  const variations = [slug, baseSlug];

  // Add common variations
  if (baseSlug.includes("-")) {
    // Without hyphens
    variations.push(baseSlug.replace(/-/g, ""));
    // With underscores
    variations.push(baseSlug.replace(/-/g, "_"));
  }

  return Array.from(new Set(variations));
}
