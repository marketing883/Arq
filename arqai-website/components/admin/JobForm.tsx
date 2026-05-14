"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type JobFormValues = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  short_description: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salary_range: string;
  experience_level: string;
  remote: boolean;
  status: string;
};

const DEFAULTS: JobFormValues = {
  slug: "",
  title: "",
  department: "Engineering",
  location: "Remote",
  employment_type: "full-time",
  short_description: "",
  description: "",
  requirements: "",
  responsibilities: "",
  salary_range: "",
  experience_level: "",
  remote: true,
  status: "draft",
};

const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];
const experienceLevels = [
  { value: "", label: "Any" },
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "principal", label: "Principal" },
];
const statuses = [
  { value: "draft", label: "Draft (hidden)" },
  { value: "active", label: "Active (published)" },
  { value: "closed", label: "Closed" },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function JobForm({
  mode,
  jobId,
  initial,
}: {
  mode: "create" | "edit";
  jobId?: string;
  initial?: Partial<JobFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>({ ...DEFAULTS, ...(initial || {}) });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const onTitleBlur = () => {
    if (mode === "create" && !values.slug && values.title) {
      update("slug", slugify(values.title));
    }
  };

  const buildPayload = () => {
    const payload: Record<string, string | boolean | null> = {
      slug: values.slug.trim(),
      title: values.title.trim(),
      department: values.department.trim(),
      location: values.location.trim(),
      employment_type: values.employment_type,
      remote: values.remote,
      status: values.status,
    };

    const nullableFields = {
      short_description: values.short_description.trim(),
      description: values.description.trim(),
      requirements: values.requirements.trim(),
      responsibilities: values.responsibilities.trim(),
      salary_range: values.salary_range.trim(),
      experience_level: values.experience_level,
    };

    for (const [key, value] of Object.entries(nullableFields)) {
      if (value) {
        payload[key] = value;
      } else if (mode === "edit") {
        payload[key] = null;
      }
    }

    return payload;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = mode === "create" ? "/api/admin/jobs" : `/api/admin/jobs/${jobId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Could not save");
        return;
      }
      router.push("/admin/jobs");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!jobId) return;
    if (!confirm("Delete this job posting? Existing applications will also be removed.")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Could not delete");
        return;
      }
      router.push("/admin/jobs");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" required>
          <input
            type="text"
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            onBlur={onTitleBlur}
            className="form-input"
          />
        </Field>
        <Field label="Slug" required hint="lowercase, hyphens only">
          <input
            type="text"
            required
            value={values.slug}
            onChange={(e) => update("slug", e.target.value.toLowerCase())}
            pattern="[a-z0-9-]+"
            className="form-input font-mono text-body-sm"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Department" required>
          <input
            type="text"
            required
            value={values.department}
            onChange={(e) => update("department", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Location" required>
          <input
            type="text"
            required
            value={values.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Remote, US / New York / Hyderabad"
            className="form-input"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Employment type" required>
          <select
            value={values.employment_type}
            onChange={(e) => update("employment_type", e.target.value)}
            className="form-input"
          >
            {employmentTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Experience level">
          <select
            value={values.experience_level}
            onChange={(e) => update("experience_level", e.target.value)}
            className="form-input"
          >
            {experienceLevels.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Salary range" hint="optional, free text">
          <input
            type="text"
            value={values.salary_range}
            onChange={(e) => update("salary_range", e.target.value)}
            placeholder="e.g. $120k-$160k"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="Short description" hint="One-line summary; shown on the listing">
        <input
          type="text"
          maxLength={280}
          value={values.short_description}
          onChange={(e) => update("short_description", e.target.value)}
          className="form-input"
        />
      </Field>

      <Field label="About the role" hint="Plain text or bullet list (lines starting with -)">
        <textarea
          rows={5}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="form-input resize-y"
        />
      </Field>

      <Field label="What you'll do (responsibilities)">
        <textarea
          rows={5}
          value={values.responsibilities}
          onChange={(e) => update("responsibilities", e.target.value)}
          className="form-input resize-y"
        />
      </Field>

      <Field label="What we're looking for (requirements)">
        <textarea
          rows={5}
          value={values.requirements}
          onChange={(e) => update("requirements", e.target.value)}
          className="form-input resize-y"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <Field label="Status">
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value)}
            className="form-input"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <label className="flex items-center gap-2 pb-2.5 text-body-sm">
          <input
            type="checkbox"
            checked={values.remote}
            onChange={(e) => update("remote", e.target.checked)}
            className="w-4 h-4"
          />
          Remote-friendly
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="btn bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "create" ? "Create job" : "Save changes"}
        </button>
        <Link href="/admin/jobs" className="btn btn-outline">
          Cancel
        </Link>
        {mode === "edit" && jobId && (
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="ml-auto btn border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete job"}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-body-sm font-medium text-text-bright mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
      {hint && <span className="block mt-1 text-body-xs text-text-muted">{hint}</span>}
    </label>
  );
}
