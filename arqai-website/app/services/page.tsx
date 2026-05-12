import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowIcon, DarkShell } from "@/components/site-dark/DarkShell";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | ArqAI Labs",
  description:
    "AI workflow strategy, agentic buildout, enterprise integration, governance, vertical acceleration, and managed AI operations for enterprise teams.",
};

export default function ServicesPage() {
  return (
    <DarkShell>
      <section className="a-hero">
        <div className="a-hero-grid" />
        <div className="a-wrap" style={{ position: "relative" }}>
          <span className="a-pill">
            <span className="dot" /> Services
          </span>
          <div className="a-section-head" style={{ marginTop: 28, alignItems: "start" }}>
            <div>
              <h1 className="h-display" style={{ maxWidth: "13ch" }}>
                AI systems built around the work that <span className="accent">matters</span>.
              </h1>
            </div>
            <div>
              <p className="lede">
                ArqAI Labs designs, builds, integrates, governs, and operates production AI workflows for enterprise
                teams that need measurable outcomes, not another pilot.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <Link href="/engage-us" className="a-btn a-btn-primary">
                  Start with one workflow <ArrowIcon className="arrow" />
                </Link>
                <Link href="/accelerators" className="a-btn a-btn-ghost">
                  Explore accelerators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="svc-grid">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="svc reveal in"
                data-d={(index % 3) + 1}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div className="svc-media">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="svc-media-shade" />
                  <div className="svc-media-icon">{String(index + 1).padStart(2, "0")}</div>
                </div>
                <h4>{service.title}</h4>
                <p>{service.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="a-section">
        <div className="a-wrap">
          <div className="a-card" style={{ padding: "clamp(28px, 5vw, 56px)" }}>
            <div className="a-section-head" style={{ alignItems: "center" }}>
              <div>
                <span className="a-eyebrow">How services compound</span>
                <h2 className="h-section" style={{ marginTop: 18 }}>
                  From first workflow to governed operating system.
                </h2>
              </div>
              <div>
                <p className="lede">
                  Start with the service that matches your current bottleneck. Each engagement is designed to connect
                  strategy, build, integration, governance, and operations into one production path.
                </p>
                <Link href="/engage-us" className="a-btn a-btn-primary" style={{ marginTop: 28 }}>
                  Talk to a senior builder <ArrowIcon className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DarkShell>
  );
}
