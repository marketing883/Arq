"use client";

import { useEffect, useMemo, useState } from "react";
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

type ApplicationDetail = Application & {
  cover_letter: string | null;
  total_experience: string | null;
  skills: string | null;
  achievements: string | null;
  compensation_currency: string | null;
  compensation_basis: string | null;
  current_compensation: string | null;
  expected_compensation: string | null;
  compensation_negotiable: boolean | null;
  current_ctc?: string | null;
  expected_ctc?: string | null;
  notice_period: string | null;
  notes: string | null;
  ip: string | null;
  user_agent: string | null;
  resume_mime_type: string | null;
  updated_at: string | null;
  job_postings: {
    title: string;
    slug: string;
    department: string;
    location: string;
    employment_type?: string;
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

const compensationCurrencyLabels: Record<string, string> = {
  INR: "INR",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  AED: "AED",
  SGD: "SGD",
  AUD: "AUD",
  CAD: "CAD",
  other: "Other / discuss",
};

const compensationBasisLabels: Record<string, string> = {
  annual: "Annual",
  monthly: "Monthly",
  hourly: "Hourly",
  daily: "Daily",
  project: "Project / milestone",
  stipend: "Stipend",
  other: "Other / discuss",
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "-";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatOption(
  value: string | null | undefined,
  labels: Record<string, string>
) {
  if (!value) return "-";
  return labels[value] || value;
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterJob, setFilterJob] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailNotes, setDetailNotes] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs/applications", { cache: "no-store" });
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
    setSelectedApp((prev) => (prev?.id === id ? { ...prev, status } : prev));
    const res = await fetch(`/api/admin/jobs/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      load();
    }
  };

  const openDetails = async (id: string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/admin/jobs/applications/${id}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.application) {
        setDetailError(data.error || "Could not load application details");
        return;
      }
      setSelectedApp(data.application);
      setDetailNotes(data.application.notes || "");
    } catch {
      setDetailError("Could not load application details");
    } finally {
      setDetailLoading(false);
    }
  };

  const saveDetails = async () => {
    if (!selectedApp) return;
    setSavingDetails(true);
    setDetailError(null);
    try {
      const res = await fetch(`/api/admin/jobs/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedApp.status,
          notes: detailNotes || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.application) {
        setDetailError(data?.error || "Could not save application details");
        return;
      }
      setSelectedApp((prev) =>
        prev
          ? {
              ...prev,
              ...data.application,
              job_postings: prev.job_postings,
            }
          : prev
      );
      setApps((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id ? { ...app, status: data.application.status } : app
        )
      );
    } finally {
      setSavingDetails(false);
    }
  };

  const downloadResume = async (id: string) => {
    const res = await fetch(`/api/admin/jobs/applications/${id}/resume`, { cache: "no-store" });
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
    if (res.ok) {
      setApps((current) => current.filter((app) => app.id !== id));
      if (selectedApp?.id === id) {
        setSelectedApp(null);
        setDetailNotes("");
      }
    } else {
      alert("Could not delete.");
    }
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
          <a
            href="/api/admin/jobs/applications/diagnostics"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            title="Live health check of the application pipeline (schema, storage bucket, row count)"
          >
            Run diagnostics
          </a>
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
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {detailError && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{detailError}</p>
        </div>
      )}

      {loading && apps.length === 0 ? (
        <p className="text-body-md text-text-muted">Loading...</p>
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
                        {app.phone ? <span className="ml-2">| {app.phone}</span> : null}
                      </div>
                      {app.linkedin_url ? (
                        <a
                          href={app.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-body-xs text-accent hover:underline"
                        >
                          LinkedIn
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {app.job_postings?.title ?? "-"}
                      <div className="text-body-xs">
                        {app.job_postings?.department} | {app.job_postings?.location}
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
                        {formatBytes(app.resume_size_bytes)}
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
                      {app.notified_at ? "Yes" : "-"}
                    </td>
                    <td className="px-4 py-3 text-body-xs text-text-muted">
                      {new Date(app.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => openDetails(app.id)}
                          disabled={detailLoading}
                          className="text-body-xs text-accent hover:underline disabled:opacity-50"
                        >
                          View details
                        </button>
                        <button
                          onClick={() => removeApp(app.id)}
                          className="text-body-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApp && (
        <ApplicationDetailsDrawer
          application={selectedApp}
          notes={detailNotes}
          saving={savingDetails}
          onClose={() => {
            setSelectedApp(null);
            setDetailNotes("");
          }}
          onDownload={() => downloadResume(selectedApp.id)}
          onDelete={() => removeApp(selectedApp.id)}
          onNotesChange={setDetailNotes}
          onStatusChange={(status) =>
            setSelectedApp((prev) => (prev ? { ...prev, status } : prev))
          }
          onSave={saveDetails}
        />
      )}
    </div>
  );
}

function ApplicationDetailsDrawer({
  application,
  notes,
  saving,
  onClose,
  onDownload,
  onDelete,
  onNotesChange,
  onStatusChange,
  onSave,
}: {
  application: ApplicationDetail;
  notes: string;
  saving: boolean;
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onNotesChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex justify-end">
      <button className="flex-1 cursor-default" aria-label="Close details" onClick={onClose} />
      <aside className="w-full max-w-3xl h-full bg-base border-l border-stroke-muted shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-base border-b border-stroke-muted px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-body-xs text-accent uppercase tracking-wider mb-1">
              Candidate profile
            </p>
            <h2 className="text-2xl font-display font-semibold text-text-bright">
              {application.full_name}
            </h2>
            <p className="text-body-sm text-text-muted">
              {application.job_postings?.title || "Unknown role"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-stroke-muted text-body-sm text-text-muted hover:text-text-bright"
          >
            Close
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoItem label="Email">
                <a href={`mailto:${application.email}`} className="text-accent hover:underline">
                  {application.email}
                </a>
              </InfoItem>
              <InfoItem label="Phone">{application.phone || "-"}</InfoItem>
              <InfoItem label="LinkedIn">
                {application.linkedin_url ? (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Open profile
                  </a>
                ) : (
                  "-"
                )}
              </InfoItem>
              <InfoItem label="Received">
                {new Date(application.created_at).toLocaleString()}
              </InfoItem>
              <InfoItem label="Experience">{application.total_experience || "-"}</InfoItem>
              <InfoItem label="Notice period">{application.notice_period || "-"}</InfoItem>
              <InfoItem label="Compensation currency">
                {formatOption(application.compensation_currency, compensationCurrencyLabels)}
              </InfoItem>
              <InfoItem label="Pay basis">
                {formatOption(application.compensation_basis, compensationBasisLabels)}
              </InfoItem>
              <InfoItem label="Current compensation">
                {application.current_compensation || application.current_ctc || "Not shared"}
              </InfoItem>
              <InfoItem label="Expected compensation / range">
                {application.expected_compensation || application.expected_ctc || "-"}
              </InfoItem>
              <InfoItem label="Open to compensation discussion">
                {application.compensation_negotiable == null
                  ? "-"
                  : application.compensation_negotiable
                    ? "Yes"
                    : "No"}
              </InfoItem>
            </div>
          </section>

          <section className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-xs uppercase tracking-wider text-text-muted mb-2">
                Status
              </label>
              <select
                value={application.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className={`form-input ${statusColors[application.status] || ""}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="block text-body-xs uppercase tracking-wider text-text-muted mb-2">
                Resume
              </p>
              <button onClick={onDownload} className="btn btn-outline w-full">
                Download {application.resume_filename}
              </button>
              <p className="mt-2 text-body-xs text-text-muted">
                {formatBytes(application.resume_size_bytes)}
                {application.resume_mime_type ? ` | ${application.resume_mime_type}` : ""}
              </p>
            </div>
          </section>

          <DetailBlock title="Primary skills" content={application.skills} />
          <DetailBlock title="Relevant achievements" content={application.achievements} />
          <DetailBlock title="Cover note" content={application.cover_letter} />

          <section>
            <label className="block text-body-xs uppercase tracking-wider text-text-muted mb-2">
              Internal notes
            </label>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add screening notes, interview feedback, or follow-up context. This is admin-only."
              className="form-input resize-y"
            />
          </section>

          <section className="rounded-lg border border-stroke-muted p-4">
            <h3 className="text-body-sm font-semibold text-text-bright mb-3">
              Role and system details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoItem label="Role">{application.job_postings?.title || "-"}</InfoItem>
              <InfoItem label="Department">{application.job_postings?.department || "-"}</InfoItem>
              <InfoItem label="Location">{application.job_postings?.location || "-"}</InfoItem>
              <InfoItem label="Employment">
                {application.job_postings?.employment_type || "-"}
              </InfoItem>
              <InfoItem label="IP">{application.ip || "-"}</InfoItem>
              <InfoItem label="Notification sent">
                {application.notified_at ? new Date(application.notified_at).toLocaleString() : "-"}
              </InfoItem>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-stroke-muted pt-6">
            <button onClick={onSave} disabled={saving} className="btn bg-accent text-white">
              {saving ? "Saving..." : "Save details"}
            </button>
            <button onClick={onDownload} className="btn btn-outline">
              Download resume
            </button>
            <button
              onClick={onDelete}
              className="ml-auto btn border border-red-300 text-red-600 hover:bg-red-50"
            >
              Delete application
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailBlock({ title, content }: { title: string; content: string | null }) {
  return (
    <section>
      <h3 className="text-body-xs uppercase tracking-wider text-text-muted mb-2">
        {title}
      </h3>
      <div className="rounded-lg border border-stroke-muted bg-base-tint p-4">
        <p className="text-body-sm text-text-bright whitespace-pre-line leading-relaxed">
          {content || "-"}
        </p>
      </div>
    </section>
  );
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-stroke-muted p-4">
      <p className="text-body-xs uppercase tracking-wider text-text-muted mb-1">
        {label}
      </p>
      <div className="text-body-sm text-text-bright break-words">{children}</div>
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
