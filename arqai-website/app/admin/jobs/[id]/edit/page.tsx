"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { JobForm } from "@/components/admin/JobForm";

type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  short_description: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  salary_range: string | null;
  experience_level: string | null;
  remote: boolean;
  status: string;
};

export default function AdminJobEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/jobs/${id}`)
      .then(async (r) => {
        if (r.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!active || !data) return;
        if (data.job) setJob(data.job);
        else setError(data.error || "Not found");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="p-6 md:p-10">
      <Link
        href="/admin/jobs"
        className="inline-flex items-center gap-2 text-body-sm text-accent hover:underline mb-4"
      >
        &larr; All jobs
      </Link>
      <h1 className="text-2xl font-display font-semibold text-text-bright mb-6">
        Edit job posting
      </h1>
      {loading ? (
        <p className="text-body-md text-text-muted">Loading…</p>
      ) : error ? (
        <p className="text-body-md text-red-600">{error}</p>
      ) : job ? (
        <JobForm
          mode="edit"
          jobId={job.id}
          initial={{
            slug: job.slug,
            title: job.title,
            department: job.department,
            location: job.location,
            employment_type: job.employment_type,
            short_description: job.short_description ?? "",
            description: job.description ?? "",
            requirements: job.requirements ?? "",
            responsibilities: job.responsibilities ?? "",
            salary_range: job.salary_range ?? "",
            experience_level: job.experience_level ?? "",
            remote: job.remote,
            status: job.status,
          }}
        />
      ) : null}
    </div>
  );
}
