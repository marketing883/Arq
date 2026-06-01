import { LOGO, FOOTER } from "./content";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Platform Overview", href: "/platform" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Services", href: "/services" },
      { label: "Trust & Security", href: "/trust" },
    ],
  },
  {
    title: "Accelerators",
    links: [
      { label: "Veyra", href: "/accelerators#veyra" },
      { label: "Sentra", href: "/accelerators#sentra" },
      { label: "Nuvia", href: "/accelerators#nuvia" },
      { label: "All Accelerators", href: "/accelerators" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Healthcare Payers", href: "/industries/healthcare-payers" },
      { label: "Banking", href: "/industries/banking" },
      { label: "Insurance Carriers", href: "/industries/insurance-carriers" },
      { label: "Retail", href: "/industries/retail" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Whitepapers", href: "/whitepapers" },
      { label: "Webinars", href: "/webinars" },
      { label: "Resource Library", href: "/resources" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How We Work", href: "/how-we-work" },
      { label: "Careers", href: "/careers" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SOCIALS: { label: string; href: string; path: string }[] = [
  { label: "LinkedIn", href: "#", path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21H10z" },
  { label: "X", href: "#", path: "M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.9L7.1 4H5.1l12.6 16z" },
  { label: "GitHub", href: "#", path: "M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" },
];

export default function Footer() {
  return (
    <footer className="v5-footer">
      <div className="v5-footer-inner">
        <div className="v5-footer-brand">
          <a href="#top" className="v5-nav-brand">
            <img src={LOGO} alt="ArqAI Labs" className="v5-nav-logo-img" />
          </a>
          <p>Industry-deep AI, built around your operations — designed, deployed, and run in production.</p>
          <div className="v5-footer-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="v5-footer-cols">
          {COLUMNS.map((col) => (
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
          <p>{FOOTER.copyright}</p>
          <div className="v5-footer-legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
