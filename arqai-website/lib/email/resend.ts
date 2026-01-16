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
  // AI-powered personalization
  personalizedMessage?: string;
  detectedIntent?: string;
  customSubject?: string;
  customHeading?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface MeetingBookedData {
  name: string;
  email: string;
  company?: string;
  meetingTime: string;
}

const FROM_EMAIL = "ArqAI <no-reply@thearq.ai>";
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
 * Send confirmation email to user with AI-powered personalization
 */
export async function sendUserConfirmation(
  data: UserConfirmationData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const firstName = data.name.split(" ")[0];
    const subject = data.customSubject || `Thanks for connecting with ArqAI, ${firstName}!`;
    const heading = data.customHeading || "Message Received";
    const message = data.personalizedMessage || "Thank you for your interest in ArqAI. Our team will review your inquiry and reach out within 24 hours to discuss how we can help you build, run, and govern your AI workforce.";
    const ctaText = data.ctaText || "Explore ArqAI";
    const ctaUrl = data.ctaUrl || "https://thearq.ai/platform";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
            .header { background: #FAF7F6; padding: 32px; text-align: center; border-bottom: 1px solid #E0DDDB; }
            .logo { max-width: 160px; height: auto; }
            .content { padding: 40px 32px; }
            .greeting { font-size: 18px; color: #161616; margin-bottom: 8px; }
            .heading { font-size: 24px; font-weight: 700; color: #0432a5; margin: 0 0 20px 0; }
            .message { color: #585858; line-height: 1.7; font-size: 16px; margin-bottom: 24px; }
            .highlight { background: #d0f438; color: #161616; padding: 2px 8px; border-radius: 4px; font-weight: 500; }
            .resources { background: #FAF7F6; padding: 20px; border-radius: 8px; margin: 24px 0; }
            .resources h4 { color: #161616; margin: 0 0 12px 0; font-size: 14px; font-weight: 600; }
            .resources ul { margin: 0; padding-left: 20px; }
            .resources li { color: #585858; margin-bottom: 8px; font-size: 14px; }
            .resources a { color: #0432a5; text-decoration: none; font-weight: 500; }
            .resources a:hover { text-decoration: underline; }
            .cta { text-align: center; margin: 32px 0; }
            .cta a { display: inline-block; padding: 14px 32px; background: #0432a5; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 14px; }
            .signature { color: #585858; font-size: 14px; margin-top: 32px; }
            .footer { padding: 24px; text-align: center; background: #FAF7F6; border-top: 1px solid #E0DDDB; }
            .footer p { color: #838383; font-size: 12px; margin: 4px 0; }
            .footer a { color: #0432a5; text-decoration: none; }
          </style>
        </head>
        <body>
          <div style="padding: 20px;">
            <div class="container">
              <div class="header">
                <img src="${siteUrl}/img/ArqAI-logo-transparent-bg.png" alt="ArqAI" class="logo" style="max-width: 160px; height: auto;">
              </div>
              <div class="content">
                <p class="greeting">Hi ${firstName},</p>
                <h2 class="heading">${heading}</h2>
                <p class="message">${message}</p>

                <div class="resources">
                  <h4>While you wait, explore:</h4>
                  <ul>
                    <li><a href="${siteUrl}/platform">Our Platform</a> – See how ArqAI works</li>
                    <li><a href="${siteUrl}/solutions">Solutions</a> – Industry-specific AI governance</li>
                    <li><a href="${siteUrl}/case-studies">Case Studies</a> – Real customer success stories</li>
                  </ul>
                </div>

                <div class="cta">
                  <a href="${ctaUrl}">${ctaText}</a>
                </div>

                <p class="signature">
                  Best regards,<br>
                  <strong>The ArqAI Team</strong>
                </p>
              </div>
              <div class="footer">
                <p><strong>ArqAI</strong> | Intelligence, By Design</p>
                <p>Enterprise AI Governance Platform</p>
                <p style="margin-top: 12px;"><a href="${siteUrl}">thearq.ai</a></p>
              </div>
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

    console.log(`User confirmation sent to ${data.email} (intent: ${data.detectedIntent || 'general'})`);
    return true;
  } catch (error) {
    console.error("Failed to send user confirmation:", error);
    return false;
  }
}

/**
 * Send meeting booked notification
 */
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  message: string;
  inquiryType: string;
  // AI Intel data
  aiIntel?: {
    detectedIntent: string;
    urgency: string;
    summary: string;
    companyIntel: {
      likelyIndustry: string;
      estimatedSize: string;
      potentialUseCases: string[];
    };
    contactIntel: {
      seniority: string;
      department: string;
      decisionMaker: boolean;
    };
    researchSuggestions: string[];
  };
}

/**
 * Send contact form notification to team with AI intel
 */
export async function sendContactFormNotification(
  data: ContactFormData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const inquiryLabels: Record<string, string> = {
      general: "General Inquiry",
      demo: "Demo Request",
      partnership: "Partnership",
      pricing: "Pricing",
      support: "Support",
    };

    // Use AI-detected intent if available, otherwise fall back to form selection
    const aiIntent = data.aiIntel?.detectedIntent || data.inquiryType;
    const inquiryLabel = inquiryLabels[aiIntent] || aiIntent;
    const urgency = data.aiIntel?.urgency || "medium";

    // Priority emoji based on urgency
    const urgencyEmoji = urgency === "high" ? "🔥" : urgency === "medium" ? "📬" : "📋";
    const urgencyBadge = urgency === "high" ? "HIGH PRIORITY" : urgency === "medium" ? "MEDIUM" : "LOW";

    const subject = `${urgencyEmoji} [${urgencyBadge}] New Lead: ${data.name} @ ${data.company || "Unknown"} - ${inquiryLabel}`;

    // Build AI Intel section if available
    const aiIntelSection = data.aiIntel ? `
              <div class="section ai-intel">
                <h3>🤖 AI Lead Intelligence</h3>
                <div class="ai-summary">${data.aiIntel.summary}</div>

                <div class="info-grid" style="margin-top: 16px;">
                  <div class="info-item">
                    <div class="info-label">Detected Intent</div>
                    <div class="info-value" style="text-transform: capitalize;">${data.aiIntel.detectedIntent}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Urgency</div>
                    <div class="info-value" style="text-transform: uppercase; color: ${urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#ea580c' : '#16a34a'};">${urgency}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Likely Industry</div>
                    <div class="info-value">${data.aiIntel.companyIntel.likelyIndustry}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Company Size</div>
                    <div class="info-value" style="text-transform: capitalize;">${data.aiIntel.companyIntel.estimatedSize}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Seniority</div>
                    <div class="info-value" style="text-transform: uppercase;">${data.aiIntel.contactIntel.seniority}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Decision Maker?</div>
                    <div class="info-value">${data.aiIntel.contactIntel.decisionMaker ? '✅ Yes' : '❌ No'}</div>
                  </div>
                </div>

                ${data.aiIntel.companyIntel.potentialUseCases.length > 0 ? `
                <div style="margin-top: 16px;">
                  <div class="info-label">Potential Use Cases</div>
                  <ul style="margin: 8px 0; padding-left: 20px; color: #374151;">
                    ${data.aiIntel.companyIntel.potentialUseCases.map(uc => `<li>${uc}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}

                ${data.aiIntel.researchSuggestions.length > 0 ? `
                <div style="margin-top: 16px; background: #fef3c7; padding: 12px; border-radius: 8px;">
                  <div class="info-label" style="color: #92400e;">📋 Research Before Outreach</div>
                  <ul style="margin: 8px 0; padding-left: 20px; color: #92400e; font-size: 13px;">
                    ${data.aiIntel.researchSuggestions.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
              </div>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0432a5 0%, #02256f 100%); color: white; padding: 24px 32px; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
            .header .subtitle { opacity: 0.9; font-size: 14px; margin-top: 4px; }
            .urgency-banner { padding: 12px 32px; font-weight: 600; font-size: 13px; text-align: center; }
            .urgency-high { background: #fef2f2; color: #dc2626; }
            .urgency-medium { background: #fff7ed; color: #ea580c; }
            .urgency-low { background: #f0fdf4; color: #16a34a; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
            .badge-demo { background: #fef2f2; color: #dc2626; }
            .badge-pricing { background: #fff7ed; color: #ea580c; }
            .badge-general { background: #eff6ff; color: #2563eb; }
            .content { padding: 32px; }
            .section { margin-bottom: 24px; }
            .section h3 { color: #374151; margin: 0 0 12px 0; font-size: 15px; font-weight: 600; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .info-item { padding: 12px; background: #f9fafb; border-radius: 8px; }
            .info-label { font-size: 11px; color: #6b7280; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-weight: 600; color: #1f2937; font-size: 14px; }
            .message-box { background: #f3f4f6; padding: 16px; border-radius: 8px; font-size: 14px; color: #4b5563; white-space: pre-wrap; line-height: 1.6; }
            .ai-intel { background: #f0f9ff; padding: 20px; border-radius: 12px; border: 1px solid #bae6fd; }
            .ai-intel h3 { color: #0369a1; }
            .ai-summary { background: white; padding: 16px; border-radius: 8px; font-size: 14px; color: #374151; line-height: 1.6; border-left: 4px solid #0432a5; }
            .cta { text-align: center; margin-top: 24px; }
            .cta a { display: inline-block; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 0 6px; }
            .reply-btn { background: #16a34a; color: white; }
            .dashboard-btn { background: #0432a5; color: white; }
            .footer { padding: 20px 32px; text-align: center; color: #6b7280; font-size: 12px; background: #f9fafb; }
          </style>
        </head>
        <body>
          <div style="padding: 20px; background: #f5f7fa;">
            <div class="container">
              <div class="header">
                <h1>New Lead Submission</h1>
                <div class="subtitle">via Contact Form • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div class="urgency-banner urgency-${urgency}">
                ${urgencyEmoji} ${urgencyBadge} PRIORITY • ${inquiryLabel.toUpperCase()}
              </div>

              <div class="content">
                <div class="section">
                  <h3>👤 Contact Information</h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Name</div>
                      <div class="info-value">${data.name}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Email</div>
                      <div class="info-value">${data.email}</div>
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
                  <h3>💬 Message</h3>
                  <div class="message-box">${data.message}</div>
                </div>

                ${aiIntelSection}

                <div class="cta">
                  <a href="mailto:${data.email}?subject=Re: Your inquiry to ArqAI" class="reply-btn">📧 Reply to ${data.name.split(' ')[0]}</a>
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai"}/admin" class="dashboard-btn">📊 View Dashboard</a>
                </div>
              </div>
              <div class="footer">
                ArqAI Lead Notification System${data.aiIntel ? ' • AI-Powered Intelligence' : ''}
              </div>
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
      reply_to: data.email,
    });

    console.log(`Contact form notification sent for ${data.name}`);
    return true;
  } catch (error) {
    console.error("Failed to send contact form notification:", error);
    return false;
  }
}

/**
 * Partner Enquiry Notification Data
 */
interface PartnerEnquiryData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  partnershipType: string;
  companySize?: string;
  message?: string;
  website?: string;
  priority: string;
}

/**
 * Send partner enquiry notification to team
 */
export async function sendPartnerEnquiryNotification(
  data: PartnerEnquiryData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const partnershipLabels: Record<string, string> = {
      technology: "Technology Alliance",
      reseller: "Reseller Partner",
      integration: "Integration Partner",
      strategic: "Strategic Alliance",
      general: "General Partnership",
    };

    const partnershipLabel = partnershipLabels[data.partnershipType] || data.partnershipType;
    const isHighPriority = data.priority === "high";
    const priorityEmoji = isHighPriority ? "🤝🔥" : "🤝";

    const subject = `${priorityEmoji} New Partner Enquiry: ${data.name}${data.company ? ` (${data.company})` : ""} - ${partnershipLabel}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f5f7fa; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #0052CC 0%, #6366F1 100%); color: white; padding: 32px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600; margin: 4px; }
            .badge-strategic { background: #fef2f2; color: #dc2626; }
            .badge-technology { background: #eff6ff; color: #2563eb; }
            .badge-reseller { background: #f0fdf4; color: #16a34a; }
            .badge-integration { background: #fff7ed; color: #ea580c; }
            .badge-general { background: #f3f4f6; color: #374151; }
            .badge-priority { background: #fef3c7; color: #d97706; }
            .content { padding: 32px; }
            .section { margin-bottom: 24px; }
            .section h3 { color: #374151; margin: 0 0 12px 0; font-size: 16px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .info-item { padding: 12px; background: #f9fafb; border-radius: 8px; }
            .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
            .info-value { font-weight: 600; color: #1f2937; }
            .message-box { background: #f3f4f6; padding: 16px; border-radius: 8px; font-size: 14px; color: #4b5563; white-space: pre-wrap; }
            .cta { text-align: center; margin-top: 24px; }
            .cta a { display: inline-block; padding: 12px 24px; background: #0052CC; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 4px; }
            .reply-btn { background: #16a34a !important; }
            .footer { padding: 24px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 New Partner Enquiry</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Someone wants to partner with ArqAI!</p>
            </div>
            <div class="content">
              <div class="section" style="text-align: center;">
                <span class="badge badge-${data.partnershipType}">${partnershipLabel}</span>
                ${data.priority === "high" ? '<span class="badge badge-priority">⚡ High Priority</span>' : ""}
                ${data.companySize ? `<span class="badge badge-general">${data.companySize}</span>` : ""}
              </div>

              <div class="section">
                <h3>Contact Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${data.name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${data.email}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Company</div>
                    <div class="info-value">${data.company || "Not provided"}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Role</div>
                    <div class="info-value">${data.jobTitle || "Not provided"}</div>
                  </div>
                  ${data.phone ? `
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${data.phone}</div>
                  </div>
                  ` : ""}
                  ${data.website ? `
                  <div class="info-item">
                    <div class="info-label">Website</div>
                    <div class="info-value"><a href="${data.website}" style="color: #0052CC;">${data.website}</a></div>
                  </div>
                  ` : ""}
                </div>
              </div>

              ${data.message ? `
              <div class="section">
                <h3>Message / Use Case</h3>
                <div class="message-box">${data.message}</div>
              </div>
              ` : ""}

              <div class="cta">
                <a href="mailto:${data.email}" class="reply-btn">Reply to ${data.name}</a>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://thearq.ai"}/admin/partners">View in Dashboard</a>
              </div>
            </div>
            <div class="footer">
              ArqAI Partner Enquiry Notification
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
      reply_to: data.email,
    });

    console.log(`Partner enquiry notification sent for ${data.name}`);
    return true;
  } catch (error) {
    console.error("Failed to send partner enquiry notification:", error);
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
