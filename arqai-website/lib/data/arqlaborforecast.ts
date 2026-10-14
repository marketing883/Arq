// Finalized copy for /accelerators/arqlaborforecast, from
// "Arqai Labor Forecast Landing Page" (docx). Keep it verbatim: `**text**`
// marks the bold runs in the source and is the only markup here. Section
// order follows the document.

export type LfQA = { q: string; a: string };
export type LfItem = { label: string; body: string };

export const lf = {
  title: "Enterprise Labor Demand Forecasting & Predictive Workforce Roster Optimization",
  subtitle:
    "Anticipate Staffing Gaps, Control Overtime Exposure, and Improve Labor Cost Planning Across Sites",

  definition: {
    q: "What is zero-schema labor demand forecasting?",
    a: "**Zero-schema labor demand forecasting** with Arqai Labor Forecast provides an enterprise workforce planning engine that converts raw HCM exports into forward-looking, site-and-department demand forecasts before the operating week begins. By evaluating historical operational data against planned rosters using localized machine learning models, the platform identifies staffing deficits early, generates ranked cross-site capacity recommendations, and prevents margin erosion driven by unbudgeted overtime and premium agency spend without requiring schema mapping or custom API development.",
  },

  value: {
    heading: "Executive Value Proposition",
    paragraphs: [
      "For COOs, CFOs, and VPs of Operations, unbudgeted labor expenditure is rarely a forecasting failure; it is a lead-time failure. When operational demand shifts unexpectedly, static schedules force site managers into high-cost agency staffing or emergency overtime to maintain service levels.",
      "Arqai Labor Forecast establishes forward-looking operational control through **predictive roster planning for multi-site enterprise operations**, translating flat file exports from Workday, UKG, SAP SuccessFactors, or local spreadsheets into precise period-by-period labor requirements. By comparing projected demand against scheduled hours weeks in advance, enterprise leaders gain the visibility required for **cross-department labor reallocation and overtime prevention**, executing **labor cost margin protection strategies** and enforcing operational governance across multi-site footprints without triggering costly IT integration projects.",
    ],
  },

  cta: {
    heading: "Ready to Eliminate Unbudgeted Agency Spend Across Your Sites?",
    body: "Join enterprise operations teams using driver-backed predictive workforce planning to enforce payroll discipline and automate cross-site reallocation.",
    button: "Schedule a 15-Minute Operational Audit",
    note: "Zero schema mapping required. Standard CSV and Excel exports work out of the box.",
  },

  capacity: {
    heading: "Multi-Site Capacity Planning Software: Turning Lead Time into Margin Protection",
    qa: {
      q: "How to reduce overtime costs in multi-site operations?",
      a: "To **reduce overtime costs in multi-site operations**, leadership must extend roster planning lead times beyond immediate operating windows. Arqai Labor Forecast compares forecasted demand against scheduled rosters to highlight coverage gaps 7 to 14 days in advance. This lead time allows site managers to execute cost-neutral roster changes or reallocate internal labor, preventing emergency agency spend and unbudgeted overtime premiums.",
    },
    subheading: "Extended Roster Lead Time as a Financial Lever",
    body: "The core economic driver of **multi-site capacity planning software** is operational lead time. A staffing deficit identified seven days prior to a shift represents a manageable roster adjustment. The exact same deficit identified on the day of execution forces emergency reliance on third-party agency cover or premium overtime rates.",
    table: {
      columns: ["Operational State", "Roster Condition", "Financial & Operational Impact", "Recommended Action"],
      rows: [
        [
          "Shortfall Series",
          "Projected demand exceeds scheduled hours",
          "Risk of service degradation, staff burnout, and emergency overtime penalties",
          "Execute cost-neutral internal transfers or scan adjacent site availability",
        ],
        [
          "Balanced Series",
          "Scheduled hours match volume within target threshold",
          "Optimal labor expenditure and payroll alignment",
          "Maintain current roster schedule",
        ],
        [
          "Surplus Series",
          "Scheduled hours exceed required operational volume",
          "Margin erosion due to unneeded labor spend",
          "Reallocate available capacity to neighboring high-demand departments",
        ],
      ],
    },
    closing:
      "By converting reactive daily backfilling into structured forward planning, executive teams achieve **workforce planning ROI and time-to-value acceleration**, protecting operating margins across all location footprints.",
  },

  drivers: {
    heading: "Driver-Based Predictive Roster Planning for Multi-Site Enterprise Operations",
    qa: {
      q: "How to predict department-level labor demand from HCM exports?",
      a: "To **predict department-level labor demand from HCM exports**, Arqai Labor Forecast links historical workforce data with operational demand drivers such as patient census, customer foot traffic, or promotional events. By running dedicated machine learning models for each site and department series, the system automatically recalculates required headcount as demand variables shift, ensuring accurate staffing without manual formula adjustments.",
    },
    subheading: "Algorithmic Precision Over Static Scheduling",
    paragraphs: [
      "Legacy scheduling methods rely on flat percentage adjustments and past roster templates, leaving multi-site operations exposed when operational volume fluctuates. Arqai Labor Forecast replaces static baselines with driver-aware machine learning models that capture true labor-to-volume relationships.",
      "When business conditions change, the platform dynamically rescales shift requirements across all affected departments:",
    ],
    items: [
      {
        label: "Variable Driver Integration",
        body: "Models ingest operational metrics such as unit throughput, guest counts, or activity logs alongside standard HCM exports.",
      },
      {
        label: "Dedicated Series Modeling",
        body: "Rather than applying global averages, every site and department series maintains an isolated predictive model to preserve local operational accuracy.",
      },
      {
        label: "Proactive Scenario Simulation",
        body: "Operations leadership can model upcoming volume changes or promotional campaigns to estimate labor costs before finalizing rosters.",
      },
    ] as LfItem[],
    closing:
      "By replacing subjective estimates with driver-backed forecasts, enterprise leaders can identify staffing risks earlier, improve workforce planning decisions, and support more disciplined labor cost management as operational demand changes.",
  },

  reallocation: {
    heading: "Cross-Department Labor Reallocation and Overtime Prevention Logic",
    subheading: "Prioritized Capacity Recommendations to Mitigate Emergency Agency Spend",
    qa: {
      q: "How to balance cross-site labor capacity automatically?",
      a: "To **balance cross-site labor capacity automatically**, Arqai Labor Forecast evaluates relative operational severity across every site and department series. Instead of evaluating raw headcount deficits alone, the system flags critical coverage gaps first, such as a 6-person shortage on an 8-person team versus a 6-person shortage on a 60-person team, and scans adjacent departments or nearby sites for available internal slack before suggesting external labor.",
    },
    stepsHeading: "Evidence-Backed Action Items Over Raw Data",
    stepsIntro:
      "Identifying a labor gap is only half the equation; operational teams need clear, prioritized steps to resolve deficits before incurring costs. **ArqAI Labor Forecast** turns complex demand projections into actionable, evidence-backed recommendations ranked by financial and operational urgency.",
    steps: [
      {
        title: "Step 1: Severity Ranking",
        mechanism: "Flags gaps by operational impact ratio (e.g., 6/8 short vs 6/60).",
        outcome: "Focuses leadership attention on **high-risk operational bottlenecks** first.",
      },
      {
        title: "Step 2: Slack Identification",
        mechanism: "Scans adjacent departments and nearby sites for available staff.",
        outcome: "Uncovers **cost-neutral internal capacity** before looking outward.",
      },
      {
        title: "Step 3: Cost Reallocation",
        mechanism: "Prioritizes internal transfers over third-party agency hiring.",
        outcome: "Directly **prevents unbudgeted agency premiums** and protects margins.",
      },
    ],
  },

  assistant: {
    heading: "Enterprise AI Conversational Assistant for Labor Analytics and Roster Intelligence",
    subheading: "Natural Language Operational Query Engine for Instant Multi-Site Staffing Insights",
    qa: {
      q: "How to query workforce demand and roster data using plain language AI?",
      a: "To **query workforce demand and roster data using plain language AI**, Arqai Labor Forecast embeds a natural language assistant directly over your operational datasets. Operational leaders can ask direct questions regarding upcoming headcount requirements, capacity gaps, or historical model accuracy without navigating complex BI dashboards or writing custom SQL queries.",
    },
    answersHeading: "Verifiable Data Answers Without Dashboard Friction",
    answersParagraphs: [
      "Navigating traditional enterprise software dashboards consumes valuable time when site managers and operations directors need immediate visibility into upcoming shift coverage. The plain-language conversational assistant provides an immediate interface to interrogate roster data, demand forecasts, and site capacity using standard operational terminology.",
      "The conversational assistant delivers structured operational intelligence across key areas:",
    ],
    items: [
      {
        label: "Forecasts and Direction",
        body: "Immediate visibility into required labor hours or headcount for upcoming weeks, alongside macro demand trajectories across sites.",
      },
      {
        label: "Capacity Gap Analysis",
        body: "Direct identification of specific periods and departments where scheduled hours fall short of projected demand.",
      },
      {
        label: "Model Accuracy Auditing",
        body: "Transparent performance metrics showing how well the localized machine learning models performed on unseen operational datasets.",
      },
      {
        label: "On-Demand Visualizations",
        body: "Instant generation of charts and trend lines derived strictly from verified underlying application numbers.",
      },
    ] as LfItem[],
    restraintHeading: "Operational Restraint as a Core Governance Feature",
    restraintParagraphs: [
      "Unlike open-ended generative AI tools that risk hallucinating responses, the assistant operates under strict contextual guardrails. It queries exclusively within the active application data. If asked about metrics or variables outside the ingested HCM and operational files, the system explicitly states its boundaries and presents supported topics.",
      "Furthermore, the system strictly respects native units. A dataset measured in labor hours is reported exclusively in labor hours, ensuring zero artificial conversions into unrecorded headcounts. This strict data restraint provides executive teams with a fully trustworthy AI layer for **predictive roster planning for multi-site enterprise operations**.",
    ],
  },

  integration: {
    heading: "Zero-IT Integration Architecture: Native Flat File Ingestion Without Schema Mapping",
    ingestHeading: "Eliminate Integration Projects and Custom Field Mapping",
    ingestParagraphs: [
      "Enterprise software implementations frequently stall during IT schema mapping and API connector configuration. Arqai Labor Forecast bypasses multi-month IT integration pipelines by ingesting standard CSV and Excel workbook exports directly from your existing systems of record.",
      "The automated ingestion engine processes standard flat file exports without requiring pre-upload formatting or field renaming:",
    ],
    ingestItems: [
      {
        label: "HCM and Core HR Exports",
        body: "Processes scheduled hours, headcount metrics, and cost center structures directly from Workday, UKG, SAP SuccessFactors, or Oracle HCM.",
      },
      {
        label: "Payroll and Time Tracking Systems",
        body: "Ingests recorded hours worked and rostered shift allocations from legacy payroll tools.",
      },
      {
        label: "Point-of-Sale and Operational Systems",
        body: "Reads transactional volumes, covers, bed occupancy, or facility volume metrics.",
      },
      {
        label: "Custom Spreadsheets",
        body: "Reads manual tracking workbooks regardless of layout complexity.",
      },
    ] as LfItem[],
    cleanHeading: "Automated File Normalization and Error Correction",
    cleanParagraphs: [
      "Flat files exported from operational systems often contain structural clutter. Arqai Labor Forecast automatically cleans and aligns raw data on upload without manual intervention.",
      "The upload engine resolves common file layout issues automatically:",
    ],
    cleanItems: [
      { label: "Header and Title Rows", body: "Strips non-standard title rows situated above table headers." },
      {
        label: "Footer and Summary Rows",
        body: "Removes bottom total rows automatically to prevent numerical distortion.",
      },
      {
        label: "Formatted Numerical Strings",
        body: "Normalizes text-formatted numbers, percentages, and comma separators.",
      },
      {
        label: "Multi-Tab Workbooks",
        body: "Straightens out multi-site files formatted as one sheet per location or month-per-column structures.",
      },
      {
        label: "Audit Feedback",
        body: "Generates an immediate cleanup log outlining every structural adjustment made during ingestion.",
      },
    ] as LfItem[],
    nightlyHeading: "Automated Nightly Ingestion via HTTP Endpoints",
    nightly:
      "For operations requiring continuous updates, file ingestion can be fully automated using a standard HTTP endpoint. Internal IT teams can schedule a nightly job to drop yesterday's system export directly into the endpoint, ensuring your workforce models reflect fresh operational data without requiring daily human oversight.",
  },

  faqs: [
    {
      q: "How does Arqai Labor Forecast process messy or unformatted Excel files?",
      a: "The upload engine automatically cleans and normalizes incoming flat files during ingestion. It strips out title rows, removes summary total rows at the bottom, cleans text-formatted numbers or percentages, and handles multi-tab workbooks without requiring manual data preparation or schema mapping.",
    },
    {
      q: "What happens if our site roster file is missing or incomplete?",
      a: "Every uploaded file receives a forecast regardless of whether roster data is included. Without a scheduled roster column, the platform provides the required period-by-period labor demand ahead, compares that requirement against the site's historical baseline, and outputs a recommended roster figure that absorbs measured model variance.",
    },
    {
      q: "Why does Arqai Labor Forecast prioritize relative shortfall over total headcount missing?",
      a: "A shortage of 6 staff members on a team of 8 represents a critical operational bottleneck, whereas a shortage of 6 on a team of 60 is a minor variance. The recommendation engine ranks actions by relative impact ratio so operations leadership can address high-risk coverage gaps first.",
    },
    {
      q: "How does the AI assistant prevent hallucinated data?",
      a: "The conversational assistant queries exclusively within the ingested application dataset. If asked about variables or metrics outside the uploaded files, it declines to answer and lists supported topics. Additionally, it reports metrics strictly in their original recorded units.",
    },
    {
      q: "Can file uploads be automated without human intervention?",
      a: "Yes. Ingestion can be executed via a standard HTTP endpoint, allowing internal IT scheduled jobs to transmit nightly system exports into the model automatically without manual clicks.",
    },
  ] as LfQA[],
};

/** Drop the bold markers, for structured data and meta tags. */
export const plain = (s: string) => s.replace(/\*\*/g, "");
