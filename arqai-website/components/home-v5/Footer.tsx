import Link from "next/link";

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "#features" },
      { label: "Why ArqAI", href: "#why" },
      { label: "Process", href: "#process" },
      { label: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "Book a Strategy Call", href: "/demo" },
      { label: "Contact", href: "/contact" },
      { label: "Engage Us", href: "/engage-us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="v5-footer">
      <div className="v5-footer-inner">
        <div className="v5-footer-top">
          <div className="v5-footer-brand">
            <Link href="/v5" className="v5-nav-brand">
              <span className="v5-nav-logo">
                <span />
              </span>
              ArqAI
            </Link>
            <p>
              Industry-deep AI, built around your operations. We design, build,
              deploy, and run production AI for regulated enterprises.
            </p>
          </div>

          {COLS.map((col) => (
            <div className="v5-footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="v5-footer-bottom">
          <p>© {new Date().getFullYear()} ArqAI Labs. All rights reserved.</p>
          <div className="v5-footer-socials">
            <a href="#" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21H10z" />
              </svg>
            </a>
            <a href="#" aria-label="X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.1 4H5.1l12.6 16z" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
