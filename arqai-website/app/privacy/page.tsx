import type { Metadata } from "next";
import V5SiteLayout from "@/components/home-v5/V5SiteLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | ArqAI",
  description: "ArqAI Privacy Policy - How we collect, use, and protect your data.",
  alternates: { canonical: "https://thearq.ai/privacy" },
};

export default function PrivacyPage() {
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
            <h1 className="v5-h1">Privacy Policy</h1>
            <p className="v5-lead">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="v5-section v5-bg-white">
        <div className="v5-container">
          <div className="v5-prose">
            <h2>1. Introduction</h2>
            <p>
              ArqAI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website thearq.ai
              and use our services.
            </p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <ul>
              <li>Name and email address when using our chat feature</li>
              <li>Company name and job title</li>
              <li>Phone number (if provided)</li>
              <li>Any other information you share with our AI assistant</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li>IP address and location data</li>
              <li>Browser type and device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide and improve our services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you relevant communications about our products</li>
              <li>To analyze website usage and improve user experience</li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraudulent or illegal activity</li>
            </ul>

            <h2>4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to collect information
              about your browsing activities. You can control cookie preferences
              through our cookie consent banner and your browser settings.
            </p>

            <h3>Types of Cookies We Use:</h3>
            <ul>
              <li>
                <strong>Necessary:</strong> Essential for website functionality
              </li>
              <li>
                <strong>Analytics:</strong> Help us understand how visitors use our site
              </li>
              <li>
                <strong>Marketing:</strong> Used to deliver personalized advertisements
              </li>
              <li>
                <strong>Preferences:</strong> Remember your settings and preferences
              </li>
            </ul>

            <h2>5. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Business partners with your consent</li>
              <li>Legal authorities when required by law</li>
              <li>Potential acquirers in case of business transfer</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information, including encryption, access
              controls, and regular security assessments.
            </p>

            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a href="mailto:privacy@thearq.ai">privacy@thearq.ai</a>
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries other than
              your country of residence. We ensure appropriate safeguards are in
              place for such transfers.
            </p>

            <h2>9. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill
              the purposes outlined in this policy, unless a longer retention period
              is required by law.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <p>
              <strong>ArqAI</strong>
              <br />
              Email: <a href="mailto:privacy@thearq.ai">privacy@thearq.ai</a>
              <br />
              Website: <a href="https://thearq.ai">thearq.ai</a>
            </p>
          </div>
        </div>
      </section>
    </V5SiteLayout>
  );
}
