"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import ClosingCta from "@/components/v6/ClosingCta";
import { ArrowRight } from "@/components/home-v5/icons";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

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
    <div className="v5-shell">
      <V6Nav />
      <main>
        {/* Hero */}
        <section className="v5-page-hero">
          <div className="v5-container">
            <div className="v5-page-hero-inner">
              <span className="v5-badge">
                <span className="v5-badge-dot" />
                Careers
              </span>
              <h1 className="v5-h1">Join the team shipping production AI.</h1>
              <p className="v5-lead">
                We are a lean team of senior AI engineers and domain leads building bespoke AI
                for the operations that matter. If you would rather build than describe, look
                below.
              </p>
            </div>
          </div>
        </section>

        {/* Filters + jobs */}
        <section className="v5-section v5-bg-grey">
          <div className="v5-container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)",
                gap: 40,
                alignItems: "start",
              }}
            >
              {/* Filters */}
              <aside className="v5-card" style={{ position: "sticky", top: 100 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <h2 className="v5-h3" style={{ margin: 0 }}>
                    Filter roles
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="v5-btn v5-btn-ghost"
                      style={{ padding: "4px 10px", fontSize: 13 }}
                    >
                      Clear ({activeFilterCount})
                    </button>
                  )}
                </div>

                <label className="v5-field">
                  <span className="v5-field-label">Search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Title, location, keyword"
                    className="v5-input"
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

                <label
                  className="v5-body"
                  style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                  />
                  Remote-friendly only
                </label>

                <p className="v5-body" style={{ marginTop: 24, color: "var(--v5-ink-soft)" }}>
                  Don&apos;t see the right role? We&apos;re always interested in senior engineers and
                  domain leads.{" "}
                  <Link href="/contact">Send us a note &rarr;</Link>
                </p>
              </aside>

              {/* Results */}
              <div>
                {loading ? (
                  <p className="v5-body">Loading roles...</p>
                ) : error ? (
                  <p className="v5-body">{error}</p>
                ) : filtered.length === 0 ? (
                  <div className="v5-card" style={{ textAlign: "center" }}>
                    <h3 className="v5-h3">
                      {jobs.length === 0 ? "No roles open right now." : "No roles match those filters."}
                    </h3>
                    <p className="v5-body" style={{ marginTop: 8, marginBottom: 20 }}>
                      {jobs.length === 0
                        ? "We will post new roles here. Bookmark or check back."
                        : "Try clearing one of the filters."}
                    </p>
                    {jobs.length === 0 ? (
                      <Link href="/contact" className="v5-btn v5-btn-dark">
                        Tell us why we should hire you anyway
                      </Link>
                    ) : (
                      <button onClick={clearFilters} className="v5-btn v5-btn-dark">
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="v5-grid" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
                    {filtered.map((job) => (
                      <Link
                        key={job.id}
                        href={`/careers/${job.slug}`}
                        className="v5-card v5-card-link"
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                          <span className="v5-chip">{job.department}</span>
                          <span className="v5-chip">
                            {employmentTypeLabel[job.employment_type] ?? job.employment_type}
                          </span>
                          {job.experience_level && <span className="v5-chip">{job.experience_level}</span>}
                          {job.remote && <span className="v5-chip">Remote-friendly</span>}
                        </div>
                        <h3 className="v5-h3">{job.title}</h3>
                        <p className="v5-body" style={{ marginTop: 4, color: "var(--v5-ink-soft)" }}>
                          {job.location}
                        </p>
                        {job.short_description && (
                          <p className="v5-body" style={{ marginTop: 12 }}>
                            {job.short_description}
                          </p>
                        )}
                        <span className="v5-card-more">
                          View role <ArrowRight />
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <ClosingCta
          heading="Building production AI somewhere else?"
          sub="If the right opening isn't listed, talk to us anyway — we hire for the work. And if you're here about a project, the same door works."
        />
      </main>
      <V6Footer />
    </div>
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
    <label className="v5-field">
      <span className="v5-field-label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="v5-input">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatter ? formatter(opt) : opt === "all" ? "All" : opt}
          </option>
        ))}
      </select>
    </label>
  );
}
