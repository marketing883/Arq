import type { Metadata } from "next";
import PartnersClient from "./PartnersClient";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Build the next AI workflow with us. Technology, delivery, and referral partnership tracks for teams bringing production AI to enterprise operations.",
  alternates: { canonical: "https://thearq.ai/partners" },
  openGraph: {
    title: "Partner With Us | ArqAI Labs",
    description:
      "Build the next AI workflow with us. Technology, delivery, and referral partnership tracks for teams bringing production AI to enterprise operations.",
    url: "https://thearq.ai/partners",
  },
};

export default function PartnersPage() {
  return <PartnersClient />;
}
