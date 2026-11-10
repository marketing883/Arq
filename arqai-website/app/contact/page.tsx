import type { Metadata } from "next";
import { generateFAQSchema } from "@/lib/seo/structured-data";
import { contactFaqs } from "./faqs";
import ContactClient from "./ContactClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to ArqAI Labs about production AI for your operation. Tell us what needs to change and a senior member of the team will respond within one business day.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact Us | ArqAI Labs",
    description:
      "Talk to ArqAI Labs about production AI for your operation. Tell us what needs to change and a senior member of the team will respond within one business day.",
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(contactFaqs)) }}
      />
      <ContactClient />
    </>
  );
}
