import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const webinar = await getWebinar(slug);

  if (!webinar) {
    return { title: "Webinar Not Found | ArqAI" };
  }

  return {
    title: `${webinar.title} | ArqAI Webinars`,
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

function getStatusBadge(status: string, webinarDate: string) {
  const now = new Date();
  const date = new Date(webinarDate);
  const isUpcoming = date > now;

  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Live Now
      </span>
    );
  }

  if (status === "on-demand") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        On-Demand
      </span>
    );
  }

  if (isUpcoming) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upcoming
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      Past Event
    </span>
  );
}

export default async function WebinarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const webinar = await getWebinar(slug);

  if (!webinar) {
    notFound();
  }

  const formattedDate = formatDate(webinar.webinar_date, webinar.timezone);
  const isOnDemand = webinar.status === "on-demand" || !!webinar.recording_url;
  const actionUrl = isOnDemand ? webinar.recording_url : webinar.registration_url;
  const actionText = isOnDemand ? "Watch Recording" : "Register Now";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative">
        {/* Banner Image */}
        {webinar.banner_image ? (
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src={webinar.banner_image}
              alt={webinar.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>
        ) : (
          <div className="h-[300px] bg-gradient-to-br from-blue-600 to-purple-700" />
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              {getStatusBadge(webinar.status, webinar.webinar_date)}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
              {webinar.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm md:text-base">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate.date}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formattedDate.time}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {formatDuration(webinar.duration)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {webinar.description && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About This Webinar</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed whitespace-pre-wrap">
                    {webinar.description}
                  </p>
                </div>
              )}

              {/* What You'll Learn */}
              {webinar.learning_points && webinar.learning_points.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What You&apos;ll Learn</h2>
                  <ul className="space-y-4">
                    {webinar.learning_points.map((point, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-semibold">
                          {index + 1}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 text-lg pt-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Presenters */}
              {webinar.presenters && webinar.presenters.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {webinar.presenters.length === 1 ? "Your Host" : "Your Hosts"}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {webinar.presenters.map((presenter, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                        {presenter.photo ? (
                          <img
                            src={presenter.photo}
                            alt={presenter.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                            {presenter.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{presenter.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{presenter.title}</p>
                          {presenter.company && (
                            <p className="text-sm text-blue-600 dark:text-blue-400">{presenter.company}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                {isOnDemand ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Watch On-Demand</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Available now</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                      This webinar has already taken place, but you can watch the recording at your convenience.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Reserve Your Spot</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Free to attend</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Date</span>
                        <span className="font-medium text-slate-900 dark:text-white">{formattedDate.date.split(",").slice(1).join(",").trim()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Time</span>
                        <span className="font-medium text-slate-900 dark:text-white">{formattedDate.time}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Duration</span>
                        <span className="font-medium text-slate-900 dark:text-white">{formatDuration(webinar.duration)}</span>
                      </div>
                    </div>
                  </>
                )}

                {actionUrl ? (
                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-6 text-center text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    {actionText}
                    <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <div className="py-3 px-6 text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    Registration link coming soon
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-4">
                  You&apos;ll be redirected to our webinar platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Webinars */}
      <section className="py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/webinars"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Webinars
          </Link>
        </div>
      </section>
    </div>
  );
}
