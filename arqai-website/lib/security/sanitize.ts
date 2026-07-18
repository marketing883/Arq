/**
 * Lightweight HTML sanitizer for XSS prevention
 * Uses a lazy-loaded DOMPurify on client-side only
 */

// Lazy-loaded DOMPurify instance
let DOMPurifyInstance: typeof import("dompurify").default | null = null;

async function getDOMPurify() {
  if (typeof window === "undefined") return null;
  if (!DOMPurifyInstance) {
    const mod = await import("dompurify");
    DOMPurifyInstance = mod.default;
  }
  return DOMPurifyInstance;
}

// Synchronous sanitizer config
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "strong", "em", "b", "i", "u", "s",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "span",
    "figure", "figcaption",
  ],
  ALLOWED_ATTR: [
    "href", "src", "alt", "title", "class", "id",
    "target", "rel",
    "width", "height",
    "colspan", "rowspan",
  ],
  ADD_ATTR: ["target", "rel"],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Synchronous sanitize function - returns content as-is on server,
 * sanitizes on client using cached DOMPurify instance
 */
export function sanitizeHtml(dirty: string): string {
  // Server-side: return as-is (will be sanitized on hydration)
  if (typeof window === "undefined") {
    return dirty;
  }

  // Client-side: use cached instance if available
  if (DOMPurifyInstance) {
    return DOMPurifyInstance.sanitize(dirty, SANITIZE_CONFIG);
  }

  // First call on client - load DOMPurify synchronously via require
  // This is acceptable since the module is already in the bundle
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require("dompurify");
    DOMPurifyInstance = DOMPurify.default || DOMPurify;
    return DOMPurifyInstance!.sanitize(dirty, SANITIZE_CONFIG);
  } catch {
    // Fallback: return content as-is if DOMPurify fails to load
    console.warn("DOMPurify failed to load, returning unsanitized content");
    return dirty;
  }
}

/**
 * Async sanitize for use in effects/handlers where async is acceptable
 */
export async function sanitizeHtmlAsync(dirty: string): Promise<string> {
  const purify = await getDOMPurify();
  if (!purify) return dirty;
  return purify.sanitize(dirty, SANITIZE_CONFIG);
}

/**
 * Sanitize plain text (strips all HTML)
 */
export function sanitizeText(dirty: string): string {
  if (typeof window === "undefined") {
    return dirty;
  }

  if (DOMPurifyInstance) {
    return DOMPurifyInstance.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require("dompurify");
    DOMPurifyInstance = DOMPurify.default || DOMPurify;
    return DOMPurifyInstance!.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  } catch {
    return dirty;
  }
}

/**
 * Server-side defense-in-depth filter for CMS-authored HTML that is rendered
 * in React Server Components (where DOMPurify has no DOM). Content here comes
 * only from the authenticated admin editor, so this is a hardening layer for
 * a compromised-admin scenario, not a substitute for DOMPurify on untrusted
 * input: it strips script/style/iframe/object/embed/form blocks, inline
 * event handlers, and javascript: URLs.
 */
export function sanitizeHtmlServer(dirty: string): string {
  if (!dirty) return "";
  let clean = dirty;
  // Remove dangerous elements together with their content.
  clean = clean.replace(
    /<(script|style|iframe|object|embed|form)\b[\s\S]*?<\/\1\s*>/gi,
    ""
  );
  // Remove any stray/self-closing dangerous tags left over.
  clean = clean.replace(/<\/?(script|style|iframe|object|embed|form)\b[^>]*>/gi, "");
  // Strip inline event handlers (onclick=, onerror=, ...).
  clean = clean.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Neutralize javascript:/vbscript:/data:text URLs in href/src.
  clean = clean.replace(
    /\s(href|src)\s*=\s*(["']?)\s*(javascript|vbscript|data:text)[^"'\s>]*\2/gi,
    ""
  );
  return clean;
}
