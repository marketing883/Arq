import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse, detectMorphTriggers, extractLeadInfo } from "@/lib/ai/anthropic";
import { generateChatResponseOpenAI } from "@/lib/ai/openai";
import { processMessageForIntelligence, recordSession } from "@/lib/lead/lead-service";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, sessionId: clientSessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or generate session ID
    const sessionId = clientSessionId || uuidv4();

    // Extract any lead information from the user's message
    const extractedInfo = extractLeadInfo(message);

    // Get request metadata for session tracking
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0].trim();

    let response: string;
    let usedFallback = false;

    // Try Anthropic first, fall back to OpenAI
    try {
      response = await generateChatResponse(message, context);
    } catch (anthropicError) {
      console.error("Anthropic failed, trying OpenAI fallback:", anthropicError);
      try {
        response = await generateChatResponseOpenAI(message, context);
        usedFallback = true;
      } catch (openaiError) {
        console.error("OpenAI fallback also failed:", openaiError);
        // Return a graceful error response
        return NextResponse.json({
          response: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to email us at habib@thearq.ai for immediate assistance.",
          morphTrigger: null,
          extractedInfo: {},
          error: true,
          sessionId,
        });
      }
    }

    // Detect if the response should trigger content morphing (checks both user message and response)
    const morphTrigger = detectMorphTriggers(response, message);

    // Process message for lead intelligence (non-blocking)
    const conversationHistory = context?.conversationHistory || [];
    const userInfo = {
      name: context?.userName || extractedInfo.name,
      email: context?.userEmail || extractedInfo.email,
      company: context?.userCompany || extractedInfo.company,
      jobTitle: extractedInfo.jobTitle,
    };

    // Run lead intelligence processing in the background
    processMessageForIntelligence(sessionId, message, userInfo, conversationHistory)
      .then(({ priorityTier }) => {
        if (priorityTier === "tier1") {
          console.log(`[LEAD ALERT] Hot lead detected in session ${sessionId}`);
          // In production, this would trigger an immediate notification
        }
      })
      .catch((error) => {
        console.error("Lead intelligence processing error:", error);
      });

    // Record session activity (non-blocking)
    recordSession(sessionId, {
      ipAddress,
      userAgent,
      currentPage: context?.currentPage,
    }).catch((error) => {
      console.error("Session recording error:", error);
    });

    return NextResponse.json({
      response,
      morphTrigger,
      extractedInfo,
      usedFallback,
      sessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
