"use client";

import Image from "next/image";
import Link from "next/link";
import { footerNavigation } from "@/lib/data/site-navigation";

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
          <p style={{ color: "var(--ink-cream-d)", fontSize: 14, lineHeight: 1.55, marginTop: 16, maxWidth: 390 }}>
            Production AI workflows, built around your operation. ArqAI Labs combines a focused AI engineering studio
            with enterprise delivery depth from{" "}
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
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <span className="a-tag">SOC 2 aligned</span>
            <span className="a-tag">HIPAA aware</span>
            <span className="a-tag">GDPR aware</span>
          </div>
        </div>

        {footerNavigation.map((group) => (
          <div key={group.title}>
            <h5>{group.title}</h5>
            <ul>
              {group.links.map((link) => (
                <li key={`${group.title}-${link.href}`}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="a-footer-bottom">
        <span>(c) {new Date().getFullYear()} ArqAI Labs. All rights reserved.</span>
        <span style={{ display: "flex", gap: 16 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/trust#responsible-ai">Responsible AI</Link>
        </span>
      </div>
    </footer>
  );
}
