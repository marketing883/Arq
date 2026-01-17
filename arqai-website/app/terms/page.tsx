import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Terms of Service | ArqAI",
  description: "ArqAI Terms of Service - Terms and conditions for using our platform.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <Section className="pt-32">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-[var(--arq-black)] mb-8">
              Terms of Service
            </h1>
            <p className="text-[var(--arq-gray-600)] mb-8">
              Last updated: January 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  1. Agreement to Terms
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  By accessing or using ArqAI&apos;s website (thearq.ai) and services,
                  you agree to be bound by these Terms of Service. If you do not agree
                  to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  2. Description of Services
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  ArqAI provides an enterprise AI command platform that enables
                  organizations to deploy, govern, and manage AI agents securely.
                  Our services include:
                </p>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>AI agent orchestration and deployment</li>
                  <li>Enterprise governance and compliance tools</li>
                  <li>Security and audit capabilities</li>
                  <li>Integration with existing enterprise systems</li>
                  <li>Analytics and monitoring dashboards</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  3. User Accounts
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  To access certain features of our services, you may be required to
                  create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly notify us of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  4. Acceptable Use
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  You agree not to use our services to:
                </p>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon intellectual property rights</li>
                  <li>Transmit malicious code or harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Use AI agents for unlawful or unethical purposes</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  5. Intellectual Property
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  All content, features, and functionality of our services, including
                  but not limited to software, text, graphics, logos, and trademarks,
                  are owned by ArqAI and protected by intellectual property laws.
                </p>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  You retain ownership of any content you submit to our platform.
                  By submitting content, you grant ArqAI a license to use, process,
                  and display such content as necessary to provide our services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  6. Payment Terms
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  For paid services:
                </p>
                <ul className="list-disc pl-6 text-[var(--arq-gray-600)] mb-4 space-y-2">
                  <li>Fees are as stated in your service agreement</li>
                  <li>Payment is due according to your billing cycle</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We may change prices with 30 days notice</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  7. Service Level Agreement
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  Enterprise customers may be subject to a separate Service Level
                  Agreement (SLA) that defines uptime guarantees, support response
                  times, and remedies for service interruptions.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  To the maximum extent permitted by law, ArqAI shall not be liable
                  for any indirect, incidental, special, consequential, or punitive
                  damages, including but not limited to loss of profits, data, or
                  business opportunities.
                </p>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  Our total liability shall not exceed the amount paid by you for the
                  services in the twelve (12) months preceding the claim.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  9. Indemnification
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  You agree to indemnify and hold ArqAI harmless from any claims,
                  damages, losses, or expenses arising from your use of our services
                  or violation of these terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  10. Termination
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  We may suspend or terminate your access to our services at any time
                  for violation of these terms or for any other reason with notice.
                  You may terminate your account at any time by contacting us.
                </p>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  Upon termination, your right to use the services will immediately
                  cease, and we may delete your data in accordance with our data
                  retention policies.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  11. Modifications to Terms
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  We reserve the right to modify these terms at any time. We will
                  provide notice of material changes through our website or by email.
                  Continued use of our services after such modifications constitutes
                  acceptance of the updated terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  12. Governing Law
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  These terms shall be governed by and construed in accordance with
                  the laws of the State of Delaware, United States, without regard
                  to its conflict of law provisions.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  13. Dispute Resolution
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  Any disputes arising from these terms or your use of our services
                  shall first be attempted to be resolved through good-faith
                  negotiations. If negotiations fail, disputes shall be submitted
                  to binding arbitration in accordance with the rules of the American
                  Arbitration Association.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-[var(--arq-black)] mb-4">
                  14. Contact Us
                </h2>
                <p className="text-[var(--arq-gray-600)] mb-4">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-[var(--arq-gray-50)] p-6 rounded-xl">
                  <p className="text-[var(--arq-gray-700)]">
                    <strong>ArqAI</strong>
                    <br />
                    Email:{" "}
                    <a
                      href="mailto:legal@thearq.ai"
                      className="text-[var(--arq-blue)] hover:underline"
                    >
                      legal@thearq.ai
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
