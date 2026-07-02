/**
 * GTM Event Tracking Utility
 *
 * Pushes GA4 recommended events to the dataLayer for Google Tag Manager.
 * Events: generate_lead, sign_up, file_download
 *
 * These events follow GA4 naming conventions and include standard parameters
 * that GTM tags can use via Data Layer Variables.
 */

// Types are declared in types/gtm.d.ts

/**
 * Check if analytics consent has been given
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  const savedConsent = localStorage.getItem("arqai_cookie_consent");
  if (savedConsent) {
    try {
      const { categories } = JSON.parse(savedConsent);
      return categories?.analytics === true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Push event to dataLayer
 */
function pushToDataLayer(eventData: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[GTM Event]", eventData);
  }
}

/**
 * Track generate_lead event (GA4 recommended event)
 * Used when a contact form is submitted
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead
 */
export function trackGenerateLead(params: {
  value?: number;
  currency?: string;
  lead_source?: string;
  form_name?: string;
  inquiry_type?: string;
  // Optional lead-qualification dimensions (captured from the form when present)
  industry?: string;
  company_size?: string;
  timeline?: string;
  budget_range?: string;
  workflow_area?: string;
  accelerator_name?: string;
}): void {
  pushToDataLayer({
    event: "generate_lead",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: "Lead Generation",
    eventAction: "form_submit",
    eventLabel: params.form_name || "Contact Form",
    eventValue: params.value,
    // GA4 standard parameters
    value: params.value || 0,
    currency: params.currency || "USD",
    // Custom parameters
    lead_source: params.lead_source || "website",
    form_name: params.form_name || "contact_form",
    inquiry_type: params.inquiry_type,
    industry: params.industry,
    company_size: params.company_size,
    timeline: params.timeline,
    budget_range: params.budget_range,
    workflow_area: params.workflow_area,
    accelerator_name: params.accelerator_name,
  });
}

/**
 * Track submit_application event
 * Fired when a candidate submits a job application (careers).
 * Kept distinct from generate_lead so applicants don't inflate lead metrics.
 */
export function trackJobApplication(params: {
  job_title?: string;
  job_slug?: string;
  department?: string;
  employment_type?: string;
  location?: string;
}): void {
  pushToDataLayer({
    event: "submit_application",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: "Careers",
    eventAction: "application_submit",
    eventLabel: params.job_title || "Job Application",
    eventValue: undefined,
    // Custom parameters
    job_title: params.job_title,
    job_slug: params.job_slug,
    department: params.department,
    employment_type: params.employment_type,
    location: params.location,
  });
}

/**
 * Track survey_submit event
 * Fired when an internal survey (e.g. accelerator naming) is submitted.
 * Engagement signal, not a marketing conversion.
 */
export function trackSurveySubmit(params: { survey_name: string }): void {
  pushToDataLayer({
    event: "survey_submit",
    eventCategory: "Survey",
    eventAction: "survey_submit",
    eventLabel: params.survey_name,
    eventValue: undefined,
    survey_name: params.survey_name,
  });
}

/**
 * Track chat_open event
 * Fired the first time a visitor expands the chat widget in a session.
 */
export function trackChatOpen(params?: { page_location?: string }): void {
  pushToDataLayer({
    event: "chat_open",
    eventCategory: "Chat",
    eventAction: "chat_open",
    eventLabel: params?.page_location || "chat_widget",
    eventValue: undefined,
    page_location:
      params?.page_location ||
      (typeof window !== "undefined" ? window.location.pathname : undefined),
  });
}

/**
 * Track sign_up event (GA4 recommended event)
 * Used when a user signs up for newsletter
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events#sign_up
 */
export function trackSignUp(params: {
  method?: string;
  source?: string;
}): void {
  pushToDataLayer({
    event: "sign_up",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: "User Engagement",
    eventAction: "signup",
    eventLabel: params.source || "Newsletter",
    eventValue: undefined,
    // GA4 standard parameters
    method: params.method || "newsletter",
    // Custom parameters
    signup_source: params.source || "footer",
  });
}

/**
 * Track file_download event (GA4 automatically collected when enhanced measurement is on)
 * We push it manually for more control and custom parameters
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events#file_download
 */
export function trackFileDownload(params: {
  file_name: string;
  file_extension?: string;
  resource_type?: string;
  resource_id?: string;
}): void {
  pushToDataLayer({
    event: "file_download",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: params.resource_type || "Resource Downloads",
    eventAction: "download",
    eventLabel: params.file_name,
    eventValue: undefined,
    // GA4 standard parameters
    file_name: params.file_name,
    file_extension: params.file_extension || "pdf",
    link_text: params.file_name,
    // Custom parameters
    resource_type: params.resource_type,
    resource_id: params.resource_id,
  });
}

/**
 * Track custom event for contact form submission
 * Maps to GTM trigger for "Contact Form Submit"
 */
export function trackContactFormSubmit(params: {
  name?: string;
  company?: string;
  inquiry_type?: string;
}): void {
  const eventValue = params.company ? 100 : 50; // Higher value for B2B leads

  pushToDataLayer({
    event: "contact_form_submit",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: "Lead Generation",
    eventAction: "form_submit",
    eventLabel: params.inquiry_type || "General Inquiry",
    eventValue: eventValue,
    // Custom parameters
    inquiry_type: params.inquiry_type,
    has_company: !!params.company,
  });

  // Also fire the standard generate_lead event
  trackGenerateLead({
    form_name: "Contact Form",
    inquiry_type: params.inquiry_type,
    value: eventValue,
  });
}

/**
 * Track resource download form submission
 * Maps to GTM trigger for "Resource Download"
 */
export function trackResourceDownload(params: {
  resource_title: string;
  resource_type: string;
  resource_id?: string;
}): void {
  // Fire the resource_download event (matches GTM trigger name)
  pushToDataLayer({
    event: "resource_download",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: params.resource_type || "Resource Downloads",
    eventAction: "download_request",
    eventLabel: params.resource_title,
    eventValue: undefined,
    // Custom parameters
    resource_title: params.resource_title,
    resource_type: params.resource_type,
    resource_id: params.resource_id,
  });

  // Also fire the standard file_download event
  trackFileDownload({
    file_name: params.resource_title,
    file_extension: params.resource_type === "whitepaper" ? "pdf" : "video",
    resource_type: params.resource_type,
    resource_id: params.resource_id,
  });
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSignup(source: string = "footer"): void {
  pushToDataLayer({
    event: "newsletter_signup",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: "User Engagement",
    eventAction: "newsletter_subscribe",
    eventLabel: source,
    eventValue: undefined,
    signup_source: source,
  });

  // Also fire the standard sign_up event
  trackSignUp({
    method: "newsletter",
    source: source,
  });
}

/**
 * Track chat message interaction
 * Maps to GTM trigger for "Chat Message"
 */
export function trackChatMessage(params: {
  message_count?: number;
  session_id?: string;
  engagement_level?: "low" | "medium" | "high";
}): void {
  pushToDataLayer({
    event: "chat_message",
    // GTM Data Layer Variables (camelCase for GTM compatibility)
    eventCategory: "Chat",
    eventAction: "message_sent",
    eventLabel: params.engagement_level || "interaction",
    eventValue: params.message_count,
    // Custom parameters
    message_count: params.message_count,
    session_id: params.session_id,
    engagement_level: params.engagement_level,
  });
}
