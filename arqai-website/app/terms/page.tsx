import type { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ArqAI Terms of Service - Terms and conditions for using our platform.",
  alternates: { canonical: "https://thearq.ai/terms" },
};

export default function TermsPage() {
  return (
    <V5SiteLayout>
      {/* Hero */}
      <section className="v5-page-hero">
        <div className="v5-container">
          <div className="v5-page-hero-inner">
            <span className="v5-badge">
              <span className="v5-badge-dot" />
              Legal
            </span>
            <h1 className="v5-h1">Terms of Service</h1>
            <p className="v5-lead">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-prose">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using ArqAI&apos;s website (thearq.ai) and services,
              you agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our services.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              ArqAI provides AI engineering services, operating fabric, and
              accelerator patterns that help organizations build, govern, and
              operate production AI workflows securely. Our services include:
            </p>
            <ul>
              <li>Agentic workflow strategy, buildout, and deployment</li>
              <li>Enterprise governance, controls, and compliance support</li>
              <li>Security and audit capabilities</li>
              <li>Integration with existing enterprise systems</li>
              <li>Evaluation, analytics, monitoring, and managed AI operations</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our services, you may be required to
              create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly notify us of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use our services to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Transmit malicious code or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Use AI agents for unlawful or unethical purposes</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our services, including
              but not limited to software, text, graphics, logos, and trademarks,
              are owned by ArqAI and protected by intellectual property laws.
            </p>
            <p>
              You retain ownership of any content you submit to our platform.
              By submitting content, you grant ArqAI a license to use, process,
              and display such content as necessary to provide our services.
            </p>

            <h2>6. Payment Terms</h2>
            <p>For paid services:</p>
            <ul>
              <li>Fees are as stated in your service agreement</li>
              <li>Payment is due according to your billing cycle</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We may change prices with 30 days notice</li>
            </ul>

            <h2>7. Service Level Agreement</h2>
            <p>
              Enterprise customers may be subject to a separate Service Level
              Agreement (SLA) that defines uptime guarantees, support response
              times, and remedies for service interruptions.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, ArqAI shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to loss of profits, data, or
              business opportunities.
            </p>
            <p>
              Our total liability shall not exceed the amount paid by you for the
              services in the twelve (12) months preceding the claim.
            </p>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold ArqAI harmless from any claims,
              damages, losses, or expenses arising from your use of our services
              or violation of these terms.
            </p>

            <h2>10. Termination</h2>
            <p>
              We may suspend or terminate your access to our services at any time
              for violation of these terms or for any other reason with notice.
              You may terminate your account at any time by contacting us.
            </p>
            <p>
              Upon termination, your right to use the services will immediately
              cease, and we may delete your data in accordance with our data
              retention policies.
            </p>

            <h2>11. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will
              provide notice of material changes through our website or by email.
              Continued use of our services after such modifications constitutes
              acceptance of the updated terms.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with
              the laws of the State of Delaware, United States, without regard
              to its conflict of law provisions.
            </p>

            <h2>13. Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms or your use of our services
              shall first be attempted to be resolved through good-faith
              negotiations. If negotiations fail, disputes shall be submitted
              to binding arbitration in accordance with the rules of the American
              Arbitration Association.
            </p>

            <h2>14. Contact Us</h2>
            <p>If you have questions about these Terms of Service, please contact us:</p>
            <p>
              <strong>ArqAI</strong>
              <br />
              Email: <a href="mailto:legal@thearq.ai">legal@thearq.ai</a>
              <br />
              Website: <a href="https://thearq.ai">thearq.ai</a>
            </p>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
