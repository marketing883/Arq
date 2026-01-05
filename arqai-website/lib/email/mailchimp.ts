import mailchimp from "@mailchimp/mailchimp_marketing";

// Lazy initialization of Mailchimp client
let isInitialized = false;

function initMailchimp(): boolean {
  if (isInitialized) return true;

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !server) {
    console.warn("Mailchimp credentials not configured");
    return false;
  }

  mailchimp.setConfig({
    apiKey,
    server,
  });

  isInitialized = true;
  return true;
}

interface SubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  tags?: string[];
}

/**
 * Add subscriber to Mailchimp list
 */
export async function addSubscriber(data: SubscriberData): Promise<boolean> {
  if (!initMailchimp()) return false;

  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!listId) {
    console.warn("Mailchimp list ID not configured");
    return false;
  }

  try {
    // Check if subscriber already exists
    const subscriberHash = require("crypto")
      .createHash("md5")
      .update(data.email.toLowerCase())
      .digest("hex");

    try {
      await mailchimp.lists.getListMember(listId, subscriberHash);
      // If we get here, the member exists - update them
      await mailchimp.lists.updateListMember(listId, subscriberHash, {
        merge_fields: {
          FNAME: data.firstName || "",
          LNAME: data.lastName || "",
          COMPANY: data.company || "",
          JOBTITLE: data.jobTitle || "",
        },
        tags: data.tags || [],
      });
      console.log(`Updated existing subscriber: ${data.email}`);
      return true;
    } catch {
      // Member doesn't exist, add them
      await mailchimp.lists.addListMember(listId, {
        email_address: data.email,
        status: "subscribed",
        merge_fields: {
          FNAME: data.firstName || "",
          LNAME: data.lastName || "",
          COMPANY: data.company || "",
          JOBTITLE: data.jobTitle || "",
        },
        tags: data.tags || ["website-lead"],
      });
      console.log(`Added new subscriber: ${data.email}`);
      return true;
    }
  } catch (error) {
    console.error("Failed to add subscriber to Mailchimp:", error);
    return false;
  }
}

/**
 * Tag subscriber based on behavior
 */
export async function tagSubscriber(
  email: string,
  tags: string[]
): Promise<boolean> {
  if (!initMailchimp()) return false;

  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!listId) return false;

  try {
    const subscriberHash = require("crypto")
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
      tags: tags.map((tag) => ({ name: tag, status: "active" })),
    });

    console.log(`Tagged subscriber ${email} with: ${tags.join(", ")}`);
    return true;
  } catch (error) {
    console.error("Failed to tag subscriber:", error);
    return false;
  }
}

/**
 * Get intent-based tags for a lead
 */
export function getIntentTags(
  intentCategory: string,
  companySize?: string,
  industry?: string
): string[] {
  const tags: string[] = [];

  // Intent tags
  switch (intentCategory) {
    case "hot":
      tags.push("hot-lead", "priority");
      break;
    case "warm":
      tags.push("warm-lead");
      break;
    case "cold":
      tags.push("cold-lead", "nurture");
      break;
  }

  // Company size tags
  if (companySize) {
    tags.push(`size-${companySize}`);
    if (companySize === "enterprise") {
      tags.push("enterprise-target");
    }
  }

  // Industry tags
  if (industry) {
    tags.push(`industry-${industry.toLowerCase().replace(/\s+/g, "-")}`);
  }

  return tags;
}
