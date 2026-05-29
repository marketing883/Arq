/**
 * Email Templates Module
 *
 * Contains email template definitions and rendering utilities.
 */

/**
 * Template IDs
 */
export type TemplateId =
  | "contact_confirmation"
  | "contact_notification"
  | "hot_lead_alert"
  | "resource_download"
  | "partner_confirmation"
  | "partner_notification"
  | "newsletter_welcome";

/**
 * Template data types
 */
export type TemplateData = Record<string, unknown>;

/**
 * Email template structure
 */
export interface EmailTemplate {
  id: TemplateId;
  subject: string | ((data: TemplateData) => string);
  html: (data: TemplateData) => string;
  text: (data: TemplateData) => string;
}

/**
 * Common HTML wrapper for emails
 */
const htmlWrapper = (content: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #161616; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #0432a5; margin-bottom: 20px; }
    .header img { max-height: 40px; }
    .content { padding: 20px 0; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e5e5; margin-top: 20px; font-size: 12px; color: #666; }
    .btn { display: inline-block; padding: 12px 24px; background: #0432a5; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
    .btn:hover { background: #032080; }
    .highlight { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
    .urgent { background: #fee2e2; border-left: 4px solid #ef4444; }
    h1, h2, h3 { color: #161616; margin-top: 0; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://thearq.ai/img/logo.png" alt="ArqAI" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>ArqAI - Enterprise AI Governance Platform</p>
      <p><a href="https://thearq.ai">thearq.ai</a> | <a href="mailto:hello@thearq.ai">hello@thearq.ai</a></p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Template definitions
 */
const templates: Record<TemplateId, EmailTemplate> = {
  contact_confirmation: {
    id: "contact_confirmation",
    subject: (data) =>
      `Thanks for reaching out${data.name ? `, ${data.name}` : ""}!`,
    html: (data) =>
      htmlWrapper(`
        <h1>${data.personalizedGreeting || `Hi ${data.name || "there"}!`}</h1>
        <p>Thank you for contacting ArqAI. We've received your message and our team will get back to you shortly.</p>
        ${data.personalizedMessage ? `<div class="highlight"><p>${data.personalizedMessage}</p></div>` : ""}
        <p>In the meantime, you might find these resources helpful:</p>
        <ul>
          <li><a href="https://thearq.ai/platform">Explore our platform</a></li>
          <li><a href="https://thearq.ai/resources">Browse our resources</a></li>
          <li><a href="https://thearq.ai/demo">Schedule a demo</a></li>
        </ul>
        <p>We typically respond within 1 business day.</p>
        <p>Best regards,<br>The ArqAI Team</p>
      `),
    text: (data) => `
Hi ${data.name || "there"}!

Thank you for contacting ArqAI. We've received your message and our team will get back to you shortly.

${data.personalizedMessage || ""}

In the meantime, you might find these resources helpful:
- Explore our platform: https://thearq.ai/platform
- Browse our resources: https://thearq.ai/resources
- Schedule a demo: https://thearq.ai/demo

We typically respond within 1 business day.

Best regards,
The ArqAI Team
    `.trim(),
  },

  contact_notification: {
    id: "contact_notification",
    subject: (data) =>
      `[${(data.urgency as string)?.toUpperCase() || "NEW"}] Contact from ${data.name || data.email}`,
    html: (data) =>
      htmlWrapper(`
        <h1>New Contact Form Submission</h1>
        ${data.urgency === "high" ? '<div class="alert urgent"><strong>High Priority Lead</strong></div>' : ""}
        <div class="highlight">
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${data.name || "Not provided"}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
          <p><strong>Job Title:</strong> ${data.jobTitle || "Not provided"}</p>
        </div>
        <h3>Message</h3>
        <p>${data.message || "No message provided"}</p>
        ${data.aiSummary ? `
        <div class="highlight">
          <h3>AI Analysis</h3>
          <p><strong>Detected Intent:</strong> ${data.detectedIntent || "General inquiry"}</p>
          <p><strong>Urgency:</strong> ${data.urgency || "Normal"}</p>
          <p><strong>Summary:</strong> ${data.aiSummary}</p>
        </div>
        ` : ""}
        <p><a href="https://thearq.ai/admin/contacts" class="btn">View in Admin</a></p>
      `),
    text: (data) => `
New Contact Form Submission

Contact Details:
- Name: ${data.name || "Not provided"}
- Email: ${data.email}
- Company: ${data.company || "Not provided"}
- Job Title: ${data.jobTitle || "Not provided"}

Message:
${data.message || "No message provided"}

${data.aiSummary ? `
AI Analysis:
- Detected Intent: ${data.detectedIntent || "General inquiry"}
- Urgency: ${data.urgency || "Normal"}
- Summary: ${data.aiSummary}
` : ""}

View in Admin: https://thearq.ai/admin/contacts
    `.trim(),
  },

  hot_lead_alert: {
    id: "hot_lead_alert",
    subject: (data) =>
      `[HOT LEAD] ${data.name || data.email} - Score: ${data.score}/100`,
    html: (data) =>
      htmlWrapper(`
        <div class="alert urgent">
          <h1>Hot Lead Alert</h1>
          <p>${data.alertMessage}</p>
        </div>
        <div class="highlight">
          <h3>Lead Details</h3>
          <p><strong>Name:</strong> ${data.name || "Unknown"}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || "Unknown"}</p>
          <p><strong>Score:</strong> ${data.score}/100</p>
          <p><strong>Journey Stage:</strong> ${data.journeyStage}</p>
        </div>
        <h3>Suggested Action</h3>
        <p>${data.suggestedAction}</p>
        <p><a href="https://thearq.ai/admin/leads" class="btn">View Lead Details</a></p>
      `),
    text: (data) => `
HOT LEAD ALERT

${data.alertMessage}

Lead Details:
- Name: ${data.name || "Unknown"}
- Email: ${data.email}
- Company: ${data.company || "Unknown"}
- Score: ${data.score}/100
- Journey Stage: ${data.journeyStage}

Suggested Action:
${data.suggestedAction}

View Lead Details: https://thearq.ai/admin/leads
    `.trim(),
  },

  resource_download: {
    id: "resource_download",
    subject: (data) => `Your ${data.resourceType}: ${data.resourceTitle}`,
    html: (data) =>
      htmlWrapper(`
        <h1>Hi ${data.name || "there"}!</h1>
        <p>Thank you for your interest in our ${data.resourceType}. Click the button below to download:</p>
        <h2>${data.resourceTitle}</h2>
        <p style="text-align: center;">
          <a href="${data.downloadUrl}" class="btn">Download Now</a>
        </p>
        <p><small>This download link will expire on ${new Date(data.expiresAt as string).toLocaleDateString()}.</small></p>
        <p>Want to learn more about how ArqAI can help your organization?</p>
        <p><a href="https://thearq.ai/demo">Schedule a personalized demo</a></p>
        <p>Best regards,<br>The ArqAI Team</p>
      `),
    text: (data) => `
Hi ${data.name || "there"}!

Thank you for your interest in our ${data.resourceType}.

${data.resourceTitle}

Download here: ${data.downloadUrl}

This download link will expire on ${new Date(data.expiresAt as string).toLocaleDateString()}.

Want to learn more about how ArqAI can help your organization?
Schedule a demo: https://thearq.ai/demo

Best regards,
The ArqAI Team
    `.trim(),
  },

  partner_confirmation: {
    id: "partner_confirmation",
    subject: () => "Partnership Inquiry Received - ArqAI",
    html: (data) =>
      htmlWrapper(`
        <h1>Hi ${data.name || "there"}!</h1>
        <p>Thank you for your interest in partnering with ArqAI. We've received your inquiry about <strong>${data.partnershipType}</strong> partnership.</p>
        <p>Our partnerships team will review your application and get back to you within 2-3 business days.</p>
        <p>In the meantime, learn more about our partner program:</p>
        <p><a href="https://thearq.ai/partners" class="btn">Partner Program Details</a></p>
        <p>Best regards,<br>The ArqAI Partnerships Team</p>
      `),
    text: (data) => `
Hi ${data.name || "there"}!

Thank you for your interest in partnering with ArqAI. We've received your inquiry about ${data.partnershipType} partnership.

Our partnerships team will review your application and get back to you within 2-3 business days.

Learn more about our partner program: https://thearq.ai/partners

Best regards,
The ArqAI Partnerships Team
    `.trim(),
  },

  partner_notification: {
    id: "partner_notification",
    subject: (data) => `[PARTNER] New ${data.partnershipType} inquiry from ${data.company || data.name}`,
    html: (data) =>
      htmlWrapper(`
        <h1>New Partnership Inquiry</h1>
        <div class="highlight">
          <h3>Partner Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
          <p><strong>Partnership Type:</strong> ${data.partnershipType}</p>
        </div>
        ${data.message ? `
        <h3>Message</h3>
        <p>${data.message}</p>
        ` : ""}
        <p><a href="https://thearq.ai/admin/partners" class="btn">View in Admin</a></p>
      `),
    text: (data) => `
New Partnership Inquiry

Partner Details:
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company || "Not provided"}
- Partnership Type: ${data.partnershipType}

${data.message ? `Message:\n${data.message}` : ""}

View in Admin: https://thearq.ai/admin/partners
    `.trim(),
  },

  newsletter_welcome: {
    id: "newsletter_welcome",
    subject: () => "Welcome to the ArqAI Newsletter!",
    html: (data) =>
      htmlWrapper(`
        <h1>Welcome to ArqAI!</h1>
        <p>Hi ${data.name || "there"},</p>
        <p>Thank you for subscribing to the ArqAI newsletter. You'll receive:</p>
        <ul>
          <li>Industry insights on AI governance</li>
          <li>Product updates and new features</li>
          <li>Best practices and case studies</li>
          <li>Exclusive invitations to webinars and events</li>
        </ul>
        <p>Start exploring:</p>
        <p><a href="https://thearq.ai/blog" class="btn">Read Our Blog</a></p>
        <p>Best regards,<br>The ArqAI Team</p>
      `),
    text: (data) => `
Welcome to ArqAI!

Hi ${data.name || "there"},

Thank you for subscribing to the ArqAI newsletter. You'll receive:
- Industry insights on AI governance
- Product updates and new features
- Best practices and case studies
- Exclusive invitations to webinars and events

Start exploring: https://thearq.ai/blog

Best regards,
The ArqAI Team
    `.trim(),
  },
};

/**
 * Get a template by ID
 */
export function getTemplate(id: TemplateId): EmailTemplate | undefined {
  return templates[id];
}

/**
 * Render a template with data
 */
export function renderTemplate(
  template: EmailTemplate,
  data: TemplateData
): { subject: string; html: string; text: string } {
  return {
    subject:
      typeof template.subject === "function"
        ? template.subject(data)
        : template.subject,
    html: template.html(data),
    text: template.text(data),
  };
}

/**
 * List all available template IDs
 */
export function listTemplates(): TemplateId[] {
  return Object.keys(templates) as TemplateId[];
}
