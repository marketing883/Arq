import type { Metadata } from "next";
import PartnersClient from "./PartnersClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Build the next AI workflow with us. Technology, delivery, and referral partnership tracks for teams bringing production AI to enterprise operations.",
  alternates: { canonical: `${SITE_URL}/partners` },
  openGraph: {
    title: "Partner With Us | ArqAI Labs",
    description:
      "Build the next AI workflow with us. Technology, delivery, and referral partnership tracks for teams bringing production AI to enterprise operations.",
    url: `${SITE_URL}/partners`,
  },
};

export default function PartnersPage() {
  return <PartnersClient />;
}
