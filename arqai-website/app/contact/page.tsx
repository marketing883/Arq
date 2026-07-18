import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to ArqAI Labs about production AI for your operation. Tell us what needs to change and a senior member of the team will respond within one business day.",
  alternates: { canonical: "https://thearq.ai/contact" },
  openGraph: {
    title: "Contact Us | ArqAI Labs",
    description:
      "Talk to ArqAI Labs about production AI for your operation. Tell us what needs to change and a senior member of the team will respond within one business day.",
    url: "https://thearq.ai/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
