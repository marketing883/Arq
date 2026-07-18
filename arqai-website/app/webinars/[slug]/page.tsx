import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";
import { ArrowRight } from "@/components/home-v5/icons";

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
    return { title: "Webinar Not Found" };
  }

  return {
    title: `${webinar.title} — Webinar`,
    description: webinar.description,
    alternates: { canonical: `https://thearq.ai/webinars/${params.slug}` },
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
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <div className="v5-crumbs">
              <Link href="/webinars">Webinars</Link>
              <span>/</span>
              <span style={{ color: "var(--v5-ink-soft)" }}>{webinar.title}</span>
            </div>

            <span className="v5-badge" style={{ marginTop: 18 }}>
              <span className="v5-badge-dot" />
              {getStatusLabel(webinar.status, webinar.recording_url)}
            </span>

            <h1 className="v5-h1" style={{ marginTop: 18 }}>
              {webinar.title}
            </h1>

            <p className="v5-lead" style={{ marginTop: 18 }}>
              {webinar.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
              <span className="v5-chip">{formattedDate.full}</span>
              <span className="v5-chip">{formatDuration(webinar.duration)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      {webinar.banner_image ? (
        <section className="v5-section v5-bg-white" style={{ paddingTop: 0 }}>
          <div className="v5-container">
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 7",
                minHeight: 280,
                borderRadius: 16,
                overflow: "hidden",
                background: "var(--v5-grey-5)",
              }}
            >
              <img
                src={webinar.banner_image}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Content */}
      <section className="v5-section v5-bg-grey">
        <div className="v5-container">
          <div className="v5-split">
            <div className="v5-split-copy" style={{ display: "grid", gap: 40 }}>
              {webinar.description ? (
                <article>
                  <span className="v5-eyebrow">About this webinar</span>
                  <p className="v5-lead" style={{ marginTop: 18, whiteSpace: "pre-wrap" }}>
                    {webinar.description}
                  </p>
                </article>
              ) : null}

              {webinar.learning_points?.length ? (
                <article>
                  <span className="v5-eyebrow">What you will learn</span>
                  <ul className="v5-list">
                    {webinar.learning_points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {webinar.presenters?.length ? (
                <article>
                  <span className="v5-eyebrow">
                    {webinar.presenters.length === 1 ? "Host" : "Hosts"}
                  </span>
                  <div className="v5-grid v5-grid-2" style={{ marginTop: 22 }}>
                    {webinar.presenters.map((presenter) => (
                      <div className="v5-card" key={`${presenter.name}-${presenter.title}`}>
                        <h3 className="v5-h3">{presenter.name}</h3>
                        <p className="v5-body" style={{ marginTop: 8 }}>
                          {presenter.title}
                        </p>
                        {presenter.company ? (
                          <p className="v5-card-eyebrow" style={{ marginTop: 12 }}>
                            {presenter.company}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>

            <div className="v5-split-media">
              <aside className="v5-card" style={{ alignSelf: "start", position: "sticky", top: 112 }}>
                <span className="v5-eyebrow">Session details</span>
                <dl style={{ display: "grid", gap: 16, marginTop: 22 }}>
                  <div>
                    <dt className="v5-card-eyebrow">Date</dt>
                    <dd className="v5-body" style={{ margin: "6px 0 0", color: "var(--v5-ink)" }}>
                      {formattedDate.date}
                    </dd>
                  </div>
                  <div>
                    <dt className="v5-card-eyebrow">Time</dt>
                    <dd className="v5-body" style={{ margin: "6px 0 0", color: "var(--v5-ink)" }}>
                      {formattedDate.time}
                    </dd>
                  </div>
                  <div>
                    <dt className="v5-card-eyebrow">Duration</dt>
                    <dd className="v5-body" style={{ margin: "6px 0 0", color: "var(--v5-ink)" }}>
                      {formatDuration(webinar.duration)}
                    </dd>
                  </div>
                </dl>

                {actionUrl ? (
                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v5-btn v5-btn-primary"
                    style={{ width: "100%", justifyContent: "center", marginTop: 28 }}
                  >
                    {actionText} <ArrowRight />
                  </a>
                ) : (
                  <div className="v5-chip" style={{ marginTop: 28 }}>
                    Registration link coming soon
                  </div>
                )}

                <Link
                  href="/webinars"
                  className="v5-btn v5-btn-ghost"
                  style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
                >
                  Back to webinars
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
