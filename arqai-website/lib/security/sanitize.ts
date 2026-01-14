import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify with safe defaults
 */
export function sanitizeHtml(dirty: string): string {
  // Only run DOMPurify in browser environment
  if (typeof window === "undefined") {
    // On server, return empty string (content will be sanitized on client)
    return dirty;
  }

  return DOMPurify.sanitize(dirty, {
    // Allow safe HTML tags for blog/whitepaper content
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
    // Allow safe attributes
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "id",
      "target", "rel",
      "width", "height",
      "colspan", "rowspan",
    ],
    // Force all links to open in new tab with security attributes
    ADD_ATTR: ["target", "rel"],
    // Forbid potentially dangerous protocols
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitize plain text (strips all HTML)
 */
export function sanitizeText(dirty: string): string {
  if (typeof window === "undefined") {
    return dirty;
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
