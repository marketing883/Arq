/**
 * Resend Email API Adapter
 *
 * Implements email provider interface for Resend.
 */

import type { EmailOptions, EmailResult } from "@/src/core";
import type { IEmailProvider } from "@/src/services/email/email-service";

/**
 * Resend configuration
 */
export interface ResendConfig {
  apiKey: string;
  defaultFrom?: string;
}

/**
 * Resend API Adapter
 */
export class ResendAdapter implements IEmailProvider {
  private apiKey: string;
  private defaultFrom: string;

  constructor(config: Partial<ResendConfig> = {}) {
    this.apiKey = config.apiKey || process.env.RESEND_API_KEY || "";
    this.defaultFrom = config.defaultFrom || "ArqAI <no-reply@thearq.ai>";
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: options.from || this.defaultFrom,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
          reply_to: options.replyTo,
          tags: options.tags?.map((name) => ({ name, value: "true" })),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          error:
            (error as { message?: string }).message ||
            `Resend API error: ${response.status}`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        messageId: (data as { id?: string }).id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send batch emails
   */
  async sendBatch(
    emails: EmailOptions[]
  ): Promise<Array<EmailResult & { index: number }>> {
    const results = await Promise.all(
      emails.map(async (email, index) => {
        const result = await this.send(email);
        return { ...result, index };
      })
    );
    return results;
  }

  /**
   * Validate email address format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Factory function to create Resend adapter
 */
export function createResendAdapter(
  config?: Partial<ResendConfig>
): ResendAdapter {
  return new ResendAdapter(config);
}
