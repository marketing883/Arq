"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  status: string;
  remote: boolean;
  published_at: string | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-200 text-gray-800",
  active: "bg-green-100 text-green-700",
  closed: "bg-amber-100 text-amber-700",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/jobs")
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!active || !data) return;
        if (data.jobs) setJobs(data.jobs);
        else setError(data.error || "Could not load");
      })
      .catch(() => active && setError("Could not load"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const deleteJob = async (job: Job) => {
    const label = job.status === "active" ? "published job opening" : "job opening";
    if (!confirm(`Delete this ${label}? Existing applications for this role will also be removed.`)) {
      return;
    }

    setDeletingId(job.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error || "Could not delete job opening");
        return;
      }
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch {
      setError("Could not delete job opening");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-bright">
            Job postings
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            {jobs.length} {jobs.length === 1 ? "role" : "roles"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/jobs/applications" className="btn btn-outline">
            View applications
          </Link>
          <Link href="/admin/jobs/new" className="btn bg-accent text-white">
            New job
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-body-md text-text-muted">Loading...</p>
      ) : error ? (
        <p className="text-body-md text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-body-md text-text-muted mb-4">
            No job postings yet.
          </p>
          <Link href="/admin/jobs/new" className="btn bg-accent text-white">
            Create your first job
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="bg-base-tint border-b border-stroke-muted">
                <tr className="text-left">
                  <Th>Role</Th>
                  <Th>Department</Th>
                  <Th>Location</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-stroke-muted last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-bright">{job.title}</div>
                      <div className="text-body-xs text-text-muted font-mono">/{job.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{job.department}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {job.location}
                      {job.remote && (
                        <span className="ml-2 text-body-xs text-accent">remote</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{job.employment_type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[job.status] || "bg-gray-100"}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="text-accent hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/careers/${job.slug}`}
                          target="_blank"
                          className="text-text-muted hover:text-accent"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteJob(job)}
                          disabled={deletingId === job.id}
                          className="text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === job.id ? "Deleting..." : "Delete"}
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
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-semibold text-text-bright text-body-xs uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}
