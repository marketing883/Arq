/**
 * Admin Home aggregate: everything the team needs to know at the start of the
 * day, in one call. Hot uncontacted leads, overdue follow-ups, active alerts,
 * research agent health, and fresh inbound submissions across every source.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  getLeadDashboard,
  getLeadProfileStats,
  getActiveAlerts,
} from "@/lib/lead/lead-profile-service";
import { getResearchHealth } from "@/lib/lead/lead-actions-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

interface InboundItem {
  id: string;
  source: "contact" | "partner" | "download" | "subscriber";
  name?: string;
  email?: string;
  company?: string;
  detail?: string;
  created_at: string;
}

async function getRecentInbound(): Promise<{
  items: InboundItem[];
  week_counts: Record<string, number>;
}> {
  const supabase = getSupabase();
  if (!supabase) return { items: [], week_counts: {} };

  const weekAgo = new Date(Date.now() - WEEK_MS).toISOString();

  // A missing table (unapplied migration) must not break the whole home view.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safe = async (p: PromiseLike<{ data: any; error: any }>): Promise<any[]> => {
    try {
      const { data, error } = await p;
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  };

  const [contactRows, partnerRows, downloadRows, subscriberRows] = await Promise.all([
    safe(
      supabase
        .from("contact_submissions")
        .select("id, name, email, company, inquiry_type, created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    ),
    safe(
      supabase
        .from("partner_enquiries")
        .select("id, name, email, company, created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    ),
    safe(
      supabase
        .from("resource_leads")
        .select("id, name, email, company, resource_title, created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    ),
    safe(
      supabase
        .from("newsletter_subscriptions")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    ),
  ]);

  const items: InboundItem[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const c of contactRows) {
    items.push({
      id: `contact-${c.id}`,
      source: "contact",
      name: c.name,
      email: c.email,
      company: c.company,
      detail: c.inquiry_type ? `Contact form (${c.inquiry_type})` : "Contact form",
      created_at: c.created_at,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const p of partnerRows) {
    items.push({
      id: `partner-${p.id}`,
      source: "partner",
      name: p.name,
      email: p.email,
      company: p.company,
      detail: "Partner enquiry",
      created_at: p.created_at,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const d of downloadRows) {
    items.push({
      id: `download-${d.id}`,
      source: "download",
      name: d.name,
      email: d.email,
      company: d.company,
      detail: d.resource_title ? `Downloaded: ${d.resource_title}` : "Resource download",
      created_at: d.created_at,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const s of subscriberRows) {
    items.push({
      id: `subscriber-${s.id}`,
      source: "subscriber",
      email: s.email,
      detail: "Newsletter signup",
      created_at: s.created_at,
    });
  }

  items.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const week_counts: Record<string, number> = {
    contact: 0,
    partner: 0,
    download: 0,
    subscriber: 0,
  };
  for (const item of items) {
    if (new Date(item.created_at).toISOString() >= weekAgo) {
      week_counts[item.source] = (week_counts[item.source] || 0) + 1;
    }
  }

  return { items: items.slice(0, 10), week_counts };
}

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [leads, stats, research, alerts, inbound] = await Promise.all([
      getLeadDashboard({ limit: 100 }),
      getLeadProfileStats(),
      getResearchHealth(),
      getActiveAlerts(20),
      getRecentInbound(),
    ]);

    const now = Date.now();
    const hotUncontacted = leads
      .filter((l) => {
        const hot = l.priority_tier === "P1" || l.priority_tier === "P2";
        const open =
          !l.pipeline_status ||
          ["new", "researching", "contacted"].includes(l.pipeline_status);
        return hot && !l.last_contacted_at && open;
      })
      .slice(0, 6);

    const overdue = leads
      .filter(
        (l) =>
          l.next_step &&
          l.next_step_due_at &&
          new Date(l.next_step_due_at).getTime() < now
      )
      .sort(
        (a, b) =>
          new Date(a.next_step_due_at!).getTime() -
          new Date(b.next_step_due_at!).getTime()
      )
      .slice(0, 6);

    const newThisWeek = leads.filter((l) => {
      const start = l.first_touch || l.last_touch;
      return start && now - new Date(start).getTime() < WEEK_MS;
    }).length;

    return NextResponse.json({
      counts: {
        hot_uncontacted: hotUncontacted.length,
        overdue: overdue.length,
        new_this_week: newThisWeek,
        total_leads: stats.total_profiles,
        active_alerts: alerts.length,
      },
      hot_leads: hotUncontacted,
      overdue_leads: overdue,
      alerts: alerts.slice(0, 5),
      research,
      inbound: inbound.items,
      inbound_week_counts: inbound.week_counts,
    });
  } catch (error) {
    console.error("Admin home error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
