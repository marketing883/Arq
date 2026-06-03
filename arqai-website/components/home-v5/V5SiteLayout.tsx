import V5Nav from "./V5Nav";
import Footer from "./Footer";
import "./styles.css";

/**
 * Site-wide v5 chrome: the rounded mega-menu nav + multi-column footer,
 * scoped under .v5-shell so the v5 design tokens apply. Wrap any internal
 * page body in this to put it on the new design system.
 */
export default function V5SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v5-shell">
      <V5Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
