import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import "@/components/v6/v6.css";
import "./styles.css";

export default function V5SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v5-shell">
      <V6Nav />
      <main>{children}</main>
      <V6Footer />
    </div>
  );
}
