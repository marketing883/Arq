"use client";

import { useState } from "react";
import { QUESTIONS, SURVEY_TITLE, SURVEY_INTRO, type SurveyQuestion } from "./questions";
import { trackSurveySubmit } from "@/lib/analytics/gtm-events";
import "./survey.css";

type Answers = {
  respondent_name: string;
  respondent_email: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string[];
  q7: string;
};

const EMPTY: Answers = {
  respondent_name: "",
  respondent_email: "",
  q1: "", q2: "", q3: "", q4: "", q5: "",
  q6: [],
  q7: "",
};

function getRequiredMissing(answers: Answers): string[] {
  const missing: string[] = [];
  if (!answers.respondent_name.trim()) missing.push("Your name");
  for (const q of QUESTIONS) {
    if (!q.required) continue;
    const v = answers[q.id as keyof Answers];
    if (!v || (typeof v === "string" && !v.trim())) missing.push(q.id);
  }
  return missing;
}

function SingleQuestion({ q, value, onChange }: {
  q: Extract<SurveyQuestion, { type: "single" | "scale" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="srv-options">
      {q.options.map((opt) => (
        <label key={opt.value} className={`srv-option ${value === opt.value ? "selected" : ""}`}>
          <input
            type="radio"
            name={q.id}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className="srv-option-check" />
          <span className="srv-option-label">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function MultiQuestion({ q, value, onChange }: {
  q: Extract<SurveyQuestion, { type: "multi" }>;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else if (value.length < q.max) {
      onChange([...value, v]);
    }
  };
  return (
    <div className="srv-options">
      {q.options.map((opt) => {
        const checked = value.includes(opt.value);
        const disabled = !checked && value.length >= q.max;
        return (
          <label key={opt.value} className={`srv-option ${checked ? "selected" : ""} ${disabled ? "disabled" : ""}`}>
            <input
              type="checkbox"
              value={opt.value}
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(opt.value)}
            />
            <span className="srv-option-check" />
            <span className="srv-option-label">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function NamingSurveyPage() {
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  function setField(field: keyof Answers, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const missing = getRequiredMissing(answers);
    if (missing.length > 0) {
      setValidationError("Please answer all required questions before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/survey/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          q5: answers.q5 ? Number(answers.q5) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
      trackSurveySubmit({ survey_name: "accelerator_naming" });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="srv-shell">
        <div className="srv-card srv-thanks">
          <div className="srv-thanks-icon">✓</div>
          <h1 className="srv-thanks-title">Thank you, {answers.respondent_name.split(" ")[0]}.</h1>
          <p className="srv-thanks-body">
            Your input has been recorded. Leadership will review all responses before the go-to-market launch.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="srv-shell">
      <div className="srv-card">
        <div className="srv-header">
          <div className="srv-logo">
            <img src="/img/arq-ai-logo-white.svg" alt="ArqAI Labs" width={96} height={28} />
          </div>
          <h1 className="srv-title">{SURVEY_TITLE}</h1>
          <p className="srv-intro">{SURVEY_INTRO}</p>
          <p className="srv-note">
            <span className="srv-req">*</span> Required — takes about 2 minutes
          </p>
        </div>

        <form className="srv-form" onSubmit={handleSubmit} noValidate>
          {/* Respondent identity */}
          <div className="srv-field-group">
            <label className="srv-label" htmlFor="respondent_name">
              Your name <span className="srv-req">*</span>
            </label>
            <input
              id="respondent_name"
              type="text"
              className="srv-input"
              placeholder="First and last name"
              value={answers.respondent_name}
              onChange={(e) => setField("respondent_name", e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="srv-field-group">
            <label className="srv-label" htmlFor="respondent_email">
              Work email <span className="srv-opt">(optional)</span>
            </label>
            <input
              id="respondent_email"
              type="email"
              className="srv-input"
              placeholder="you@company.com"
              value={answers.respondent_email}
              onChange={(e) => setField("respondent_email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <hr className="srv-divider" />

          {/* Survey questions */}
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="srv-question">
              <p className="srv-q-label">
                <span className="srv-q-num">{idx + 1}.</span>
                {q.text}
                {q.required ? <span className="srv-req"> *</span> : null}
                {q.type === "multi" ? (
                  <span className="srv-q-hint"> Select up to {q.max}.</span>
                ) : null}
              </p>

              {q.type === "single" || q.type === "scale" ? (
                <SingleQuestion
                  q={q}
                  value={answers[q.id as keyof Answers] as string}
                  onChange={(v) => setField(q.id as keyof Answers, v)}
                />
              ) : q.type === "multi" ? (
                <MultiQuestion
                  q={q}
                  value={answers.q6}
                  onChange={(v) => setField("q6", v)}
                />
              ) : (
                <textarea
                  className="srv-textarea"
                  rows={4}
                  placeholder="Your thoughts here…"
                  value={answers.q7}
                  onChange={(e) => setField("q7", e.target.value)}
                />
              )}
            </div>
          ))}

          {(validationError || error) && (
            <p className="srv-error">{validationError || error}</p>
          )}

          <button type="submit" className="srv-submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit response"}
          </button>

          <p className="srv-footer-note">
            Responses are confidential and used solely by ArqAI Labs leadership to inform the go-to-market naming decision.
          </p>
        </form>
      </div>
    </div>
  );
}
