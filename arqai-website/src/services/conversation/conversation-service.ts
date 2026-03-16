/**
 * Conversation Service Implementation
 *
 * Manages chat conversations and integrates with AI for responses.
 */

import type {
  IConversationService,
  IConversationRepository,
  IAIService,
} from "@/src/core";
import type {
  Conversation,
  Message,
  DetectedIntent,
  PageContext,
} from "@/src/core";
import { getEventBus, generateEventId, createEventMetadata } from "@/src/core";
import type {
  ConversationStartedEvent,
  ConversationMessageEvent,
  ConversationEndedEvent,
} from "@/src/core";
import { detectIntent, extractSignals } from "./intent-detector";

export interface ConversationServiceDependencies {
  conversationRepository: IConversationRepository;
  aiService: IAIService;
}

export class ConversationService implements IConversationService {
  private conversationRepo: IConversationRepository;
  private aiService: IAIService;
  private eventBus = getEventBus();

  constructor(deps: ConversationServiceDependencies) {
    this.conversationRepo = deps.conversationRepository;
    this.aiService = deps.aiService;
  }

  async create(
    sessionId: string,
    pageContext?: Record<string, string>
  ): Promise<Conversation> {
    const conversation = await this.conversationRepo.create({
      sessionId,
      messages: [],
      pageContext: pageContext ? { currentPage: pageContext.currentPage || '', ...pageContext } as PageContext : undefined,
      startedAt: new Date(),
      isActive: true,
    });

    // Emit event
    const event: ConversationStartedEvent = {
      eventId: generateEventId(),
      eventType: "conversation.started",
      timestamp: new Date(),
      metadata: createEventMetadata({ sessionId }),
      data: {
        conversationId: conversation.id,
        sessionId,
        pageUrl: pageContext?.currentPage,
      },
    };
    this.eventBus.emit(event);

    return conversation;
  }

  async getById(id: string): Promise<Conversation | null> {
    return this.conversationRepo.findById(id);
  }

  async getActiveForSession(sessionId: string): Promise<Conversation | null> {
    return this.conversationRepo.findActiveBySession(sessionId);
  }

  async addMessage(conversationId: string, message: Message): Promise<Conversation> {
    const conversation = await this.conversationRepo.addMessage(conversationId, message);

    // Detect intent and signals from user messages
    let intentDetected: string | undefined;
    let signalsDetected: string[] | undefined;

    if (message.role === "user") {
      const intent = await this.detectIntent(message.content);
      intentDetected = intent.intent;

      const signals = extractSignals(message.content);
      signalsDetected = signals.map((s) => s.type);
    }

    // Emit event
    const event: ConversationMessageEvent = {
      eventId: generateEventId(),
      eventType: "conversation.message",
      timestamp: new Date(),
      metadata: createEventMetadata({ sessionId: conversation.sessionId }),
      data: {
        conversationId,
        messageId: message.id || generateEventId(),
        role: message.role,
        intentDetected,
        signalsDetected,
      },
    };
    this.eventBus.emit(event);

    return conversation;
  }

  async endConversation(conversationId: string): Promise<void> {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) return;

    await this.conversationRepo.endConversation(conversationId);

    // Calculate conversation stats
    const duration = conversation.startedAt
      ? (new Date().getTime() - conversation.startedAt.getTime()) / 1000
      : 0;

    const intentsDetected = conversation.messages
      .filter((m) => m.role === "user")
      .map((m) => detectIntent(m.content).intent)
      .filter((intent, index, self) => self.indexOf(intent) === index);

    // Check if lead was captured (has user info)
    const leadCaptured = conversation.metadata?.leadCaptured ?? false;

    // Emit event
    const event: ConversationEndedEvent = {
      eventId: generateEventId(),
      eventType: "conversation.ended",
      timestamp: new Date(),
      metadata: createEventMetadata({ sessionId: conversation.sessionId }),
      data: {
        conversationId,
        messageCount: conversation.messages.length,
        duration: Math.round(duration),
        leadCaptured,
        intentsDetected,
      },
    };
    this.eventBus.emit(event);
  }

  async detectIntent(message: string): Promise<DetectedIntent> {
    return detectIntent(message);
  }

  /**
   * Generate AI response for a conversation
   */
  async generateResponse(
    conversationId: string,
    userMessage: string
  ): Promise<Message> {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    // Add user message
    const userMsg: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    await this.addMessage(conversationId, userMsg);

    // Generate AI response
    const response = await this.aiService.generateChatResponse(
      [...conversation.messages, userMsg],
      { pageContext: conversation.pageContext }
    );

    // Add assistant message
    const assistantMsg: Message = {
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      metadata: {
        model: response.model,
        tokens: response.usage?.outputTokens,
      },
    };
    await this.addMessage(conversationId, assistantMsg);

    return assistantMsg;
  }
}
