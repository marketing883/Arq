import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";

let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  supabase = createClient(url, key);
  return supabase;
}

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // contacts, resources, subscribers, partners, all

    const client = getSupabaseClient();
    if (!client) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    let csvContent = "";
    const sections: string[] = [];

    // Contacts
    if (type === "contacts" || type === "all") {
      const { data: contacts } = await client
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (contacts && contacts.length > 0) {
        if (type === "all") sections.push("=== CONTACT SUBMISSIONS ===\n");
        csvContent += "Name,Email,Company,Job Title,Inquiry Type,Message,Status,Date\n";
        contacts.forEach((c) => {
          csvContent += `${escapeCSV(c.name)},${escapeCSV(c.email)},${escapeCSV(c.company)},${escapeCSV(c.job_title)},${escapeCSV(c.inquiry_type)},${escapeCSV(c.message)},${escapeCSV(c.status)},${escapeCSV(formatDate(c.created_at))}\n`;
        });
        if (type === "all") csvContent += "\n\n";
      }
    }

    // Resources
    if (type === "resources" || type === "all") {
      const { data: leads } = await client
        .from("resource_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leads && leads.length > 0) {
        if (type === "all") {
          csvContent += "=== RESOURCE DOWNLOADS ===\n";
        }
        csvContent += "Name,Email,Company,Job Title,Resource Type,Resource ID,Downloaded,Download Date,Request Date\n";
        leads.forEach((l) => {
          csvContent += `${escapeCSV(l.name)},${escapeCSV(l.email)},${escapeCSV(l.company)},${escapeCSV(l.job_title)},${escapeCSV(l.resource_type)},${escapeCSV(l.resource_id)},${l.token_used ? "Yes" : "No"},${escapeCSV(formatDate(l.downloaded_at))},${escapeCSV(formatDate(l.created_at))}\n`;
        });
        if (type === "all") csvContent += "\n\n";
      }
    }

    // Subscribers
    if (type === "subscribers" || type === "all") {
      const { data: subs } = await client
        .from("newsletter_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (subs && subs.length > 0) {
        if (type === "all") {
          csvContent += "=== NEWSLETTER SUBSCRIBERS ===\n";
        }
        csvContent += "Email,Source,Segment,Status,Subscribed Date\n";
        subs.forEach((s) => {
          csvContent += `${escapeCSV(s.email)},${escapeCSV(s.source)},${escapeCSV(s.segment)},${escapeCSV(s.status)},${escapeCSV(formatDate(s.created_at))}\n`;
        });
        if (type === "all") csvContent += "\n\n";
      }
    }

    // Partner Enquiries
    if (type === "partners" || type === "all") {
      const { data: partners } = await client
        .from("partner_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (partners && partners.length > 0) {
        if (type === "all") {
          csvContent += "=== PARTNER ENQUIRIES ===\n";
        }
        csvContent += "Name,Email,Company,Phone,Job Title,Partnership Type,Company Size,Status,Priority,Message,Website,Assigned To,Last Contact,Date\n";
        partners.forEach((p) => {
          csvContent += `${escapeCSV(p.name)},${escapeCSV(p.email)},${escapeCSV(p.company)},${escapeCSV(p.phone)},${escapeCSV(p.job_title)},${escapeCSV(p.partnership_type)},${escapeCSV(p.company_size)},${escapeCSV(p.status)},${escapeCSV(p.priority)},${escapeCSV(p.message)},${escapeCSV(p.website)},${escapeCSV(p.assigned_to)},${escapeCSV(formatDate(p.last_contact_at))},${escapeCSV(formatDate(p.created_at))}\n`;
        });
      }
    }

    if (!csvContent) {
      csvContent = "No data available";
    }

    const filename = type === "all" ? "all-leads" : type;
    const date = new Date().toISOString().split("T")[0];

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}-${date}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
