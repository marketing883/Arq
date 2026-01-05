import { Resend } from "resend";

// Lazy-initialized Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Resend API key not configured");
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

interface LeadNotificationData {
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  intentScore: number;
  intentCategory: string;
  urgency: string;
  companySize?: string;
  industry?: string;
  complianceRequirements?: string[];
  signalSummary?: string;
}

interface UserConfirmationData {
  name: string;
  email: string;
}

interface MeetingBookedData {
  name: string;
  email: string;
  company?: string;
  meetingTime: string;
}

const FROM_EMAIL = "ArqAI <notifications@thearq.ai>";
const TEAM_EMAIL = "habib@thearq.ai";

/**
 * Send lead notification to team
 */
export async function sendLeadNotification(
  data: LeadNotificationData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const priorityEmoji =
      data.intentCategory === "hot"
        ? "🔥"
        : data.intentCategory === "warm"
        ? "🌡️"
        : "❄️";

    const urgencyText =
      data.urgency === "immediate"
        ? "⚡ IMMEDIATE"
        : data.urgency === "high"
        ? "🚨 HIGH"
        : data.urgency === "medium"
        ? "📋 MEDIUM"
        : "📌 LOW";

    const subject = `${priorityEmoji} New ${data.intentCategory.toUpperCase()} Lead: ${
      data.name || "Anonymous"
    } ${data.company ? `(${data.company})` : ""}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: #0052CC; color: white; padding: 32px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 32px; }
            .metric { display: inline-block; padding: 8px 16px; border-radius: 8px; margin: 4px; }
            .metric-hot { background: #fef2f2; color: #dc2626; }
            .metric-warm { background: #fff7ed; color: #ea580c; }
            .metric-cold { background: #eff6ff; color: #2563eb; }
            .metric-score { background: #f0fdf4; color: #16a34a; }
            .section { margin-bottom: 24px; }
            .section h3 { color: #374151; margin: 0 0 12px 0; font-size: 16px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .info-item { padding: 12px; background: #f9fafb; border-radius: 8px; }
            .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
            .info-value { font-weight: 600; color: #1f2937; }
            .signals { background: #f3f4f6; padding: 16px; border-radius: 8px; font-size: 14px; color: #4b5563; }
            .cta { text-align: center; margin-top: 24px; }
            .cta a { display: inline-block; padding: 12px 24px; background: #0052CC; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 24px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Lead Alert</h1>
            </div>
            <div class="content">
              <div class="section">
                <span class="metric metric-${data.intentCategory}">${priorityEmoji} ${data.intentCategory.toUpperCase()} INTENT</span>
                <span class="metric metric-score">Score: ${data.intentScore}/100</span>
                <span class="metric">${urgencyText}</span>
              </div>

              <div class="section">
                <h3>Contact Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${data.name || "Not provided"}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${data.email || "Not provided"}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Company</div>
                    <div class="info-value">${data.company || "Not provided"}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Role</div>
                    <div class="info-value">${data.jobTitle || "Not provided"}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3>Lead Intelligence</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Company Size</div>
                    <div class="info-value">${data.companySize || "Unknown"}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Industry</div>
                    <div class="info-value">${data.industry || "Unknown"}</div>
                  </div>
                </div>
                ${
                  data.complianceRequirements && data.complianceRequirements.length > 0
                    ? `
                  <div class="info-item" style="margin-top: 12px">
                    <div class="info-label">Compliance Requirements</div>
                    <div class="info-value">${data.complianceRequirements.join(", ")}</div>
                  </div>
                `
                    : ""
                }
              </div>

              ${
                data.signalSummary
                  ? `
                <div class="section">
                  <h3>Conversation Signals</h3>
                  <div class="signals">${data.signalSummary}</div>
                </div>
              `
                  : ""
              }

              <div class="cta">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai"}/admin">View in Dashboard</a>
              </div>
            </div>
            <div class="footer">
              ArqAI Lead Intelligence System
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject,
      html,
    });

    console.log(`Lead notification sent for ${data.name || "Anonymous"}`);
    return true;
  } catch (error) {
    console.error("Failed to send lead notification:", error);
    return false;
  }
}

/**
 * Send confirmation email to user
 */
export async function sendUserConfirmation(
  data: UserConfirmationData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const subject = `Thanks for connecting with ArqAI, ${data.name}!`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: #0052CC; color: white; padding: 32px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 32px; }
            .highlight { background: #CCFF00; color: #1A1A1A; padding: 2px 8px; border-radius: 4px; }
            p { color: #4b5563; line-height: 1.6; }
            .cta { text-align: center; margin: 32px 0; }
            .cta a { display: inline-block; padding: 14px 28px; background: #0052CC; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { padding: 24px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ArqAI</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.8;">Intelligence, By Design</p>
            </div>
            <div class="content">
              <p>Hi ${data.name},</p>

              <p>Thank you for your interest in ArqAI! We're excited to help you build, run, and govern a <span class="highlight">trusted AI workforce</span>.</p>

              <p>Our team will review your inquiry and reach out within 24 hours to discuss how ArqAI can address your specific needs.</p>

              <p>In the meantime, here are some resources you might find helpful:</p>

              <ul style="color: #4b5563;">
                <li>Learn about our <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai"}/platform" style="color: #0052CC;">platform capabilities</a></li>
                <li>Explore <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai"}/solutions" style="color: #0052CC;">industry-specific solutions</a></li>
              </ul>

              <div class="cta">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai"}/demo">Schedule a Demo</a>
              </div>

              <p>Best regards,<br>The ArqAI Team</p>
            </div>
            <div class="footer">
              <p>ArqAI | Enterprise AI Governance Platform</p>
              <p>This email was sent because you interacted with our website.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject,
      html,
    });

    console.log(`User confirmation sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error("Failed to send user confirmation:", error);
    return false;
  }
}

/**
 * Send meeting booked notification
 */
export async function sendMeetingBookedNotification(
  data: MeetingBookedData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    // Notify team
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `📅 New Demo Booked: ${data.name} ${data.company ? `(${data.company})` : ""}`,
      html: `
        <h2>New Demo Booking</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Meeting Time:</strong> ${data.meetingTime}</p>
      `,
    });

    console.log(`Meeting booked notification sent for ${data.name}`);
    return true;
  } catch (error) {
    console.error("Failed to send meeting booked notification:", error);
    return false;
  }
}
