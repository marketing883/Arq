// Deterministic contact-capture ladder for the chat.
//
// Prompt rules alone proved too passive: the model erred on the side of never
// asking for a name or email. This module computes, per turn, the single
// capture move that is due and emits an imperative system-prompt block for
// THIS reply. The chat route backstops compliance: if the model skips the
// move, the server appends the ask or injects the inline email field itself,
// so a capture step can never silently drop.
//
// The ladder (one rung per turn, never stacked):
//   1. First name, casually, by the second visitor exchange.
//   2. Work email, offered against something concrete, once they are engaged
//      (a buying signal, or simply a few exchanges in). One retry much later,
//      only on strong interest.
//   3. Company, woven in after identity is started.
//
// Every fired rung is recorded in userContext.questionsAsked so the ladder
// never nags. A visitor who ignores an ask is not asked again (except the
// single late email retry).

import type { UserContext } from "./types";

export type ConversionMoveId = "ask_name" | "ask_email" | "ask_company";

export interface ConversionMove {
  id: ConversionMoveId;
  /** Recorded in userContext.questionsAsked once the move actually happens. */
  trackId: string;
  /** Imperative block appended to the system prompt for this turn only. */
  block: string;
}

// Thresholds are in conversation messages (both roles), the same scale the
// profiling cadence uses: ~2 messages per exchange.
const NAME_ASK_AT = 2;
const EMAIL_ASK_AT = 6;
const EMAIL_ASK_WITH_SIGNAL_AT = 4;
const EMAIL_RETRY_AT = 12;
const COMPANY_ASK_AT = 8;

const DIRECTIVE_HEADER =
  "## Conversion move for THIS reply (system directive, follow it)";

export function getConversionMove(
  ctx: UserContext,
  messageCount: number
): ConversionMove | null {
  const asked = (id: string) => ctx.questionsAsked.includes(id);

  if (!ctx.name && !asked("contact_name") && messageCount >= NAME_ASK_AT) {
    return {
      id: "ask_name",
      trackId: "contact_name",
      block: `${DIRECTIVE_HEADER}
You do not know the visitor's name yet. Answer their message first, then close by casually asking their first name in one short line, e.g. "And who am I chatting with? First name is fine." Ask nothing else in that closing line.`,
    };
  }

  if (!ctx.email) {
    const engaged =
      messageCount >= EMAIL_ASK_AT ||
      (ctx.buyingSignals.length > 0 && messageCount >= EMAIL_ASK_WITH_SIGNAL_AT);
    if (!asked("contact_email") && engaged) {
      return {
        id: "ask_email",
        trackId: "contact_email",
        block: `${DIRECTIVE_HEADER}
This reply is the email moment. Answer their message first, then offer ONE concrete thing by email that matches this conversation (the relevant entry-point assessment outline, a matching case study, or a summary of this chat) in one low-pressure line, and include {"type":"ask_email"} in your actions so the inline email field renders.`,
      };
    }
    if (
      asked("contact_email") &&
      !asked("contact_email_retry") &&
      ctx.buyingSignals.length >= 2 &&
      messageCount >= EMAIL_RETRY_AT
    ) {
      return {
        id: "ask_email",
        trackId: "contact_email_retry",
        block: `${DIRECTIVE_HEADER}
They skipped the earlier email offer but keep showing real interest. Make one final, DIFFERENT offer by email (something you have not offered yet), one line, and include {"type":"ask_email"} in your actions. If they pass again, never ask for contact info in this conversation.`,
      };
    }
  }

  if (
    !ctx.companyName &&
    !asked("contact_company") &&
    (ctx.name || ctx.email) &&
    messageCount >= COMPANY_ASK_AT
  ) {
    return {
      id: "ask_company",
      trackId: "contact_company",
      block: `${DIRECTIVE_HEADER}
You do not know where they work. Answer their message first, then close by asking what company or kind of operation they are with, one short natural line.`,
    };
  }

  return null;
}
