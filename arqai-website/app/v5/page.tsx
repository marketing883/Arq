import type { Metadata } from "next";
import V5Nav from "@/components/home-v5/V5Nav";
import Hero from "@/components/home-v5/Hero";
import Features from "@/components/home-v5/Features";
import Accelerators from "@/components/home-v5/Accelerators";
import WhyChooseUs from "@/components/home-v5/WhyChooseUs";
import Workflow from "@/components/home-v5/Workflow";
import Integration from "@/components/home-v5/Integration";
import Testimonials from "@/components/home-v5/Testimonials";
import FAQ from "@/components/home-v5/FAQ";
import Blogs from "@/components/home-v5/Blogs";
import Contact from "@/components/home-v5/Contact";
import Footer from "@/components/home-v5/Footer";
import "@/components/home-v5/styles.css";

export const metadata: Metadata = {
  title: "ArqAI Labs · v5 preview",
  description:
    "Empower your business with operational AI. We design, build, deploy, and run production AI for retail, healthcare, banking, and insurance.",
};

export default function V5Page() {
  return (
    <div className="v5-shell">
      <V5Nav />
      <main>
        <Hero />
        <Features />
        <Accelerators />
        <WhyChooseUs />
        <Workflow />
        <Integration />
        <Testimonials />
        <FAQ />
        <Blogs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
