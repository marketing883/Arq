type SupabaseErrorLike = {
  message?: string;
  details?: string | null;
  hint?: string | null;
  code?: string;
};

export const OPTIONAL_JOB_POSTING_COLUMNS = [
  "short_description",
  "description",
  "requirements",
  "responsibilities",
  "salary_range",
  "experience_level",
] as const;

export const PUBLIC_JOB_STATUSES = ["active", "published"] as const;

const OPTIONAL_JOB_POSTING_COLUMN_SET = new Set<string>(OPTIONAL_JOB_POSTING_COLUMNS);
const PUBLIC_JOB_STATUS_SET = new Set<string>(PUBLIC_JOB_STATUSES);

export function isPublicJobStatus(status: unknown) {
  return typeof status === "string" && PUBLIC_JOB_STATUS_SET.has(status);
}

export function pruneEmptyOptionalJobPostingFields(payload: Record<string, unknown>) {
  const next = { ...payload };

  for (const column of OPTIONAL_JOB_POSTING_COLUMNS) {
    if (next[column] === null || next[column] === undefined || next[column] === "") {
      delete next[column];
    }
  }

  return next;
}

export function getMissingSchemaColumn(error: SupabaseErrorLike | null | undefined) {
  if (!error) return null;

  const text = [error.message, error.details, error.hint].filter(Boolean).join(" ");
  const match = text.match(/'([^']+)'\s+column/i) ?? text.match(/column\s+'([^']+)'/i);

  return match?.[1] ?? null;
}

export function getCheckConstraint(error: SupabaseErrorLike | null | undefined) {
  if (!error || error.code !== "23514") return null;

  const text = [error.message, error.details, error.hint].filter(Boolean).join(" ");
  const match = text.match(/violates check constraint "([^"]+)"/i);

  return match?.[1] ?? null;
}

export function isOptionalJobPostingColumn(column: string | null) {
  return !!column && OPTIONAL_JOB_POSTING_COLUMN_SET.has(column);
}

export function jobPostingSchemaDriftMessage(column: string | null) {
  if (!column) {
    return "Careers database schema is out of sync. Run the careers schema migration in Supabase.";
  }

  return `Careers database is missing the '${column}' column. Run supabase-careers-existing-table-migration.sql in Supabase, then retry.`;
}

export function jobPostingConstraintMessage(constraint: string | null) {
  if (constraint === "job_postings_status_check") {
    return "Careers database still has a legacy job status constraint. Run the latest supabase-careers-existing-table-migration.sql in Supabase, then retry.";
  }

  return null;
}

export async function executeJobPostingMutationWithSchemaFallback<T>(
  payload: Record<string, unknown>,
  execute: (
    payload: Record<string, unknown>
  ) => PromiseLike<{ data: T | null; error: SupabaseErrorLike | null }>
) {
  let currentPayload = { ...payload };
  let lastResult: { data: T | null; error: SupabaseErrorLike | null } | null = null;
  const omittedColumns: string[] = [];

  for (let attempt = 0; attempt <= OPTIONAL_JOB_POSTING_COLUMNS.length; attempt += 1) {
    lastResult = await execute(currentPayload);
    if (!lastResult.error) {
      return { ...lastResult, omittedColumns };
    }

    const missingColumn = getMissingSchemaColumn(lastResult.error);
    if (
      !isOptionalJobPostingColumn(missingColumn) ||
      !missingColumn ||
      !(missingColumn in currentPayload)
    ) {
      return { ...lastResult, omittedColumns };
    }

    omittedColumns.push(missingColumn);
    const { [missingColumn]: _omitted, ...rest } = currentPayload;
    currentPayload = rest;
  }

  return {
    data: lastResult?.data ?? null,
    error: lastResult?.error ?? null,
    omittedColumns,
  };
}
