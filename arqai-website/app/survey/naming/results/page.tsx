"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QUESTIONS, RESULTS_KEY, SURVEY_TITLE } from "../questions";
import "../survey.css";

type BreakdownRow = { value: string; label: string; count: number; pct: number };
type ResultsData = {
  total: number;
  breakdown: Record<string, BreakdownRow[]>;
  q5Mean: number | null;
  comments: string[];
  respondents: { name: string; email: string | null; submitted_at: string }[];
};

function BarChart({ rows }: { rows: BreakdownRow[] }) {
  return (
    <div className="srv-chart">
      {rows.map((row) => (
        <div key={row.value} className="srv-bar-row">
          <div className="srv-bar-label">{row.label}</div>
          <div className="srv-bar-track">
            <div className="srv-bar-fill" style={{ width: `${row.pct}%` }} />
          </div>
          <div className="srv-bar-stats">
            <span className="srv-bar-pct">{row.pct}%</span>
            <span className="srv-bar-count">({row.count})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultsInner() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "";
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      setError("Access key required. Add ?key=... to the URL.");
      setLoading(false);
      return;
    }
    fetch(`/api/survey/naming/results?key=${encodeURIComponent(key)}`)
      .then(async (res) => {
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || "Unauthorized");
        }
        return res.json();
      })
      .then((d: ResultsData) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  if (loading) {
    return (
      <div className="srv-shell">
        <div className="srv-card srv-results-loading">
          <div className="srv-spinner" />
          <p>Loading results…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="srv-shell">
        <div className="srv-card srv-thanks">
          <div className="srv-thanks-icon srv-thanks-icon--err">✕</div>
          <h1 className="srv-thanks-title">Access denied</h1>
          <p className="srv-thanks-body">{error || "Invalid key."}</p>
        </div>
      </div>
    );
  }

  const exportUrl = `/api/survey/naming/export?key=${encodeURIComponent(key)}`;

  return (
    <div className="srv-shell srv-results-shell">
      <div className="srv-results-header">
        <div>
          <h1 className="srv-results-title">{SURVEY_TITLE}</h1>
          <p className="srv-results-sub">
            {data.total} response{data.total !== 1 ? "s" : ""} collected
          </p>
        </div>
        <a href={exportUrl} download className="srv-export-btn">
          ↓ Export CSV
        </a>
      </div>

      {data.total === 0 ? (
        <div className="srv-card srv-empty">
          <p>No responses yet. Share the survey link with the sales team.</p>
        </div>
      ) : (
        <>
          {/* Q1–Q4 */}
          {["q1", "q2", "q3", "q4"].map((qid) => {
            const q = QUESTIONS.find((x) => x.id === qid);
            const rows = data.breakdown[qid];
            if (!q || !rows) return null;
            return (
              <div key={qid} className="srv-result-block">
                <h2 className="srv-result-q">{q.text}</h2>
                <BarChart rows={rows} />
              </div>
            );
          })}

          {/* Q5 scale with mean */}
          {(() => {
            const q = QUESTIONS.find((x) => x.id === "q5");
            const rows = data.breakdown["q5"];
            if (!q || !rows) return null;
            return (
              <div className="srv-result-block">
                <h2 className="srv-result-q">{q.text}</h2>
                {data.q5Mean !== null && (
                  <p className="srv-result-mean">
                    Mean score: <strong>{data.q5Mean} / 5</strong>
                  </p>
                )}
                <BarChart rows={rows} />
              </div>
            );
          })()}

          {/* Q6 multi */}
          {(() => {
            const q = QUESTIONS.find((x) => x.id === "q6");
            const rows = data.breakdown["q6"];
            if (!q || !rows) return null;
            return (
              <div className="srv-result-block">
                <h2 className="srv-result-q">{q.text}</h2>
                <p className="srv-result-note">Percentages are out of total respondents (multiple selections allowed).</p>
                <BarChart rows={rows} />
              </div>
            );
          })()}

          {/* Q7 open comments */}
          {data.comments.length > 0 && (
            <div className="srv-result-block">
              <h2 className="srv-result-q">
                {QUESTIONS.find((x) => x.id === "q7")?.text}
              </h2>
              <div className="srv-comments">
                {data.comments.map((c, i) => (
                  <blockquote key={i} className="srv-comment">
                    {c}
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Respondent list */}
          <div className="srv-result-block">
            <h2 className="srv-result-q">Respondents</h2>
            <table className="srv-respondent-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.respondents.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.email || "—"}</td>
                    <td>{new Date(r.submitted_at).toLocaleString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="srv-shell">
        <div className="srv-card srv-results-loading">
          <div className="srv-spinner" />
        </div>
      </div>
    }>
      <ResultsInner />
    </Suspense>
  );
}
