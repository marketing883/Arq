"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type JobListItem = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  short_description: string | null;
  experience_level: string | null;
  remote: boolean;
  published_at: string | null;
  created_at: string;
};

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M19.6,9.6h-3.9c-.4,0-1.8-.2-1.8-.2-.6,0-1.1-.2-1.6-.6-.5-.3-.9-.8-1.2-1.2-.3-.4-.4-.9-.5-1.4,0,0,0-1.1-.2-1.5V.4c0-.2-.2-.4-.4-.4s-.4.2-.4.4v4.4c0,.4-.2,1.5-.2,1.5,0,.5-.2,1-.5,1.4-.3.5-.7.9-1.2,1.2s-1,.5-1.6.6c0,0-1.2,0-1.7.2H.4c-.2,0-.4.2-.4.4s.2.4.4.4h4.1c.4,0,1.7.2,1.7.2.6,0,1.1.2,1.6.6.4.3.8.7,1.1,1.1.3.5.5,1,.6,1.6,0,0,0,1.3.2,1.7v4.1c0,.2.2.4.4.4s.4-.2.4-.4v-4.1c0-.4.2-1.7.2-1.7,0-.6.2-1.1.6-1.6.3-.4.7-.8,1.1-1.1.5-.3,1-.5,1.6-.6,0,0,1.3,0,1.8-.2h3.9c.2,0,.4-.2.4-.4s-.2-.4-.4-.4h0Z" />
    </svg>
  );
}

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  temporary: "Temporary",
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [employmentType, setEmploymentType] = useState<string>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/careers", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setJobs(data.jobs ?? []);
        setError(null);
      })
      .catch(() => active && setError("Could not load roles."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.department))).sort(),
    [jobs]
  );
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );
  const employmentTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.employment_type))).sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (department !== "all" && j.department !== department) return false;
      if (location !== "all" && j.location !== location) return false;
      if (employmentType !== "all" && j.employment_type !== employmentType) return false;
      if (remoteOnly && !j.remote) return false;
      if (q) {
        const hay = `${j.title} ${j.department} ${j.location} ${j.short_description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [jobs, department, location, employmentType, remoteOnly, search]);

  const clearFilters = () => {
    setDepartment("all");
    setLocation("all");
    setEmploymentType("all");
    setRemoteOnly(false);
    setSearch("");
  };

  const activeFilterCount =
    (department !== "all" ? 1 : 0) +
    (location !== "all" ? 1 : 0) +
    (employmentType !== "all" ? 1 : 0) +
    (remoteOnly ? 1 : 0) +
    (search.trim() ? 1 : 0);

  return (
    <>
      <Header />

      <main className="bg-base">
        {/* Hero */}
        <section className="pt-32 md:pt-40 pb-12 md:pb-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <p className="flex items-center gap-2 text-body-sm text-accent mb-6 uppercase tracking-wider font-medium">
                <StarIcon className="w-4 h-4" />
                Careers
              </p>
              <h1 className="text-display-xl md:text-[clamp(2.5rem,5vw,4.5rem)] font-display leading-[1.1] text-text-bright mb-6">
                Join the team shipping production AI.
              </h1>
              <p className="text-body-lg md:text-xl text-text-medium leading-relaxed max-w-3xl">
                We are a lean team of senior AI engineers and domain leads building bespoke AI
                for the operations that matter. If you would rather build than describe, look
                below.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters + jobs */}
        <section className="pb-section">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Filters */}
              <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-display font-semibold text-text-bright">
                      Filter roles
                    </h2>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-body-xs text-accent hover:underline"
                      >
                        Clear ({activeFilterCount})
                      </button>
                    )}
                  </div>

                  <label className="block mb-4">
                    <span className="block text-body-xs text-text-muted uppercase tracking-wider mb-2">
                      Search
                    </span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Title, location, keyword"
                      className="w-full px-3 py-2.5 rounded-lg bg-base border border-stroke-muted text-body-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </label>

                  <Select
                    label="Department"
                    value={department}
                    onChange={setDepartment}
                    options={["all", ...departments]}
                  />
                  <Select
                    label="Location"
                    value={location}
                    onChange={setLocation}
                    options={["all", ...locations]}
                  />
                  <Select
                    label="Employment type"
                    value={employmentType}
                    onChange={setEmploymentType}
                    options={["all", ...employmentTypes]}
                    formatter={(v) => (v === "all" ? "All" : employmentTypeLabel[v] || v)}
                  />

                  <label className="flex items-center gap-2 text-body-sm text-text-bright mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-stroke-muted text-accent focus:ring-accent"
                    />
                    Remote-friendly only
                  </label>
                </div>

                <div className="mt-6 p-5 rounded-lg bg-base-tint border border-stroke-muted text-body-sm text-text-muted">
                  Don&apos;t see the right role? We&apos;re always interested in senior engineers and
                  domain leads.{" "}
                  <Link href="/contact" className="text-accent hover:underline font-medium">
                    Send us a note &rarr;
                  </Link>
                </div>
              </aside>

              {/* Results */}
              <div className="lg:col-span-8">
                {loading ? (
                  <p className="text-body-md text-text-muted">Loading roles...</p>
                ) : error ? (
                  <p className="text-body-md text-text-muted">{error}</p>
                ) : filtered.length === 0 ? (
                  <div className="card p-10 text-center">
                    <h3 className="text-xl font-display font-semibold text-text-bright mb-3">
                      {jobs.length === 0 ? "No roles open right now." : "No roles match those filters."}
                    </h3>
                    <p className="text-body-md text-text-muted mb-6">
                      {jobs.length === 0
                        ? "We will post new roles here. Bookmark or check back."
                        : "Try clearing one of the filters."}
                    </p>
                    {jobs.length === 0 ? (
                      <Link href="/contact" className="btn btn-outline">
                        Tell us why we should hire you anyway
                      </Link>
                    ) : (
                      <button onClick={clearFilters} className="btn btn-outline">
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {filtered.map((job) => (
                      <motion.li
                        key={job.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Link
                          href={`/careers/${job.slug}`}
                          className="group block card p-6 md:p-7 hover:border-accent transition-colors"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-3 text-body-xs text-accent uppercase tracking-wider">
                            <span>{job.department}</span>
                            <span className="text-text-muted">/</span>
                            <span>{employmentTypeLabel[job.employment_type] ?? job.employment_type}</span>
                            {job.experience_level && (
                              <>
                                <span className="text-text-muted">/</span>
                                <span>{job.experience_level}</span>
                              </>
                            )}
                            {job.remote && (
                              <>
                                <span className="text-text-muted">/</span>
                                <span>Remote-friendly</span>
                              </>
                            )}
                          </div>
                          <h3 className="text-2xl font-display font-semibold text-text-bright group-hover:text-accent transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-body-sm text-text-muted mt-1">{job.location}</p>
                          {job.short_description && (
                            <p className="text-body-md text-text-muted mt-3 leading-relaxed">
                              {job.short_description}
                            </p>
                          )}
                          <div className="mt-5 inline-flex items-center gap-2 text-accent font-medium">
                            View role
                            <svg
                              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  formatter,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  formatter?: (v: string) => string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-body-xs text-text-muted uppercase tracking-wider mb-2">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-base border border-stroke-muted text-body-sm text-text-bright focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatter ? formatter(opt) : opt === "all" ? "All" : opt}
          </option>
        ))}
      </select>
    </label>
  );
}
