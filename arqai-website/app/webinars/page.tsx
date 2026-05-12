import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";

export const metadata: Metadata = {
  title: "Webinars | ArqAI Labs",
  description:
    "Live and on-demand sessions for teams moving from AI pilots to governed enterprise workflows.",
};

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

interface Presenter {
  name: string;
  title: string;
  company: string;
  photo: string;
}

interface Webinar {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner_image: string;
  webinar_date: string;
  duration: number;
  timezone: string;
  presenters: Presenter[];
  learning_points: string[];
  registration_url: string;
  recording_url: string;
  status: "upcoming" | "live" | "on-demand" | "past" | "draft";
  featured: boolean;
}

async function getWebinars(): Promise<{ upcoming: Webinar[]; onDemand: Webinar[] }> {
  const supabase = getSupabase();
  if (!supabase) return { upcoming: [], onDemand: [] };

  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .neq("status", "draft")
    .order("webinar_date", { ascending: true });

  if (error || !data) return { upcoming: [], onDemand: [] };

  const now = new Date();
  const webinars = data as Webinar[];

  const upcoming = webinars.filter((webinar) => {
    const date = new Date(webinar.webinar_date);
    return (webinar.status === "upcoming" || webinar.status === "live") && date >= now;
  });

  const onDemand = webinars.filter((webinar) => {
    return webinar.status === "on-demand" || Boolean(webinar.recording_url?.trim());
  });

  return { upcoming, onDemand };
}

function formatDate(dateString: string, timezone: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  }).format(date);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function WebinarCard({ webinar, isOnDemand = false }: { webinar: Webinar; isOnDemand?: boolean }) {
  const actionUrl = isOnDemand ? webinar.recording_url : webinar.registration_url;

  return (
    <article className="a-card" style={{ padding: 0, overflow: "hidden" }}>
      <Link href={`/webinars/${webinar.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
        <div style={{ position: "relative", aspectRatio: "16 / 9", background: "var(--ink-2)", overflow: "hidden" }}>
          {webinar.banner_image ? (
            <img
              src={webinar.banner_image}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null}
          <div className="svc-media-shade" />
          <div style={{ position: "absolute", left: 18, top: 18 }}>
            <span className="a-tag">{webinar.status === "live" ? "Live" : isOnDemand ? "On-demand" : "Upcoming"}</span>
          </div>
          <div style={{ position: "absolute", right: 18, top: 18 }}>
            <span className="a-tag">{formatDuration(webinar.duration)}</span>
          </div>
        </div>
      </Link>

      <div style={{ padding: 24 }}>
        <div className="kicker">{formatDate(webinar.webinar_date, webinar.timezone)}</div>
        <Link href={`/webinars/${webinar.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
          <h3 style={{ color: "var(--ink-cream)", fontFamily: "var(--display)", fontSize: 24, lineHeight: 1.2, marginTop: 14 }}>
            {webinar.title}
          </h3>
        </Link>
        {webinar.description ? (
          <p style={{ color: "var(--ink-cream-d)", lineHeight: 1.6, marginTop: 12 }}>{webinar.description}</p>
        ) : null}
        {webinar.presenters?.length ? (
          <p className="kicker" style={{ marginTop: 18 }}>
            {webinar.presenters.map((presenter) => presenter.name).join(", ")}
          </p>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
          <Link href={`/webinars/${webinar.slug}`} className="a-btn a-btn-ghost" style={{ padding: "10px 16px", fontSize: 13 }}>
            View details <ArrowIcon className="arrow" />
          </Link>
          {actionUrl ? (
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="a-btn a-btn-primary"
              style={{ padding: "10px 16px", fontSize: 13 }}
            >
              {isOnDemand ? "Watch" : "Register"} <ArrowIcon className="arrow" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function WebinarsPage() {
  const { upcoming, onDemand } = await getWebinars();
  const hasWebinars = upcoming.length > 0 || onDemand.length > 0;

  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative", textAlign: "center" }}>
          <span className="a-pill">
            <span className="dot" /> Webinars
          </span>
          <h1 className="h-display" style={{ margin: "28px auto 0", maxWidth: "14ch" }}>
            Field notes for production enterprise AI.
          </h1>
          <p className="lede" style={{ margin: "28px auto 0", maxWidth: "66ch" }}>
            Live and on-demand sessions for leaders turning AI from pilots into governed workflows.
          </p>
        </div>
      </section>

      {upcoming.length > 0 ? (
        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">Upcoming</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Join the next session.
                </h2>
              </div>
              <p className="lede">Practical conversations for teams moving AI into real operating environments.</p>
            </div>
            <div className="svc-grid" style={{ marginTop: 44 }}>
              {upcoming.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {onDemand.length > 0 ? (
        <section className="a-section">
          <div className="a-wrap">
            <div className="a-section-head">
              <div>
                <span className="a-eyebrow">On-demand</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  Watch when the workflow needs it.
                </h2>
              </div>
              <p className="lede">Recorded sessions, product thinking, and implementation guidance.</p>
            </div>
            <div className="svc-grid" style={{ marginTop: 44 }}>
              {onDemand.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} isOnDemand />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!hasWebinars ? (
        <section className="a-section">
          <div className="a-wrap">
            <div className="a-card" style={{ padding: "clamp(32px, 6vw, 72px)", textAlign: "center" }}>
              <span className="a-eyebrow" style={{ justifyContent: "center" }}>Coming soon</span>
              <h2 className="h-section" style={{ marginTop: 18 }}>
                The next sessions are being prepared.
              </h2>
              <p className="lede" style={{ margin: "18px auto 0", maxWidth: "58ch" }}>
                Until then, bring us the workflow you want to modernize and we will tell you what is honestly possible.
              </p>
              <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
                Engage us <ArrowIcon className="arrow" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </DarkShell>
  );
}
