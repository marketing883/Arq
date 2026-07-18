import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team shipping production AI for enterprise operations. Open roles in engineering, delivery, and go-to-market at ArqAI Labs.",
  alternates: { canonical: "https://thearq.ai/careers" },
  openGraph: {
    title: "Careers | ArqAI Labs",
    description:
      "Join the team shipping production AI for enterprise operations. Open roles in engineering, delivery, and go-to-market at ArqAI Labs.",
    url: "https://thearq.ai/careers",
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
