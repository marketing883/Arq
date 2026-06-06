import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";

export const metadata: Metadata = {
  title: "Webinars | ArqAI Labs",
  description:
    "Live and on-demand sessions for teams moving from AI pilots to governed enterprise workflows.",
  alternates: { canonical: "https://thearq.ai/webinars" },
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
    <article className="v5-blog-card">
      <Link href={`/webinars/${webinar.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
        <div className="v5-blog-cover">
          {webinar.banner_image ? (
            <img
              src={webinar.banner_image}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="v5-blog-cover-placeholder" />
          )}
          <div style={{ position: "absolute", left: 14, top: 14 }}>
            <span className="v5-chip">{webinar.status === "live" ? "Live" : isOnDemand ? "On-demand" : "Upcoming"}</span>
          </div>
          <div style={{ position: "absolute", right: 14, top: 14 }}>
            <span className="v5-chip">{formatDuration(webinar.duration)}</span>
          </div>
        </div>
      </Link>

      <div className="v5-blog-body">
        <span className="v5-blog-meta">{formatDate(webinar.webinar_date, webinar.timezone)}</span>
        <Link href={`/webinars/${webinar.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
          <h3 className="v5-h3">{webinar.title}</h3>
        </Link>
        {webinar.description ? <p className="v5-body">{webinar.description}</p> : null}
        {webinar.presenters?.length ? (
          <p className="v5-blog-meta" style={{ marginTop: 14 }}>
            {webinar.presenters.map((presenter) => presenter.name).join(", ")}
          </p>
        ) : null}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
          <Link href={`/webinars/${webinar.slug}`} className="v5-btn v5-btn-ghost">
            View details <ArrowRight />
          </Link>
          {actionUrl ? (
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v5-btn v5-btn-primary"
            >
              {isOnDemand ? "Watch" : "Register"} <ArrowRight />
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
    <V5SiteLayout>
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Webinars
            </span>
            <h1 className="v5-h1">Field notes for production enterprise AI.</h1>
            <p className="v5-lead">
              Live and on-demand sessions for leaders turning AI from pilots into governed
              workflows.
            </p>
          </div>
        </div>
      </section>

      {upcoming.length > 0 ? (
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">Upcoming</span>
              <h2 className="v5-h2">Join the next session.</h2>
              <p className="v5-lead">
                Practical conversations for teams moving AI into real operating environments.
              </p>
            </div>
            <div className="v5-blog-grid">
              {upcoming.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {onDemand.length > 0 ? (
        <section className="v5-section v5-bg-white">
          <div className="v5-container">
            <div className="v5-section-head">
              <span className="v5-eyebrow">On-demand</span>
              <h2 className="v5-h2">Watch when the workflow needs it.</h2>
              <p className="v5-lead">
                Recorded sessions, product thinking, and implementation guidance.
              </p>
            </div>
            <div className="v5-blog-grid">
              {onDemand.map((webinar) => (
                <WebinarCard key={webinar.id} webinar={webinar} isOnDemand />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!hasWebinars ? (
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div className="v5-card" style={{ padding: "clamp(32px, 6vw, 72px)", textAlign: "center" }}>
              <span className="v5-eyebrow">Coming soon</span>
              <h2 className="v5-h2" style={{ marginTop: 14 }}>
                The next sessions are being prepared.
              </h2>
              <p className="v5-lead" style={{ margin: "18px auto 0", maxWidth: "58ch" }}>
                Until then, bring us the workflow you want to modernize and we will tell you
                what is honestly possible.
              </p>
              <div style={{ marginTop: 28 }}>
                <Link href="/engage-us" className="v5-btn v5-btn-primary">
                  Get Started <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </V5SiteLayout>
  );
}
