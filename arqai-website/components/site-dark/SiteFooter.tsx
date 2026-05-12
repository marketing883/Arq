"use client";

import Image from "next/image";
import Link from "next/link";

const work = [
  { name: "Services", href: "/services" },
  { name: "Process", href: "/how-we-work" },
  { name: "Accelerators", href: "/accelerators" },
  { name: "Industries", href: "/industries" },
];

const company = [
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Trust", href: "/trust" },
];

const resources = [
  { name: "Blog", href: "/blog" },
  { name: "Case studies", href: "/case-studies" },
  { name: "Whitepapers", href: "/whitepapers" },
  { name: "Get Started", href: "/engage-us" },
];

export function SiteFooter() {
  return (
    <footer className="a-footer">
      <div className="a-footer-grid">
        <div>
          <Link href="/" className="a-logo">
            <Image
              src="/img/ArqAI-Labs-Logo-light.png"
              alt="ArqAI Labs"
              width={720}
              height={240}
              className="h-8 w-auto"
            />
          </Link>
          <p style={{ color: "var(--ink-cream-d)", fontSize: 14, lineHeight: 1.55, marginTop: 16, maxWidth: 360 }}>
            Agentic operating systems for enterprise workflows. The AI products and services arm of{" "}
            <a
              href="https://aciinfotech.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--ink-cream)", borderBottom: "1px solid var(--aline-2)" }}
            >
              ACI Infotech
            </a>
            .
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <span className="a-tag">SOC 2</span>
            <span className="a-tag">HIPAA</span>
            <span className="a-tag">GDPR</span>
          </div>
        </div>
        <div>
          <h5>Work</h5>
          <ul>
            {work.map((l) => (
              <li key={l.name}>
                <Link href={l.href}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            {company.map((l) => (
              <li key={l.name}>
                <Link href={l.href}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Resources</h5>
          <ul>
            {resources.map((l) => (
              <li key={l.name}>
                <Link href={l.href}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="a-footer-bottom">
        <span>© {new Date().getFullYear()} ArqAI Labs. All rights reserved.</span>
        <span style={{ display: "flex", gap: 16 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/responsible-ai">Responsible AI</Link>
        </span>
      </div>
    </footer>
  );
}
