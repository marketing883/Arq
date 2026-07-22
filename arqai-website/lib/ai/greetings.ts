// Chat widget greetings, per page. Kept separate from knowledge-base.ts so
// the client bundle ships only these strings, not the full system prompt.

export const GREETING_MESSAGES: Record<string, string> = {
  "/": "Hi. We embed AI engineers in enterprise operations and ship production AI with proof on every action. What workflow are you trying to get better?",
  "/platform": "Hi. Want the short version of how the operating fabric turns AI output into governed workflow execution?",
  "/resources": "Hi. Are you looking for a guide, a case story, or a practical point of view?",
  "/use-cases": "Hi. Anything in the grid match what your team is trying to do?",
  "/how-we-work": "Hi. Want me to walk you through how an engagement actually runs?",
  "/accelerators": "Hi. Ten accelerators, each with a fixed two-week fit check. Which workflow are you trying to speed up?",
  "/services": "Hi. Strategy, buildout, integration, governance, acceleration, or managed operations. Which fits what you need?",
  "/industries": "Hi. Which industry are you in?",
  "/industries/healthcare-payers": "Hi. Which payer workflow is the priority: FWA, claims, prior auth, UM?",
  "/industries/insurance-carriers": "Hi. Triage, fraud, underwriting, or FNOL?",
  "/industries/banking": "Hi. Underwriting, KYC, AML, or reporting: what is the team most stuck on?",
  "/industries/retail": "Hi. Loyalty, pricing, inventory, or store ops?",
  "/industries/manufacturing": "Hi. Supplier risk, forecasting, quality, or maintenance?",
  "/trust": "Hi. Want me to share the trust posture or pull a control document under NDA?",
  "/about": "Hi. Want to know more about the team or our partnership with ACI Infotech?",
  "/engage-us": "Hi. The form is short, mostly clicks. Anything you want to know before you send it?",
  "/contact": "Hi. The form is short, mostly clicks. Anything you want to know before you send it?",
  default:
    "Hi. We embed AI engineers in enterprise operations and ship production AI with proof on every action. What workflow are you trying to get better?",
};

const ACCELERATOR_GREETINGS: Record<string, string> = {
  arqfwa: "Hi. Questions about ArqFWA: claims volume fit, integration, or how the two-week Blind Spot Assessment works?",
  arqloyalty: "Hi. Questions about ArqLoyalty: the shadow run, parity proof, or how cut-over works without migration risk?",
  arqlogistics: "Hi. Questions about ArqLogistics: supplier coverage, tier-2/3 visibility, or the Supplier Risk Blind Spot Audit?",
  arqbanker: "Hi. Questions about ArqBanker: underwriting, KYC, AML, or how the explainability holds up with regulators?",
  arqforecast: "Hi. Questions about ArqForecast: the model ensemble, data requirements, or the Forecasting Accuracy Baseline?",
  arqsupport: "Hi. Questions about ArqSupport: auto-resolution rates, your ticketing stack, or the Support Queue Analysis?",
  arqdataq: "Hi. Questions about ArqDataQ: real-time monitoring, auto-remediation, or the Data Quality Baseline Audit?",
  arqvantage: "Hi. Questions about ArqVantage: marketplaces covered, MAP guardrails, or the 30-day Blind Spot Scan?",
  arqsecops: "Hi. Questions about ArqSecOps: your SIEM stack, evidence capture, or the Coverage Gap Assessment?",
  arqeye: "Hi. Questions about ArqEye: lineage, root-cause analysis, or the Observability Maturity Assessment?",
};

/** Greeting for a path: exact match, then detail-page patterns, then default. */
export function resolveGreeting(path: string | undefined | null): string {
  const clean = (path || "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (GREETING_MESSAGES[clean]) return GREETING_MESSAGES[clean];

  const [, section, slug] = clean.split("/");
  if (section === "accelerators" && slug && ACCELERATOR_GREETINGS[slug]) {
    return ACCELERATOR_GREETINGS[slug];
  }
  if (section === "services" && slug) {
    return "Hi. Questions about this service: how it runs, what it needs from your side, or whether it fits your workflow?";
  }
  if (section === "case-studies" && slug) {
    return "Hi. Reading the case study? Happy to talk through how it would map to your operation.";
  }
  return GREETING_MESSAGES.default;
}
