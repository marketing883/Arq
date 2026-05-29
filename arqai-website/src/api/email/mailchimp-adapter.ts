/**
 * Mailchimp API Adapter
 *
 * Handles newsletter subscriptions via Mailchimp.
 */

/**
 * Mailchimp configuration
 */
export interface MailchimpConfig {
  apiKey: string;
  listId: string;
  serverPrefix?: string;
}

/**
 * Subscription result
 */
export interface SubscriptionResult {
  success: boolean;
  status?: "subscribed" | "pending" | "unsubscribed";
  error?: string;
}

/**
 * Subscriber data
 */
export interface SubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

/**
 * Mailchimp API Adapter
 */
export class MailchimpAdapter {
  private apiKey: string;
  private listId: string;
  private serverPrefix: string;

  constructor(config: Partial<MailchimpConfig> = {}) {
    this.apiKey = config.apiKey || process.env.MAILCHIMP_API_KEY || "";
    this.listId = config.listId || process.env.MAILCHIMP_LIST_ID || "";

    // Extract server prefix from API key (format: key-dc123)
    this.serverPrefix =
      config.serverPrefix || this.apiKey.split("-").pop() || "us1";
  }

  /**
   * Subscribe email to list
   */
  async subscribe(data: SubscriberData): Promise<SubscriptionResult> {
    try {
      const url = `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members`;

      const body = {
        email_address: data.email,
        status: "pending", // Double opt-in
        merge_fields: {
          FNAME: data.firstName || "",
          LNAME: data.lastName || "",
        },
        tags: data.tags || [],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString("base64")}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          status: (result as { status?: string }).status as "subscribed" | "pending",
        };
      }

      // Handle specific error cases
      const error = await response.json().catch(() => ({}));
      const errorTitle = (error as { title?: string }).title || "";

      // Already subscribed is not really an error
      if (errorTitle === "Member Exists") {
        return {
          success: true,
          status: "subscribed",
        };
      }

      return {
        success: false,
        error: errorTitle || `Mailchimp API error: ${response.status}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Unsubscribe email from list
   */
  async unsubscribe(email: string): Promise<SubscriptionResult> {
    try {
      const subscriberHash = this.hashEmail(email);
      const url = `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members/${subscriberHash}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString("base64")}`,
        },
        body: JSON.stringify({ status: "unsubscribed" }),
      });

      if (response.ok) {
        return {
          success: true,
          status: "unsubscribed",
        };
      }

      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          (error as { title?: string }).title ||
          `Mailchimp API error: ${response.status}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get subscriber status
   */
  async getSubscriberStatus(
    email: string
  ): Promise<{ subscribed: boolean; status?: string }> {
    try {
      const subscriberHash = this.hashEmail(email);
      const url = `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members/${subscriberHash}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString("base64")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const status = (data as { status?: string }).status;
        return {
          subscribed: status === "subscribed",
          status,
        };
      }

      return { subscribed: false };
    } catch {
      return { subscribed: false };
    }
  }

  /**
   * Hash email for Mailchimp API (MD5 lowercase)
   */
  private hashEmail(email: string): string {
    const crypto = require("crypto");
    return crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");
  }
}

/**
 * Factory function to create Mailchimp adapter
 */
export function createMailchimpAdapter(
  config?: Partial<MailchimpConfig>
): MailchimpAdapter {
  return new MailchimpAdapter(config);
}
