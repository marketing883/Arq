/**
 * Central AI model configuration, tiered by task so cost tracks value.
 *
 * Tiers (Anthropic):
 *  - CHAT_MODEL: the site assistant. High volume, short replies, must follow
 *    the conversion playbook and machine-block protocol reliably. Sonnet 5
 *    delivers near-Opus instruction-following at a fraction of the price.
 *  - RESEARCH_MODEL: lead dossiers, domain research, sales email drafting.
 *    Low volume, quality-sensitive synthesis. Sonnet 5.
 *  - FAST_MODEL: cheap structured classification (form-time lead enrichment).
 *    Haiku 4.5.
 *  - CONTENT_MODEL: CMS long-form generation. Sonnet 5.
 *
 * Current-generation models support the web_search server tool and reject
 * temperature/top_p, so call sites must not pass sampling params.
 *
 * OpenAI fallbacks (used only when Anthropic is unavailable):
 *  - OPENAI_FAST_MODEL for chat, OPENAI_QUALITY_MODEL for research/email.
 *    Replaces the legacy gpt-4-turbo-preview, which cost more than Opus.
 */

export const CHAT_MODEL = "claude-sonnet-5";
export const RESEARCH_MODEL = "claude-sonnet-5";
export const FAST_MODEL = "claude-haiku-4-5";
export const CONTENT_MODEL = "claude-sonnet-5";

/** Back-compat alias; prefer the task-specific constants above. */
export const LEAD_INTEL_MODEL = RESEARCH_MODEL;

export const OPENAI_FAST_MODEL = "gpt-4o-mini";
export const OPENAI_QUALITY_MODEL = "gpt-4o";
