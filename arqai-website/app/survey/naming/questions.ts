// Shared survey definition + access config for the accelerator-naming survey.
// Used by the form page, the results page, and the CSV export.

export const RESULTS_KEY =
  process.env.SURVEY_RESULTS_KEY || "arq-naming-2026-h7k2q9x3";

export type SurveyOption = { value: string; label: string };
export type SurveyQuestion =
  | { id: string; type: "single"; text: string; required: boolean; options: SurveyOption[] }
  | { id: string; type: "scale"; text: string; required: boolean; options: SurveyOption[] }
  | { id: string; type: "multi"; text: string; required: boolean; max: number; options: SurveyOption[] }
  | { id: string; type: "text"; text: string; required: boolean };

export const SURVEY_TITLE = "Accelerator naming — sales input";
export const SURVEY_INTRO =
  "We recently renamed the ArqAI Labs accelerators — ArqFWA is now Veyra, ArqRetail is now Nuvia, ArqBanker is now Sentra, and so on (the old convention was “Arq” + the vertical). Before we go to market, we want your honest, two-minute read as the people who actually sell these. There are no wrong answers.";

export const QUESTIONS: SurveyQuestion[] = [
  {
    id: "q1",
    type: "single",
    required: true,
    text: "When you imagine introducing an accelerator to a prospect for the first time, what would you most naturally lead with?",
    options: [
      { value: "a", label: "The product name (“I want to tell you about Veyra”)" },
      { value: "b", label: "The problem it solves (“We have something built specifically for TPA fraud detection”)" },
      { value: "c", label: "The outcome (“Companies like yours are finding millions in undetected waste they did not know existed”)" },
      { value: "d", label: "It would depend on how much the prospect already knows about ArqAI Labs" },
    ],
  },
  {
    id: "q2",
    type: "single",
    required: true,
    text: "Looking at the old names (ArqFWA, ArqBanker, ArqRetail) and the new ones (Veyra, Sentra, Nuvia), which do you think would be easier to introduce cold to a prospect who has never heard of ArqAI Labs?",
    options: [
      { value: "a", label: "Old names. The prospect immediately understands what the product does without explanation." },
      { value: "b", label: "New names. They feel like real products, not internal project codes." },
      { value: "c", label: "Neither. The name will not matter at that stage. The pain framing does the work." },
      { value: "d", label: "Depends on the seniority and vertical of the person I am talking to." },
    ],
  },
  {
    id: "q3",
    type: "single",
    required: true,
    text: "Which naming approach do you think would be easier for a prospect to remember and reference internally when they are championing ArqAI to their own team?",
    options: [
      { value: "a", label: "Old names (ArqFWA, ArqBanker, ArqRetail). Descriptive, self-explanatory." },
      { value: "b", label: "New names (Veyra, Sentra, Nuvia). Distinct and brand-like." },
      { value: "c", label: "Both would need a supporting one-liner regardless of the name." },
      { value: "d", label: "I am not sure." },
    ],
  },
  {
    id: "q4",
    type: "single",
    required: true,
    text: "Where do you anticipate the product name will matter most in a sales conversation?",
    options: [
      { value: "a", label: "Cold outreach, where you have two seconds of attention and no context" },
      { value: "b", label: "First discovery call, when you are trying to establish credibility" },
      { value: "c", label: "The proposal stage, when the prospect needs to reference it internally" },
      { value: "d", label: "I do not think the name will significantly affect any stage" },
    ],
  },
  {
    id: "q5",
    type: "scale",
    required: true,
    text: "How confident do you feel going to market with the new brand names (Veyra, Sentra, Nuvia) as they stand today?",
    options: [
      { value: "1", label: "1 — Not confident at all, I would not know how to explain them" },
      { value: "2", label: "2 — Somewhat unconfident, I would need supporting material" },
      { value: "3", label: "3 — Neutral, the name is just a label and I can work with either" },
      { value: "4", label: "4 — Fairly confident, I can build a pitch around them" },
      { value: "5", label: "5 — Fully confident, the name does not change how I sell" },
    ],
  },
  {
    id: "q6",
    type: "multi",
    required: false,
    max: 2,
    text: "What would most help you go to market with the new brand names? Select up to two.",
    options: [
      { value: "a", label: "A one-liner for each accelerator I can use naturally in conversation" },
      { value: "b", label: "A short backstory for each name so I can answer “what does Veyra mean?” without fumbling" },
      { value: "c", label: "A quick reference card: old name, new name, what it does, who it is for" },
      { value: "d", label: "A sales enablement session to practice using the new names before going live" },
      { value: "e", label: "Nothing additional. I can work with what exists." },
    ],
  },
  {
    id: "q7",
    type: "text",
    required: false,
    text: "Any instinct, concern, or suggestion about the naming change that leadership should hear before we go to market?",
  },
];

export const SINGLE_OR_SCALE_IDS = ["q1", "q2", "q3", "q4", "q5"] as const;

export function optionLabel(questionId: string, value: string): string {
  const q = QUESTIONS.find((x) => x.id === questionId);
  if (!q || q.type === "text") return value;
  return q.options.find((o) => o.value === value)?.label ?? value;
}
