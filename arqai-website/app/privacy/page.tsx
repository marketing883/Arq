import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Privacy Policy | ArqAI",
  description: "ArqAI Privacy Policy - How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <Section className="pt-32">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-[var(--arq-black)] mb-8">
              Privacy Policy
            </h1>
            <p className="text-[var(--arq-gray-600)] mb-8">
              Last updated: January 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  1. Introduction
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  ArqAI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your
                  privacy. This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you visit our website thearq.ai
                  and use our services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-[var(--arq-black)] mb-3">
                  2.1 Information You Provide
                </h3>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>Name and email address when using our chat feature</li>
                  <li>Company name and job title</li>
                  <li>Phone number (if provided)</li>
                  <li>Any other information you share with our AI assistant</li>
                </ul>

                <h3 className="text-xl font-semibold text-[var(--arq-black)] mb-3">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and device information</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>To provide and improve our services</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To send you relevant communications about our products</li>
                  <li>To analyze website usage and improve user experience</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect against fraudulent or illegal activity</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  4. Cookies and Tracking
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  We use cookies and similar tracking technologies to collect information
                  about your browsing activities. You can control cookie preferences
                  through our cookie consent banner and your browser settings.
                </p>

                <h3 className="text-xl font-semibold text-[var(--arq-black)] mb-3">
                  Types of Cookies We Use:
                </h3>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
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
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  5. Data Sharing and Disclosure
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  We do not sell your personal information. We may share your data with:
                </p>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>Service providers who assist in our operations</li>
                  <li>Business partners with your consent</li>
                  <li>Legal authorities when required by law</li>
                  <li>Potential acquirers in case of business transfer</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  6. Data Security
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  We implement appropriate technical and organizational measures to
                  protect your personal information, including encryption, access
                  controls, and regular security assessments.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  7. Your Rights
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data (&ldquo;right to be forgotten&rdquo;)</li>
                  <li>Restrict or object to processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  To exercise these rights, please contact us at{" "}
                  <a
                    href="mailto:privacy@thearq.ai"
                    className="text-[var(--arq-blue)] hover:underline"
                  >
                    privacy@thearq.ai
                  </a>
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  8. International Data Transfers
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  Your data may be transferred to and processed in countries other than
                  your country of residence. We ensure appropriate safeguards are in
                  place for such transfers.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  9. Data Retention
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  We retain your personal information for as long as necessary to fulfill
                  the purposes outlined in this policy, unless a longer retention period
                  is required by law.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  10. Contact Us
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  If you have questions about this Privacy Policy or our data practices,
                  please contact us:
                </p>
                <div className="bg-[var(--arq-gray-50)] p-6 rounded-xl">
                  <p className="text-[var(--arq-gray-700)]">
                    <strong>ArqAI</strong>
                    <br />
                    Email:{" "}
                    <a
                      href="mailto:privacy@thearq.ai"
                      className="text-[var(--arq-blue)] hover:underline"
                    >
                      privacy@thearq.ai
                    </a>
                    <br />
                    Website:{" "}
                    <a
                      href="https://thearq.ai"
                      className="text-[var(--arq-blue)] hover:underline"
                    >
                      thearq.ai
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
