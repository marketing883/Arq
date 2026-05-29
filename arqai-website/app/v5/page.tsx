import type { Metadata } from "next";
import Hero from "@/components/home-v5/Hero";
import Section2 from "@/components/home-v5/Section2";
import Section3 from "@/components/home-v5/Section3";
import Section4 from "@/components/home-v5/Section4";
import "@/components/home-v5/styles.css";

export const metadata: Metadata = {
  title: "ArqAI Labs · v5 preview",
  description:
    "Industry-deep AI, built around your operations. Production AI for retail, healthcare, banking, and insurance.",
};

export default function V5Page() {
  return (
    <div className="v5-shell">
      <main>
        <Hero />
        <Section2 />
        <Section3 />
        <Section4 />
      </main>
    </div>
  );
}
