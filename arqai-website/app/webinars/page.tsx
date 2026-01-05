import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webinars | ArqAI",
  description: "Join our live webinars and watch on-demand sessions about AI-powered compliance, security, and enterprise solutions.",
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

  const upcoming = webinars.filter(w => {
    const date = new Date(w.webinar_date);
    return (w.status === "upcoming" || w.status === "live") && date >= now;
  });

  const onDemand = webinars.filter(w => {
    return w.status === "on-demand" || (w.recording_url && w.recording_url.trim());
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-700">
        {webinar.banner_image && (
          <img
            src={webinar.banner_image}
            alt={webinar.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {webinar.status === "live" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          ) : isOnDemand ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
              On-Demand
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
              Upcoming
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 rounded bg-slate-900/60 text-white text-xs">
            {formatDuration(webinar.duration)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(webinar.webinar_date, webinar.timezone)}
        </div>

        <Link href={`/webinars/${webinar.slug}`}>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {webinar.title}
          </h3>
        </Link>

        {webinar.description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {webinar.description}
          </p>
        )}

        {/* Presenters */}
        {webinar.presenters && webinar.presenters.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {webinar.presenters.slice(0, 3).map((presenter, idx) => (
                presenter.photo ? (
                  <img
                    key={idx}
                    src={presenter.photo}
                    alt={presenter.name}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  />
                ) : (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {presenter.name.charAt(0)}
                  </div>
                )
              ))}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {webinar.presenters.map(p => p.name).join(", ")}
            </span>
          </div>
        )}

        {/* Action */}
        <div className="flex items-center justify-between">
          <Link
            href={`/webinars/${webinar.slug}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            View Details
          </Link>

          {actionUrl && (
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isOnDemand ? "Watch Now" : "Register"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function WebinarsPage() {
  const { upcoming, onDemand } = await getWebinars();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ArqAI Webinars
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join our expert-led sessions on AI compliance, security best practices, and enterprise solutions.
          </p>
        </div>
      </section>

      {/* Upcoming Webinars */}
      {upcoming.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Webinars</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map(webinar => (
                <WebinarCard key={webinar.id} webinar={webinar} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On-Demand Webinars */}
      {onDemand.length > 0 && (
        <section className={`py-16 ${upcoming.length > 0 ? "bg-white dark:bg-slate-900" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">On-Demand</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onDemand.map(webinar => (
                <WebinarCard key={webinar.id} webinar={webinar} isOnDemand />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {upcoming.length === 0 && onDemand.length === 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Webinars Yet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Check back soon for upcoming webinars and on-demand content.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Stay Updated?</h2>
          <p className="text-slate-400 mb-8">
            Get notified about upcoming webinars and new on-demand content.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
          >
            Subscribe to Updates
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
