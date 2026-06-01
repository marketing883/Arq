import { LOGO, FOOTER, NAV_LINKS } from "./content";

export default function Footer() {
  return (
    <footer className="v5-footer">
      <div className="v5-footer-inner">
        <div className="v5-footer-top">
          <a href="#top" className="v5-nav-brand">
            <img src={LOGO} alt="ArqAI Labs" className="v5-nav-logo-img" />
          </a>

          <nav className="v5-footer-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="v5-footer-bottom">
          <p>{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
