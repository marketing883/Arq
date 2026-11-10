import type { Metadata } from "next";
import CareersClient from "./CareersClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team shipping production AI for enterprise operations. Open roles in engineering, delivery, and go-to-market at ArqAI Labs.",
  alternates: { canonical: `${SITE_URL}/careers` },
  openGraph: {
    title: "Careers | ArqAI Labs",
    description:
      "Join the team shipping production AI for enterprise operations. Open roles in engineering, delivery, and go-to-market at ArqAI Labs.",
    url: `${SITE_URL}/careers`,
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
