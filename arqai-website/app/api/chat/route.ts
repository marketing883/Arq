import { NextRequest, NextResponse } from "next/server";
import {
  generateChatResponse,
  streamChatResponse,
  extractLeadInfo,
  parseMetaBlock,
  META_MARKER,
  type ChatMeta,
} from "@/lib/ai/anthropic";
import { generateChatResponseOpenAI } from "@/lib/ai/openai";
import { getRelevantContentBlock } from "@/lib/ai/content-retrieval";
import type { Industry } from "@/lib/chat/types";
import { persistChatConversation, recordSession } from "@/lib/lead/lead-service";
import { processMessageForV2Intelligence } from "@/lib/lead/lead-profile-service";
import { v4 as uuidv4 } from "uuid";
import {
  UserContext,
  ConversationMessage,
  CardTrigger,
} from "@/lib/chat/types";
import {
  createInitialContext,
  updateContext,
  mergeEntitiesIntoContext,
  getNextProfilingQuestion,
  shouldAskProfilingQuestion,
  calculateEngagementLevel,
  serializeContext,
  deserializeContext,
} from "@/lib/chat/context";
import {
  extractEntities,
  detectIntent,
  detectCardTrigger,
  detectBuyingSignals,
} from "@/lib/chat/intents";
import {
  generateCardCustomizations,
  getCardFollowUp,
} from "@/lib/chat/contentEngine";
import { applyRateLimit } from "@/lib/security/rate-limiter";
import { validateInput, chatMessageSchema, sanitizeString } from "@/lib/security/validation";
import { analyzePrompt, quickSafetyCheck, sanitizePrompt } from "@/lib/security/prompt-guard";

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = applyRateLimit(request, "/api/chat", "chat");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }

    const body = await request.json();

    // Validate input with zod
    const validation = validateInput(chatMessageSchema, body);
    if (!validation.success) {
      console.error("[Chat API] Validation failed:", validation.errors);
      console.error("[Chat API] Request body keys:", Object.keys(body));
      console.error("[Chat API] Message field:", typeof body.message, body.message?.substring?.(0, 50));
      return NextResponse.json(
        { error: "Invalid input", details: validation.errors },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    const {
      message: rawMessage,
      sessionId: clientSessionId,
      userInfo,
      pageContext: clientPageContext,
      context: clientContext,
      userContext: serializedUserContext,
    } = validation.data!;

    // Get page context from either pageContext or context field (frontend sends context)
    const currentPage = clientContext?.currentPage || clientPageContext?.path || "/";
    const userName = clientContext?.userName || userInfo?.name;
    const userEmail = clientContext?.userEmail || userInfo?.email;
    const userCompany = clientContext?.userCompany || userInfo?.company;

    const conversationHistory = body.conversationHistory || [];

    // ============================================
    // ArqAI Prompt Guard™ - Multi-layer Protection
    // ============================================

    // Quick safety check first (fast path)
    if (!quickSafetyCheck(rawMessage)) {
      const threatAnalysis = analyzePrompt(rawMessage);

      // Log potential attack for security monitoring
      console.warn("[SECURITY] Potential prompt injection detected:", {
        threatLevel: threatAnalysis.threatLevel,
        score: threatAnalysis.score,
        sessionId: clientSessionId || "unknown",
      });

      // If critical threat, reject outright
      if (threatAnalysis.threatLevel === "critical") {
        return NextResponse.json(
          {
            response: "I'm here to help with questions about ArqAI and enterprise AI governance. How can I assist you today?",
            morphTrigger: null,
            sessionId: clientSessionId || uuidv4(),
            blocked: true,
          },
          { headers: rateLimitResult.headers }
        );
      }

      // For high threats, use sanitized version
      if (threatAnalysis.threatLevel === "high" && threatAnalysis.sanitizedInput) {
        // Continue with sanitized input
      }
    }

    // Full threat analysis for logging
    const threatAnalysis = analyzePrompt(rawMessage);

    // Use sanitized message if there's any threat detected
    const message = threatAnalysis.safe
      ? sanitizeString(rawMessage)
      : sanitizePrompt(rawMessage);

    // Get or generate session ID
    const sessionId = clientSessionId || uuidv4();

    // Initialize or restore user context
    let userContext: UserContext;
    if (serializedUserContext) {
      try {
        userContext = deserializeContext(serializedUserContext);
      } catch {
        userContext = createInitialContext();
      }
    } else {
      userContext = createInitialContext();
    }

    // Extract entities from the user's message
    const entities = extractEntities(message);
    userContext = mergeEntitiesIntoContext(userContext, entities);

    // Detect intent
    const intent = detectIntent(message, userContext);
    userContext = updateContext(userContext, {
      currentIntent: intent,
      topicsDiscussed: [intent],
    });

    // Detect buying signals
    const buyingSignals = detectBuyingSignals(message);
    if (buyingSignals.length > 0) {
      userContext = updateContext(userContext, {
        buyingSignals: [...userContext.buyingSignals, ...buyingSignals],
      });
    }

    // Update engagement level
    const engagementLevel = calculateEngagementLevel(
      userContext,
      conversationHistory.length
    );
    userContext = updateContext(userContext, { engagementLevel });

    // Extract legacy lead information
    const extractedInfo = extractLeadInfo(message);
    if (extractedInfo.email) {
      userContext = updateContext(userContext, { email: extractedInfo.email });
    }
    if (extractedInfo.name) {
      userContext = updateContext(userContext, { name: extractedInfo.name });
    }

    // Get request metadata for session tracking
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0].trim();

    // Ground the model in relevant published content (RAG-lite over the CMS).
    const retrievalBlock = await getRelevantContentBlock(
      message,
      userContext.topicsDiscussed.slice(-3)
    ).catch(() => "");

    // Build enhanced context for AI response
    const enhancedContext = {
      currentPage,
      userName: userContext.name || userName,
      userEmail: userContext.email || userEmail,
      userCompany: userContext.companyName || userCompany,
      conversationHistory,
      extraContext: retrievalBlock,
    };

    /**
     * Everything that happens after the model text exists: merge LLM-extracted
     * entities, morph cards, profiling cadence, persistence, V2 intelligence.
     * Shared by the streaming and JSON paths.
     */
    const finalize = (responseText: string, meta: ChatMeta | null) => {
      let response = responseText;

      // Merge structured extraction from the model (more reliable than regex)
      // on top of the regex fallback.
      if (meta?.extracted) {
        const x = meta.extracted;
        if (x.email && !extractedInfo.email) extractedInfo.email = x.email.toLowerCase();
        if (x.name && !extractedInfo.name) extractedInfo.name = x.name;
        if (x.company && !extractedInfo.company) extractedInfo.company = x.company;
        if (x.job_title && !extractedInfo.jobTitle) extractedInfo.jobTitle = x.job_title;
        if (x.phone && !extractedInfo.phone) extractedInfo.phone = x.phone;

        if (extractedInfo.email && !userContext.email) {
          userContext = updateContext(userContext, { email: extractedInfo.email });
        }
        if (extractedInfo.name && !userContext.name) {
          userContext = updateContext(userContext, { name: extractedInfo.name });
        }
        if (extractedInfo.company && !userContext.companyName) {
          userContext = updateContext(userContext, { companyName: extractedInfo.company });
        }
        if (x.industry && !userContext.industry) {
          userContext = updateContext(userContext, {
            industry: mapIndustry(x.industry),
          });
        }
        const extraTopics = [x.workflow, x.timeline, x.systems]
          .filter((v): v is string => !!v)
          .map((v) => v.toLowerCase().slice(0, 60));
        if (extraTopics.length > 0) {
          userContext = updateContext(userContext, { topicsDiscussed: extraTopics });
        }
      }

      // Detect if the response should trigger content morphing
      const morphTrigger: CardTrigger | null = detectCardTrigger(
        message,
        userContext,
        conversationHistory.map((m: ConversationMessage) => m.content)
      );

      let cardCustomizations = null;
      let cardFollowUp = null;
      if (morphTrigger && morphTrigger.confidence >= 0.7) {
        cardCustomizations = generateCardCustomizations(morphTrigger.cardType, userContext);
        cardFollowUp = getCardFollowUp(morphTrigger.cardType, userContext);
        userContext = updateContext(userContext, {
          cardsShown: [morphTrigger.cardType],
        });
      }

      // Deterministic profiling cadence (skipped when the model already asked
      // a question, a card is showing, or the model made a conversion move).
      let profilingSuffix = "";
      const madeConversionMove = !!meta?.actions?.some((a) => a.type === "ask_email");
      const recentMessages: ConversationMessage[] = conversationHistory.slice(-6);
      if (
        !morphTrigger &&
        !madeConversionMove &&
        shouldAskProfilingQuestion(userContext, conversationHistory.length, response)
      ) {
        const profilingQuestion = getNextProfilingQuestion(userContext, recentMessages);
        if (profilingQuestion) {
          profilingSuffix = "\n\n" + profilingQuestion.question;
          response = response + profilingSuffix;
          userContext = updateContext(userContext, {
            questionsAsked: [...userContext.questionsAsked, profilingQuestion.id],
          });
        }
      }

      const leadUserInfo = {
        name: userContext.name || extractedInfo.name,
        email: userContext.email || extractedInfo.email,
        company: userContext.companyName || extractedInfo.company,
        jobTitle: extractedInfo.jobTitle,
      };

      // Persist the transcript server-side (non-blocking).
      persistChatConversation(
        sessionId,
        [
          ...conversationHistory,
          { role: "user", content: message },
          { role: "assistant", content: response },
        ],
        leadUserInfo,
        currentPage
      ).catch((error) => {
        console.error(
          "Chat transcript persistence error:",
          error instanceof Error ? error.message : "Unknown"
        );
      });

      // V2 lead intelligence (non-blocking). Uses the analytics session id so
      // the chat lead joins the same browsing journey as forms and pages.
      const analyticsSessionId =
        typeof body.analyticsSessionId === "string" && body.analyticsSessionId
          ? body.analyticsSessionId
          : sessionId;
      processMessageForV2Intelligence(analyticsSessionId, message, leadUserInfo, currentPage)
        .then(({ profile, alerts, journeyChanged }) => {
          if (profile && profile.priority_tier === "P1") {
            console.log(`[LEAD V2] P1 lead: ${profile.canonical_email}, score: ${profile.composite_score}`);
          }
          if (journeyChanged && profile) {
            console.log(`[LEAD V2] Journey change: ${profile.journey_stage} for ${profile.canonical_email}`);
          }
          if (alerts.length > 0) {
            console.log(`[LEAD V2] ${alerts.length} alerts triggered for session ${sessionId}`);
          }
        })
        .catch((error) => {
          console.error("Lead V2 intelligence error:", error instanceof Error ? error.message : "Unknown");
        });

      recordSession(sessionId, { ipAddress, userAgent, currentPage }).catch((error) => {
        console.error("Session recording error:", error instanceof Error ? error.message : "Unknown");
      });

      return {
        response,
        profilingSuffix,
        payload: {
          morphTrigger: morphTrigger
            ? {
                type: morphTrigger.cardType,
                confidence: morphTrigger.confidence,
                reason: morphTrigger.reason,
                customizations: cardCustomizations,
              }
            : null,
          cardFollowUp,
          actions: meta?.actions || [],
          extractedInfo,
          sessionId,
          userContext: serializeContext(userContext),
          contextSummary: {
            industry: userContext.industry,
            painPoints: userContext.painPoints,
            complianceFrameworks: userContext.complianceFrameworks,
            engagementLevel: userContext.engagementLevel,
            completeness: getContextCompleteness(userContext),
          },
        },
      };
    };

    // ============================================
    // STREAMING PATH (SSE-style over fetch)
    // ============================================
    if (body.stream === true) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const send = (event: Record<string, unknown>) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          };

          try {
            const anthropicStream = streamChatResponse(message, enhancedContext);

            // Forward text deltas while holding back the trailing [[META ...]]
            // machine block (and any partial marker) from the visitor.
            let raw = "";
            let emitted = 0;
            const HOLDBACK = META_MARKER.length;

            anthropicStream.on("text", (delta: string) => {
              raw += delta;
              const markerAt = raw.indexOf(META_MARKER);
              const safeEnd =
                markerAt !== -1 ? markerAt : Math.max(0, raw.length - HOLDBACK);
              if (safeEnd > emitted) {
                send({ type: "text", delta: raw.slice(emitted, safeEnd) });
                emitted = safeEnd;
              }
            });

            await anthropicStream.finalMessage();

            const { text, meta } = parseMetaBlock(raw);
            // Emit any clean text the holdback kept behind.
            if (text.length > emitted) {
              send({ type: "text", delta: text.slice(emitted) });
            }

            const { profilingSuffix, payload } = finalize(text, meta);
            if (profilingSuffix) send({ type: "text", delta: profilingSuffix });
            send({ type: "meta", payload });
            send({ type: "done" });
          } catch (streamError) {
            console.error("Streaming failed, OpenAI fallback:", streamError);
            try {
              const fallbackText = await generateChatResponseOpenAI(message, enhancedContext);
              const { text, meta } = parseMetaBlock(fallbackText);
              send({ type: "text", delta: text });
              const { profilingSuffix, payload } = finalize(text, meta);
              if (profilingSuffix) send({ type: "text", delta: profilingSuffix });
              send({ type: "meta", payload: { ...payload, usedFallback: true } });
              send({ type: "done" });
            } catch (fallbackError) {
              console.error("OpenAI fallback also failed:", fallbackError);
              send({
                type: "text",
                delta:
                  "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or email us at engage@thearq.ai.",
              });
              send({ type: "meta", payload: { sessionId, error: true } });
              send({ type: "done" });
            }
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          ...rateLimitResult.headers,
        },
      });
    }

    // ============================================
    // JSON PATH (legacy clients and non-stream fallback)
    // ============================================
    let generation: { text: string; meta: ChatMeta | null };
    let usedFallback = false;

    try {
      generation = await generateChatResponse(message, enhancedContext);
    } catch (anthropicError) {
      console.error("Anthropic failed, trying OpenAI fallback:", anthropicError);
      try {
        const fallbackText = await generateChatResponseOpenAI(message, enhancedContext);
        generation = parseMetaBlock(fallbackText);
        usedFallback = true;
      } catch (openaiError) {
        console.error("OpenAI fallback also failed:", openaiError);
        return NextResponse.json({
          response:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to email us at engage@thearq.ai for immediate assistance.",
          morphTrigger: null,
          extractedInfo: {},
          error: true,
          sessionId,
          userContext: serializeContext(userContext),
        });
      }
    }

    const { response, payload } = finalize(generation.text, generation.meta);

    return NextResponse.json(
      { response, usedFallback, ...payload },
      { headers: rateLimitResult.headers }
    );
  } catch (error) {
    console.error("Chat API error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** Map a free-text industry mention onto the typed Industry union. */
function mapIndustry(value: string): Industry {
  const v = value.toLowerCase();
  if (/health|payer|hospital|pbm|tpa/.test(v)) return "healthcare";
  if (/insur|carrier|underwrit/.test(v)) return "insurance";
  if (/bank|financ|fintech|credit|lend/.test(v)) return "financial_services";
  if (/manufactur|industrial|factory/.test(v)) return "manufacturing";
  if (/retail|ecommerce|e-commerce|commerce|loyalty/.test(v)) return "retail";
  if (/tech|software|saas/.test(v)) return "technology";
  if (/government|public sector|federal/.test(v)) return "government";
  if (/energy|utilit|oil|gas/.test(v)) return "energy";
  if (/telecom/.test(v)) return "telecom";
  return "other";
}

// Helper to calculate context completeness
function getContextCompleteness(context: UserContext): number {
  let score = 0;
  if (context.industry) score += 20;
  if (context.companySize) score += 10;
  if (context.painPoints.length > 0) score += 25;
  if (context.complianceFrameworks.length > 0) score += 15;
  if (context.useCases.length > 0) score += 15;
  if (context.hasExistingAI !== null) score += 5;
  if (context.aiAgentCount !== null) score += 5;
  if (context.email) score += 5;
  return score;
}
