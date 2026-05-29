import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowIcon, CheckIcon, DarkShell } from "@/components/site-dark/DarkShell";

type WebinarPageProps = {
  params: {
    slug: string;
  };
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

async function getWebinar(slug: string): Promise<Webinar | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .single();

  if (error || !data) return null;
  return data as Webinar;
}

export async function generateMetadata({ params }: WebinarPageProps): Promise<Metadata> {
  const webinar = await getWebinar(params.slug);

  if (!webinar) {
    return { title: "Webinar Not Found | ArqAI Labs" };
  }

  return {
    title: `${webinar.title} | ArqAI Labs Webinars`,
    description: webinar.description,
    openGraph: {
      title: webinar.title,
      description: webinar.description,
      images: webinar.banner_image ? [webinar.banner_image] : [],
    },
  };
}

function formatDate(dateString: string, timezone: string): { date: string; time: string; full: string } {
  const date = new Date(dateString);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
    full: `${dateFormatter.format(date)} at ${timeFormatter.format(date)}`,
  };
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}h ${mins}m`;
}

function getStatusLabel(status: Webinar["status"], recordingUrl: string) {
  if (status === "live") return "Live now";
  if (status === "on-demand" || recordingUrl) return "On-demand";
  if (status === "upcoming") return "Upcoming";
  return "Past event";
}

export default async function WebinarPage({ params }: WebinarPageProps) {
  const webinar = await getWebinar(params.slug);

  if (!webinar) {
    notFound();
  }

  const formattedDate = formatDate(webinar.webinar_date, webinar.timezone);
  const isOnDemand = webinar.status === "on-demand" || Boolean(webinar.recording_url);
  const actionUrl = isOnDemand ? webinar.recording_url : webinar.registration_url;
  const actionText = isOnDemand ? "Watch recording" : "Register now";

  return (
    <DarkShell>
      <section className="a-hero" style={{ paddingBottom: 0 }}>
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <span className="a-pill">
            <span className="dot" /> {getStatusLabel(webinar.status, webinar.recording_url)}
          </span>
          <h1 className="h-display" style={{ marginTop: 28, maxWidth: "16ch" }}>
            {webinar.title}
          </h1>
          <p className="lede" style={{ marginTop: 28, maxWidth: "66ch" }}>
            {webinar.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
            <span className="a-tag">{formattedDate.full}</span>
            <span className="a-tag">{formatDuration(webinar.duration)}</span>
          </div>

          <div className="a-card" style={{ marginTop: 48, padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", aspectRatio: "16 / 7", minHeight: 280, background: "var(--ink-2)" }}>
              {webinar.banner_image ? (
                <img
                  src={webinar.banner_image}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : null}
              <div className="svc-media-shade" />
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="detail-content-grid">
            <div style={{ display: "grid", gap: 40 }}>
              {webinar.description ? (
                <article>
                  <span className="a-eyebrow">About this webinar</span>
                  <p className="lede" style={{ marginTop: 18, whiteSpace: "pre-wrap" }}>
                    {webinar.description}
                  </p>
                </article>
              ) : null}

              {webinar.learning_points?.length ? (
                <article>
                  <span className="a-eyebrow">What you will learn</span>
                  <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
                    {webinar.learning_points.map((point) => (
                      <div key={point} className="a-card" style={{ padding: 20, display: "flex", gap: 12 }}>
                        <span style={{ color: "var(--ember)", marginTop: 2 }}>
                          <CheckIcon />
                        </span>
                        <p style={{ margin: 0, color: "var(--ink-cream-d)", lineHeight: 1.55 }}>{point}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}

              {webinar.presenters?.length ? (
                <article>
                  <span className="a-eyebrow">{webinar.presenters.length === 1 ? "Host" : "Hosts"}</span>
                  <div className="svc-grid" style={{ marginTop: 22 }}>
                    {webinar.presenters.map((presenter) => (
                      <div className="a-card" key={`${presenter.name}-${presenter.title}`} style={{ padding: 24 }}>
                        <h3 style={{ color: "var(--ink-cream)", fontFamily: "var(--display)", fontSize: 24, margin: 0 }}>
                          {presenter.name}
                        </h3>
                        <p style={{ color: "var(--ink-cream-d)", marginTop: 8 }}>{presenter.title}</p>
                        {presenter.company ? <p className="kicker" style={{ marginTop: 12 }}>{presenter.company}</p> : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>

            <aside className="a-card" style={{ padding: 28, alignSelf: "start", position: "sticky", top: 112 }}>
              <span className="a-eyebrow">Session details</span>
              <dl style={{ display: "grid", gap: 16, marginTop: 22 }}>
                <div>
                  <dt className="kicker">Date</dt>
                  <dd style={{ color: "var(--ink-cream)", margin: "6px 0 0" }}>{formattedDate.date}</dd>
                </div>
                <div>
                  <dt className="kicker">Time</dt>
                  <dd style={{ color: "var(--ink-cream)", margin: "6px 0 0" }}>{formattedDate.time}</dd>
                </div>
                <div>
                  <dt className="kicker">Duration</dt>
                  <dd style={{ color: "var(--ink-cream)", margin: "6px 0 0" }}>{formatDuration(webinar.duration)}</dd>
                </div>
              </dl>

              {actionUrl ? (
                <a
                  href={actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a-btn a-btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 28 }}
                >
                  {actionText} <ArrowIcon className="arrow" />
                </a>
              ) : (
                <div className="a-tag" style={{ marginTop: 28 }}>
                  Registration link coming soon
                </div>
              )}

              <Link href="/webinars" className="a-btn a-btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>
                Back to webinars
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
