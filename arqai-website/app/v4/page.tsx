import { headers } from "next/headers";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-dark/SiteNav";
import { SiteFooter } from "@/components/site-dark/SiteFooter";
import ControlPanel from "@/components/home-v4/ControlPanel";
import MobileHome from "@/components/home-v4/MobileHome";
import "@/components/home-v4/styles.css";

export const metadata: Metadata = {
  title: "ArqAI Labs · v4 preview",
  description:
    "Configure your operation. We resolve the fit. A control-panel preview of how ArqAI Labs services and accelerators map to your workflow.",
};

function isMobileUA(ua: string): boolean {
  return /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

export default async function V4Page() {
  const h = await headers();
  const ua = h.get("user-agent") || "";
  const mobile = isMobileUA(ua);

  if (mobile) {
    return (
      <div className="arq-dark min-h-screen">
        <SiteNav />
        <MobileHome />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="arq-dark min-h-screen">
      <SiteNav />
      <main>
        <ControlPanel />
        <section id="next" className="a-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="a-wrap" style={{ textAlign: "center" }}>
            <span className="a-eyebrow">Below the panel</span>
            <h2 className="h-section" style={{ marginTop: 18, maxWidth: "22ch", marginInline: "auto" }}>
              Rest of the page coming next.
            </h2>
            <p className="lede" style={{ marginTop: 20, marginInline: "auto" }}>
              We&apos;ll design the body of the page after the hero lands.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
