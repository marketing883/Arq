/**
 * Event Emitter
 *
 * Simple typed event emitter for domain events.
 * Can be extended to support external event buses (Redis, etc.)
 */

import type { ArqDomainEvent, ArqEventType, EventMetadata } from "./types";

type EventHandler<T extends ArqDomainEvent = ArqDomainEvent> = (event: T) => void | Promise<void>;

/**
 * Event emitter for domain events
 */
export class EventEmitter {
  private handlers: Map<ArqEventType | "*", Set<EventHandler>> = new Map();
  private asyncHandlers: Map<ArqEventType | "*", Set<EventHandler>> = new Map();

  /**
   * Subscribe to an event type
   */
  on<T extends ArqDomainEvent>(
    eventType: T["eventType"] | "*",
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler as EventHandler);
    };
  }

  /**
   * Subscribe to an event type with async handling
   * Async handlers are awaited in parallel
   */
  onAsync<T extends ArqDomainEvent>(
    eventType: T["eventType"] | "*",
    handler: EventHandler<T>
  ): () => void {
    if (!this.asyncHandlers.has(eventType)) {
      this.asyncHandlers.set(eventType, new Set());
    }
    this.asyncHandlers.get(eventType)!.add(handler as EventHandler);

    return () => {
      this.asyncHandlers.get(eventType)?.delete(handler as EventHandler);
    };
  }

  /**
   * Emit an event
   */
  emit<T extends ArqDomainEvent>(event: T): void {
    // Call synchronous handlers
    const typeHandlers = this.handlers.get(event.eventType);
    const wildcardHandlers = this.handlers.get("*");

    typeHandlers?.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.eventType}:`, error);
      }
    });

    wildcardHandlers?.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in wildcard event handler for ${event.eventType}:`, error);
      }
    });
  }

  /**
   * Emit an event and await all async handlers
   */
  async emitAsync<T extends ArqDomainEvent>(event: T): Promise<void> {
    // First emit synchronously
    this.emit(event);

    // Then await async handlers
    const typeHandlers = this.asyncHandlers.get(event.eventType);
    const wildcardHandlers = this.asyncHandlers.get("*");

    const promises: Promise<void>[] = [];

    typeHandlers?.forEach((handler) => {
      promises.push(
        Promise.resolve(handler(event)).catch((error) => {
          console.error(`Error in async event handler for ${event.eventType}:`, error);
        })
      );
    });

    wildcardHandlers?.forEach((handler) => {
      promises.push(
        Promise.resolve(handler(event)).catch((error) => {
          console.error(`Error in async wildcard handler for ${event.eventType}:`, error);
        })
      );
    });

    await Promise.all(promises);
  }

  /**
   * Remove all handlers for an event type
   */
  off(eventType: ArqEventType | "*"): void {
    this.handlers.delete(eventType);
    this.asyncHandlers.delete(eventType);
  }

  /**
   * Remove all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.asyncHandlers.clear();
  }
}

/**
 * Generate a unique event ID
 */
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create event metadata
 */
export function createEventMetadata(options?: Partial<EventMetadata>): EventMetadata {
  return {
    correlationId: options?.correlationId,
    causationId: options?.causationId,
    userId: options?.userId,
    sessionId: options?.sessionId,
    source: options?.source ?? "arqai-website",
  };
}

/**
 * Singleton event bus for the application
 */
let globalEventBus: EventEmitter | null = null;

export function getEventBus(): EventEmitter {
  if (!globalEventBus) {
    globalEventBus = new EventEmitter();
  }
  return globalEventBus;
}

export function resetEventBus(): void {
  globalEventBus?.clear();
  globalEventBus = null;
}
