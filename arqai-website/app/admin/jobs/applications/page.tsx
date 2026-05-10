"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

type Application = {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  status: string;
  notified_at: string | null;
  resume_filename: string;
  resume_size_bytes: number;
  created_at: string;
  job_postings: {
    title: string;
    slug: string;
    department: string;
    location: string;
  } | null;
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  interviewed: "bg-purple-100 text-purple-700",
  offered: "bg-green-100 text-green-700",
  hired: "bg-emerald-100 text-emerald-700",
  rejected: "bg-gray-200 text-gray-700",
  withdrawn: "bg-gray-200 text-gray-700",
};

const STATUS_OPTIONS = [
  "new",
  "reviewing",
  "interviewed",
  "offered",
  "hired",
  "rejected",
  "withdrawn",
];

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterJob, setFilterJob] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs/applications");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data.applications) setApps(data.applications);
      else setError(data.error || "Could not load");
    } catch {
      setError("Could not load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const jobs = useMemo(
    () => Array.from(new Map(apps.map((a) => [a.job_id, a.job_postings])).entries()),
    [apps]
  );

  const filtered = useMemo(
    () =>
      apps.filter((a) => {
        if (filterJob !== "all" && a.job_id !== filterJob) return false;
        if (filterStatus !== "all" && a.status !== filterStatus) return false;
        return true;
      }),
    [apps, filterJob, filterStatus]
  );

  const updateStatus = async (id: string, status: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const res = await fetch(`/api/admin/jobs/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      // revert
      load();
    }
  };

  const downloadResume = async (id: string) => {
    const res = await fetch(`/api/admin/jobs/applications/${id}/resume`);
    if (!res.ok) {
      alert("Could not generate resume link.");
      return;
    }
    const data = await res.json();
    window.open(data.url, "_blank", "noopener,noreferrer");
  };

  const removeApp = async (id: string) => {
    if (!confirm("Delete this application? This also removes the resume file.")) return;
    const res = await fetch(`/api/admin/jobs/applications/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Could not delete.");
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-bright">
            Job applications
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            {filtered.length} of {apps.length}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/jobs" className="btn btn-outline">
            Manage jobs
          </Link>
        </div>
      </div>

      <div className="card p-4 mb-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-body-xs uppercase tracking-wider text-text-muted">
          Job
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="mt-1 form-input min-w-[220px]"
          >
            <option value="all">All jobs</option>
            {jobs.map(([id, j]) =>
              j ? (
                <option key={id} value={id}>
                  {j.title}
                </option>
              ) : null
            )}
          </select>
        </label>
        <label className="flex flex-col text-body-xs uppercase tracking-wider text-text-muted">
          Status
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 form-input min-w-[180px]"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button onClick={load} className="btn btn-outline ml-auto" disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loading && apps.length === 0 ? (
        <p className="text-body-md text-text-muted">Loading…</p>
      ) : error ? (
        <p className="text-body-md text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-body-md text-text-muted">No applications match those filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="bg-base-tint border-b border-stroke-muted">
                <tr className="text-left">
                  <Th>Candidate</Th>
                  <Th>Role</Th>
                  <Th>Resume</Th>
                  <Th>Status</Th>
                  <Th>Notified</Th>
                  <Th>Received</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-stroke-muted last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-bright">{app.full_name}</div>
                      <div className="text-body-xs text-text-muted">
                        <a href={`mailto:${app.email}`} className="hover:underline">
                          {app.email}
                        </a>
                        {app.phone ? <span className="ml-2">· {app.phone}</span> : null}
                      </div>
                      {app.linkedin_url ? (
                        <a
                          href={app.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-body-xs text-accent hover:underline"
                        >
                          LinkedIn ↗
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {app.job_postings?.title ?? "—"}
                      <div className="text-body-xs">
                        {app.job_postings?.department} · {app.job_postings?.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => downloadResume(app.id)}
                        className="text-accent hover:underline"
                      >
                        {app.resume_filename}
                      </button>
                      <div className="text-body-xs text-text-muted">
                        {(app.resume_size_bytes / 1024).toFixed(0)} KB
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`form-input py-1 px-2 text-body-xs font-medium ${statusColors[app.status] || ""}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-body-xs text-text-muted">
                      {app.notified_at ? "✓" : "—"}
                    </td>
                    <td className="px-4 py-3 text-body-xs text-text-muted">
                      {new Date(app.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeApp(app.id)}
                        className="text-body-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 font-semibold text-text-bright text-body-xs uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}
