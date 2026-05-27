import type { Metadata } from "next";
import V5Nav from "@/components/home-v5/V5Nav";
import Hero from "@/components/home-v5/Hero";
import "@/components/home-v5/styles.css";

export const metadata: Metadata = {
  title: "ArqAI Labs · v5 preview",
  description:
    "Industry-deep AI, built around your operations. Production AI for retail, healthcare, banking, and insurance.",
};

export default function V5Page() {
  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        <Hero />
        <section id="v5-next" style={{ minHeight: "60vh", padding: "120px 24px", background: "#0b0728", color: "white" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Rest of the page coming next.
            </h2>
            <p style={{ marginTop: 18, color: "rgba(255,255,255,0.7)", maxWidth: "60ch", marginInline: "auto" }}>
              Hero in place. Sections below will be built section-by-section as content and visuals come in.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
