/**
 * Email Service Implementation
 *
 * Orchestrates email sending with templates and event emission.
 */

import type { IEmailService, EmailOptions, EmailResult } from "@/src/core";
import { getEventBus, generateEventId, createEventMetadata } from "@/src/core";
import type { NotificationSentEvent } from "@/src/core";
import { getTemplate, renderTemplate, TemplateId, TemplateData } from "./templates";

/**
 * Email provider interface (for Resend, SendGrid, etc.)
 */
export interface IEmailProvider {
  send(options: EmailOptions): Promise<EmailResult>;
}

export interface EmailServiceConfig {
  defaultFrom: string;
  teamEmail: string;
}

export class EmailService implements IEmailService {
  private provider: IEmailProvider;
  private config: EmailServiceConfig;
  private eventBus = getEventBus();

  constructor(provider: IEmailProvider, config: EmailServiceConfig) {
    this.provider = provider;
    this.config = config;
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    const emailOptions: EmailOptions = {
      ...options,
      from: options.from || this.config.defaultFrom,
    };

    const result = await this.provider.send(emailOptions);

    // Emit notification event
    const event: NotificationSentEvent = {
      eventId: generateEventId(),
      eventType: "notification.sent",
      timestamp: new Date(),
      metadata: createEventMetadata(),
      data: {
        channel: "email",
        recipient: Array.isArray(options.to) ? options.to[0] : options.to,
        success: result.success,
        error: result.error,
      },
    };
    this.eventBus.emit(event);

    return result;
  }

  async sendTemplate(
    templateId: string,
    to: string,
    data: Record<string, unknown>
  ): Promise<EmailResult> {
    const template = getTemplate(templateId as TemplateId);
    if (!template) {
      return {
        success: false,
        error: `Template not found: ${templateId}`,
      };
    }

    const { subject, html, text } = renderTemplate(template, data as TemplateData);

    return this.send({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * Send contact form confirmation to user
   */
  async sendContactConfirmation(data: {
    name: string;
    email: string;
    personalizedGreeting?: string;
    personalizedMessage?: string;
  }): Promise<EmailResult> {
    return this.sendTemplate("contact_confirmation", data.email, data);
  }

  /**
   * Send contact form notification to team
   */
  async sendContactNotification(data: {
    name: string;
    email: string;
    company?: string;
    jobTitle?: string;
    message?: string;
    aiSummary?: string;
    detectedIntent?: string;
    urgency?: string;
  }): Promise<EmailResult> {
    return this.sendTemplate("contact_notification", this.config.teamEmail, data);
  }

  /**
   * Send hot lead alert to team
   */
  async sendHotLeadAlert(data: {
    name: string;
    email: string;
    company?: string;
    score: number;
    journeyStage: string;
    alertMessage: string;
    suggestedAction: string;
  }): Promise<EmailResult> {
    return this.sendTemplate("hot_lead_alert", this.config.teamEmail, data);
  }

  /**
   * Send resource download link
   */
  async sendResourceDownload(data: {
    name: string;
    email: string;
    resourceTitle: string;
    resourceType: string;
    downloadUrl: string;
    expiresAt: Date;
  }): Promise<EmailResult> {
    return this.sendTemplate("resource_download", data.email, data);
  }

  /**
   * Send partner enquiry confirmation
   */
  async sendPartnerConfirmation(data: {
    name: string;
    email: string;
    partnershipType: string;
  }): Promise<EmailResult> {
    return this.sendTemplate("partner_confirmation", data.email, data);
  }

  /**
   * Send partner enquiry notification to team
   */
  async sendPartnerNotification(data: {
    name: string;
    email: string;
    company?: string;
    partnershipType: string;
    message?: string;
  }): Promise<EmailResult> {
    return this.sendTemplate("partner_notification", this.config.teamEmail, data);
  }
}
