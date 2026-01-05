import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse, extractLeadInfo } from "@/lib/ai/anthropic";
import { generateChatResponseOpenAI } from "@/lib/ai/openai";
import { processMessageForIntelligence, recordSession } from "@/lib/lead/lead-service";
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
  getContextualWelcome,
} from "@/lib/chat/contentEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      context: clientContext,
      sessionId: clientSessionId,
      userContext: serializedUserContext,
      conversationHistory = [],
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

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

    // Build enhanced context for AI response
    const enhancedContext = {
      ...clientContext,
      conversationHistory,
      userProfile: {
        industry: userContext.industry,
        companySize: userContext.companySize,
        painPoints: userContext.painPoints,
        complianceFrameworks: userContext.complianceFrameworks,
        hasExistingAI: userContext.hasExistingAI,
        aiAgentCount: userContext.aiAgentCount,
      },
      currentIntent: intent,
      engagementLevel,
    };

    let response: string;
    let usedFallback = false;

    // Try Anthropic first, fall back to OpenAI
    try {
      response = await generateChatResponse(message, enhancedContext);
    } catch (anthropicError) {
      console.error("Anthropic failed, trying OpenAI fallback:", anthropicError);
      try {
        response = await generateChatResponseOpenAI(message, enhancedContext);
        usedFallback = true;
      } catch (openaiError) {
        console.error("OpenAI fallback also failed:", openaiError);
        return NextResponse.json({
          response:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to email us at habib@thearq.ai for immediate assistance.",
          morphTrigger: null,
          extractedInfo: {},
          error: true,
          sessionId,
          userContext: serializeContext(userContext),
        });
      }
    }

    // Detect if the response should trigger content morphing
    let morphTrigger: CardTrigger | null = detectCardTrigger(
      message,
      userContext,
      conversationHistory.map((m: ConversationMessage) => m.content)
    );

    // If a card is triggered, add customizations and follow-up
    let cardCustomizations = null;
    let cardFollowUp = null;
    if (morphTrigger && morphTrigger.confidence >= 0.7) {
      cardCustomizations = generateCardCustomizations(
        morphTrigger.cardType,
        userContext
      );
      cardFollowUp = getCardFollowUp(morphTrigger.cardType, userContext);

      // Track that we showed this card
      userContext = updateContext(userContext, {
        cardsShown: [morphTrigger.cardType],
      });
    }

    // Check if we should add a profiling question
    const recentMessages: ConversationMessage[] = conversationHistory.slice(-6);
    if (
      shouldAskProfilingQuestion(userContext, conversationHistory.length, response) &&
      !morphTrigger // Don't add question if showing a card
    ) {
      const profilingQuestion = getNextProfilingQuestion(userContext, recentMessages);
      if (profilingQuestion) {
        response = response + "\n\n" + profilingQuestion.question;
        userContext = updateContext(userContext, {
          questionsAsked: [...userContext.questionsAsked, profilingQuestion.id],
        });
      }
    }

    // Process message for lead intelligence (non-blocking)
    const userInfo = {
      name: userContext.name || extractedInfo.name,
      email: userContext.email || extractedInfo.email,
      company: userContext.companyName || extractedInfo.company,
      jobTitle: extractedInfo.jobTitle,
    };

    processMessageForIntelligence(sessionId, message, userInfo, conversationHistory)
      .then(({ priorityTier }) => {
        if (priorityTier === "tier1") {
          console.log(`[LEAD ALERT] Hot lead detected in session ${sessionId}`);
        }
      })
      .catch((error) => {
        console.error("Lead intelligence processing error:", error);
      });

    // Record session activity (non-blocking)
    recordSession(sessionId, {
      ipAddress,
      userAgent,
      currentPage: clientContext?.currentPage,
    }).catch((error) => {
      console.error("Session recording error:", error);
    });

    return NextResponse.json({
      response,
      morphTrigger: morphTrigger
        ? {
            type: morphTrigger.cardType,
            confidence: morphTrigger.confidence,
            reason: morphTrigger.reason,
            customizations: cardCustomizations,
          }
        : null,
      cardFollowUp,
      extractedInfo,
      usedFallback,
      sessionId,
      userContext: serializeContext(userContext),
      contextSummary: {
        industry: userContext.industry,
        painPoints: userContext.painPoints,
        complianceFrameworks: userContext.complianceFrameworks,
        engagementLevel: userContext.engagementLevel,
        completeness: getContextCompleteness(userContext),
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper to calculate context completeness (imported separately to avoid circular deps)
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
