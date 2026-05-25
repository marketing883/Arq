"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  resolve,
  configToQuery,
  configToHumanBrief,
  INDUSTRY_LABEL,
  WORKFLOW_LABEL,
  APPROACH_LABEL,
  DEPLOYMENT_LABEL,
  SENSITIVITY_LABEL,
  HORIZON_LABEL,
  type Config,
  type Industry,
  type Workflow,
  type Approach,
  type Deployment,
  type Sensitivity,
  type Horizon,
  type ResolverResult,
} from "./resolver";

const INDUSTRY_OPTIONS: Industry[] = [
  "healthcare-payer",
  "insurance-carrier",
  "banking",
  "retail",
  "telecom",
  "manufacturing",
  "enterprise-it",
  "cybersecurity",
  "other",
];

const WORKFLOW_OPTIONS: Workflow[] = [
  "claims",
  "fraud-aml",
  "loyalty",
  "network-ops",
  "supply-chain",
  "service-ops",
  "security-ops",
  "knowledge",
];

const DEPLOYMENT_OPTIONS: Deployment[] = ["our-cloud", "your-cloud", "on-prem"];
const SENSITIVITY_OPTIONS: Sensitivity[] = ["public", "regulated", "restricted"];
const HORIZON_OPTIONS: Horizon[] = ["weeks", "quarter", "multi-quarter"];

type KnobProps<T extends string> = {
  label: string;
  value: T;
  options: T[];
  optionLabels: Record<T, string>;
  onChange: (v: T) => void;
};

function Knob<T extends string>({ label, value, options, optionLabels, onChange }: KnobProps<T>) {
  const idx = options.indexOf(value);
  const step = 360 / options.length;
  const angle = idx * step;

  const cycle = (dir: 1 | -1) => {
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next]);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      cycle(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      cycle(-1);
    }
  };

  return (
    <div className="v4-knob-wrap">
      <div className="v4-section-label">{label}</div>
      <div
        className="v4-knob"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuetext={optionLabels[value]}
        aria-valuemin={0}
        aria-valuemax={options.length - 1}
        aria-valuenow={idx}
        onClick={() => cycle(1)}
        onKeyDown={onKey}
      >
        <div className="v4-knob-indicator" style={{ transform: `translateX(-50%) rotate(${angle}deg)`, transformOrigin: "1.5px 38px" }} />
      </div>
      <div className="v4-knob-ticks">
        {options.map((_, i) => (
          <div
            key={i}
            className={`v4-knob-tick ${i === idx ? "active" : ""}`}
            style={{ transform: `translateX(-50%) rotate(${i * step}deg)` }}
          />
        ))}
      </div>
      <div className="v4-knob-pos">{optionLabels[value]}</div>
    </div>
  );
}

function SegmentKnob<T extends string>(props: KnobProps<T>) {
  // Simpler 3-position rotary using buttons stacked horizontally.
  // Used for deployment / sensitivity / horizon (3 options each).
  const { label, value, options, optionLabels, onChange } = props;
  return (
    <div className="v4-section">
      <div className="v4-section-label">{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 4 }}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "10px 6px",
              background:
                value === o
                  ? "linear-gradient(180deg, rgba(176, 138, 77, 0.3), rgba(176, 138, 77, 0.1))"
                  : "linear-gradient(180deg, #0c0907, #1a140f)",
              color: value === o ? "#f0e2c4" : "rgba(233, 220, 194, 0.55)",
              border: "1px solid #000",
              borderRadius: 3,
              cursor: "pointer",
              boxShadow:
                value === o
                  ? "inset 0 1px 0 rgba(255,255,255,0.15), 0 0 8px rgba(176,138,77,0.35)"
                  : "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.6)",
              transition: "background 0.12s",
            }}
          >
            {optionLabels[o]}
          </button>
        ))}
      </div>
    </div>
  );
}

type SliderProps = {
  label: string;
  value: Approach;
  onChange: (v: Approach) => void;
};

function ApproachSlider({ label, value, onChange }: SliderProps) {
  const options: Approach[] = ["accelerator", "hybrid", "bespoke"];
  const idx = options.indexOf(value);
  const pct = (idx / (options.length - 1)) * 100;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      if (idx < options.length - 1) onChange(options[idx + 1]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      if (idx > 0) onChange(options[idx - 1]);
    }
  };

  return (
    <div className="v4-section">
      <div className="v4-section-label">{label}</div>
      <div
        className="v4-slider"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={options.length - 1}
        aria-valuenow={idx}
        aria-valuetext={APPROACH_LABEL[value]}
        onKeyDown={onKey}
      >
        <div className="v4-slider-track">
          <div className="v4-slider-fill" style={{ width: `${pct}%` }} />
          <div className="v4-slider-thumb" style={{ left: `${pct}%` }} />
        </div>
        <div className="v4-slider-labels">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              aria-label={`Set approach to ${APPROACH_LABEL[o]}`}
              className={value === o ? "active" : ""}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "inherit", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}
            >
              {APPROACH_LABEL[o].split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type ToggleBankProps = {
  label: string;
  values: Workflow[];
  onToggle: (w: Workflow) => void;
};

function WorkflowToggles({ label, values, onToggle }: ToggleBankProps) {
  return (
    <div className="v4-section">
      <div className="v4-section-label">{label}</div>
      <div className="v4-toggles">
        {WORKFLOW_OPTIONS.map((w) => {
          const on = values.includes(w);
          return (
            <button
              key={w}
              type="button"
              className={`v4-toggle ${on ? "is-on" : ""}`}
              aria-pressed={on}
              onClick={() => onToggle(w)}
            >
              <span className="v4-toggle-led" />
              <span className="v4-toggle-label">{WORKFLOW_LABEL[w]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ScreenProps = {
  result: ResolverResult;
  flicker: boolean;
  onOpen: () => void;
  onTake: () => void;
};

function Screen({ result, flicker, onOpen, onTake }: ScreenProps) {
  const tier = result.tier;
  const name = result.kind === "accelerator" ? result.accelerator.name : "Bespoke build";
  const cat = result.kind === "accelerator" ? result.accelerator.category : "Custom engineering engagement";
  const tag = result.kind === "accelerator" ? result.accelerator.tagline : result.summary;

  return (
    <div className={`v4-screen ${flicker ? "is-flicker" : ""}`} aria-live="polite">
      <div className="v4-screen-static" aria-hidden="true" />
      <div className="v4-screen-inner">
        <div className="v4-screen-line">
          <span>ARQAI · MATCH ENGINE</span>
          <span>OK</span>
        </div>
        <div className={`v4-screen-tier tier-${tier}`}>
          {tier === 1 ? "Exact match" : tier === 2 ? "Close fit" : "Bespoke"}
        </div>
        <div className="v4-screen-name">{name}</div>
        <div className="v4-screen-cat">{cat}</div>
        <div className="v4-screen-tag">{tag}</div>
        <div className="v4-screen-shape">{result.shape}</div>
        <div className="v4-screen-services">
          {result.services.map((s) => (
            <span key={s.slug} className="v4-screen-service">{s.short}</span>
          ))}
        </div>
        <div className="v4-screen-actions">
          <button type="button" className="v4-screen-btn" onClick={onOpen}>
            Open detail
          </button>
          <button type="button" className="v4-screen-btn secondary" onClick={onTake}>
            Take to a call →
          </button>
        </div>
      </div>
    </div>
  );
}

type ModalProps = {
  result: ResolverResult;
  config: Config;
  onClose: () => void;
};

function ResultModal({ result, config, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const tier = result.tier;
  const name = result.kind === "accelerator" ? result.accelerator.name : "Bespoke build";
  const cat = result.kind === "accelerator" ? result.accelerator.category : "Custom engineering engagement";
  const query = configToQuery(config);
  const detailHref = result.kind === "accelerator" ? result.accelerator.href : `/services/agentic-ai-buildout`;

  return (
    <div className="v4-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="v4-modal" role="dialog" aria-modal="true" aria-labelledby="v4-modal-title">
        <button className="v4-modal-close" onClick={onClose} aria-label="Close">×</button>
        <span className={`v4-modal-tier tier-${tier}`}>
          {tier === 1 ? "Exact match" : tier === 2 ? "Close fit" : "Bespoke build"}
        </span>
        <h3 id="v4-modal-title">{name}</h3>
        <p className="cat">{cat}</p>
        <p className="lede">{result.summary}</p>

        <div className="v4-modal-config">
          <div className="v4-modal-config-title">Your configuration</div>
          <div className="v4-modal-config-row"><span className="k">Industry</span><span>{INDUSTRY_LABEL[config.industry]}</span></div>
          <div className="v4-modal-config-row"><span className="k">Workflows</span><span>{config.workflows.length ? config.workflows.map((w) => WORKFLOW_LABEL[w]).join(", ") : "—"}</span></div>
          <div className="v4-modal-config-row"><span className="k">Approach</span><span>{APPROACH_LABEL[config.approach]}</span></div>
          <div className="v4-modal-config-row"><span className="k">Deployment</span><span>{DEPLOYMENT_LABEL[config.deployment]}</span></div>
          <div className="v4-modal-config-row"><span className="k">Sensitivity</span><span>{SENSITIVITY_LABEL[config.sensitivity]}</span></div>
          <div className="v4-modal-config-row"><span className="k">Horizon</span><span>{HORIZON_LABEL[config.horizon]}</span></div>
          <div className="v4-modal-config-row"><span className="k">Shape</span><span>{result.shape}</span></div>
        </div>

        <div className="v4-modal-config-title" style={{ marginTop: 18, color: "var(--brass)" }}>Services involved</div>
        <div className="v4-modal-services-grid">
          {result.services.map((s) => (
            <div key={s.slug} className="v4-modal-service">
              <div className="n">{s.full}</div>
              <div className="b">{s.blurb}</div>
            </div>
          ))}
        </div>

        <div className="v4-modal-actions">
          <Link href={`/demo?${query}`} className="a-btn a-btn-primary">
            Take this to a call
          </Link>
          {result.kind === "accelerator" && (
            <Link href={detailHref} className="a-btn a-btn-ghost">
              See {name} in full
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CONFIG: Config = {
  industry: "healthcare-payer",
  workflows: ["claims"],
  approach: "accelerator",
  deployment: "your-cloud",
  sensitivity: "regulated",
  horizon: "quarter",
};

export default function ControlPanel() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [flicker, setFlicker] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const flickerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = useMemo(() => resolve(config), [config]);

  const triggerFlicker = useCallback(() => {
    setFlicker(true);
    if (flickerTimer.current) clearTimeout(flickerTimer.current);
    flickerTimer.current = setTimeout(() => setFlicker(false), 220);
  }, []);

  const update = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    triggerFlicker();
  }, [triggerFlicker]);

  const toggleWorkflow = useCallback((w: Workflow) => {
    setConfig((prev) => {
      const has = prev.workflows.includes(w);
      const next = has ? prev.workflows.filter((x) => x !== w) : [...prev.workflows, w];
      return { ...prev, workflows: next.length ? next : [w] };
    });
    triggerFlicker();
  }, [triggerFlicker]);

  useEffect(() => () => { if (flickerTimer.current) clearTimeout(flickerTimer.current); }, []);

  const takeToCall = () => {
    const query = configToQuery(config);
    window.location.href = `/demo?${query}`;
  };

  return (
    <div className="v4-stage">
      <div className="v4-wrap">
        <div className="v4-plate">
          <div className="v4-plate-logo">
            <span className="dot" />
            ArqAI Labs · Match Console · MK-IV
          </div>
        </div>

        <h1 className="v4-title">
          Configure your operation.<br />
          We <em>resolve</em> the fit.
        </h1>
        <p className="v4-sub">
          Turn the dials. Flip the switches. The screen tells you what we&apos;d build.
        </p>

        <div className="v4-panel">
          <div className="v4-panel-body">
            {/* Left column */}
            <div className="v4-col">
              <div className="v4-section">
                <Knob
                  label="Industry"
                  value={config.industry}
                  options={INDUSTRY_OPTIONS}
                  optionLabels={INDUSTRY_LABEL}
                  onChange={(v) => update("industry", v)}
                />
              </div>
              <SegmentKnob
                label="Deployment"
                value={config.deployment}
                options={DEPLOYMENT_OPTIONS}
                optionLabels={DEPLOYMENT_LABEL}
                onChange={(v) => update("deployment", v)}
              />
              <SegmentKnob
                label="Data sensitivity"
                value={config.sensitivity}
                options={SENSITIVITY_OPTIONS}
                optionLabels={SENSITIVITY_LABEL}
                onChange={(v) => update("sensitivity", v)}
              />
            </div>

            {/* Center: screen */}
            <Screen
              result={result}
              flicker={flicker}
              onOpen={() => setModalOpen(true)}
              onTake={takeToCall}
            />

            {/* Right column */}
            <div className="v4-col">
              <WorkflowToggles
                label="Workflows"
                values={config.workflows}
                onToggle={toggleWorkflow}
              />
              <ApproachSlider
                label="Approach"
                value={config.approach}
                onChange={(v) => update("approach", v)}
              />
              <SegmentKnob
                label="Time horizon"
                value={config.horizon}
                options={HORIZON_OPTIONS}
                optionLabels={HORIZON_LABEL}
                onChange={(v) => update("horizon", v)}
              />
            </div>
          </div>
        </div>

        <div className="v4-skip">
          <a href="#next">↓ Skip the panel</a>
        </div>

        {/* sr-only configuration brief */}
        <div className="v4-sr">{configToHumanBrief(config)}</div>
      </div>

      {modalOpen && (
        <ResultModal result={result} config={config} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
