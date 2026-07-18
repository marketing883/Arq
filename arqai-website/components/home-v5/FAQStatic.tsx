import { generateFAQSchema, FAQData } from "@/lib/seo/structured-data";

/**
 * Server-renderable FAQ section for inner pages. Renders every answer open
 * (no accordion), so search and answer engines always see the full text, and
 * emits matching FAQPage JSON-LD so schema and visible content stay in parity
 * by construction.
 */
export default function FAQStatic({
  items,
  heading = "Frequently asked questions",
  sub,
  bg = "grey",
  withSchema = true,
}: {
  items: FAQData[];
  heading?: string;
  sub?: string;
  bg?: "grey" | "white";
  withSchema?: boolean;
}) {
  return (
    <section className={`v5-section v5-bg-${bg}`} id="faq">
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(items)) }}
        />
      )}
      <div className="v5-container">
        <div className="v5-section-head">
          <span className="v5-eyebrow">FAQs</span>
          <h2 className="v5-h2">{heading}</h2>
          {sub && <p className="v5-lead">{sub}</p>}
        </div>
        <div className="v5-grid v5-grid-2">
          {items.map((item) => (
            <div className="v5-card" key={item.question}>
              <h3 className="v5-h3">{item.question}</h3>
              <p className="v5-body">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
