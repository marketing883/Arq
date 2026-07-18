import Link from "next/link";
import V5CtaSection from "./V5CtaSection";
import { ArrowRight } from "./icons";

/**
 * The default closing CTA band, used on content and company pages that don't
 * define a bespoke one — keeps every page's rhythm consistent with the rest
 * of the site (content → CTA band → footer).
 */
export default function V5CtaStandard({
  heading = "Bring us the workflow that should be operating differently.",
  sub = "Tell us what your operation needs and we will tell you what is honestly possible. A senior member of the team follows up within one business day.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <V5CtaSection>
      <h2 className="v5-h2">{heading}</h2>
      <p className="v5-lead">{sub}</p>
      <div className="v5-cta-card-actions">
        <Link href="/engage-us" className="v5-btn v5-btn-primary">
          Get Started <ArrowRight />
        </Link>
        <Link href="/services" className="v5-btn v5-btn-ghost">
          View services
        </Link>
      </div>
    </V5CtaSection>
  );
}
