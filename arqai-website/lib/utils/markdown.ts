/**
 * Simple markdown to HTML converter for blog content
 * Handles: headings, paragraphs, lists, bold, italic, links, code
 */

export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Escape HTML entities first (but preserve markdown syntax)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Process code blocks first (to prevent other transformations inside them)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || "text"}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers (h1 through h6)
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/^\*\*\*$/gm, "<hr>");

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Unordered lists
  html = html.replace(/^[\*\-]\s+(.+)$/gm, "<li>$1</li>");
  // Wrap consecutive li elements in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<oli>$1</oli>");
  // Wrap consecutive oli elements in ol
  html = html.replace(/(<oli>.*<\/oli>\n?)+/g, (match) => {
    const items = match.replace(/<\/?oli>/g, (tag) => tag === "<oli>" ? "<li>" : "</li>");
    return `<ol>${items}</ol>`;
  });

  // Convert remaining newlines to paragraphs
  // Split by double newlines to get paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // Skip if already wrapped in a block-level element
      if (
        block.startsWith("<h") ||
        block.startsWith("<p") ||
        block.startsWith("<ul") ||
        block.startsWith("<ol") ||
        block.startsWith("<pre") ||
        block.startsWith("<blockquote") ||
        block.startsWith("<hr") ||
        block.startsWith("<div")
      ) {
        return block;
      }

      // Wrap in paragraph, converting single newlines to <br>
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}

/**
 * Convert HTML back to markdown (for editing)
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  let md = html;

  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

  // Bold and italic
  md = md.replace(/<strong><em>(.*?)<\/em><\/strong>/gi, "***$1***");
  md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<b>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<i>(.*?)<\/i>/gi, "*$1*");

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let index = 1;
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${index++}. $1\n`);
  });

  // Code
  md = md.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n");
  md = md.replace(/<code>(.*?)<\/code>/gi, "`$1`");

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n");

  // Paragraphs and line breaks
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, "---\n\n");

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  md = md
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up extra whitespace
  md = md.replace(/\n{3,}/g, "\n\n").trim();

  return md;
}
