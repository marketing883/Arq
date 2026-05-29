"use client";

import Link from "next/link";
import { JobForm } from "@/components/admin/JobForm";

export default function AdminJobNewPage() {
  return (
    <div className="p-6 md:p-10">
      <Link
        href="/admin/jobs"
        className="inline-flex items-center gap-2 text-body-sm text-accent hover:underline mb-4"
      >
        &larr; All jobs
      </Link>
      <h1 className="text-2xl font-display font-semibold text-text-bright mb-6">
        New job posting
      </h1>
      <JobForm mode="create" />
    </div>
  );
}
