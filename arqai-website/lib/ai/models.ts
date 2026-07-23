/**
 * Central Anthropic model configuration.
 *
 * Keeping the model id in one place lets us upgrade every AI call site at once
 * and avoids scattering a soon-to-be-deprecated string across the codebase.
 */

// Current, most capable Anthropic model. Supports the web_search server tool
// and rejects temperature/top_p, so call sites must not pass sampling params.
export const LEAD_INTEL_MODEL = "claude-opus-4-8";
