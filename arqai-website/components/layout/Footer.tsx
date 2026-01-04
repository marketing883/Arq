"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { name: "CAPC", href: "/platform#capc" },
      { name: "TAO", href: "/platform#tao" },
      { name: "ODA-RAG", href: "/platform#oda-rag" },
      { name: "Integrations", href: "/platform#integrations" },
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      { name: "Financial Services", href: "/solutions#financial" },
      { name: "Insurance", href: "/solutions#insurance" },
      { name: "Healthcare", href: "/solutions#healthcare" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/demo" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Blog", href: "/resources" },
      { name: "Whitepapers", href: "/resources#whitepapers" },
      { name: "Case Studies", href: "/customers" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
};

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/arqai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/arqai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--arq-gray-900)] text-white">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-6">
              <svg
                width="120"
                height="40"
                viewBox="0 0 200 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 52L28 8L38 28L48 8L58 52H48L42 32L32 52L22 32L16 52H8Z"
                  fill="#0052CC"
                />
                <path
                  d="M28 8L38 28L32 40L22 20L28 8Z"
                  fill="#0052CC"
                />
                <circle cx="52" cy="18" r="6" fill="#CCFF00" />
                <text
                  x="70"
                  y="38"
                  fontFamily="system-ui, sans-serif"
                  fontSize="28"
                  fontWeight="700"
                  fill="#FFFFFF"
                >
                  ArqAI
                </text>
              </svg>
            </div>
            <p className="text-[var(--arq-gray-400)] text-sm mb-6">
              Intelligence, By Design. The command platform for enterprise AI governance.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--arq-gray-400)] hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--arq-gray-400)] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--arq-gray-800)]">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--arq-gray-400)]">
              &copy; {currentYear} ArqAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[var(--arq-gray-500)]">
                Headquarters: New Jersey, USA
              </span>
              <span className="text-xs text-[var(--arq-gray-500)]">
                Global Offices: US, MENA, Europe, India, LATAM
              </span>
              <LanguageSwitcher variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
