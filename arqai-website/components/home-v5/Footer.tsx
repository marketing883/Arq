import { LOGO, FOOTER, NAV_LINKS, HERO_VIDEO, HERO_POSTER } from "./content";

export default function Footer() {
  return (
    <footer className="v5-footer">
      <video
        className="v5-footer-video"
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_POSTER}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="v5-footer-veil" />

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
