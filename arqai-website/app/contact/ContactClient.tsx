"use client";

import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import SmartLeadForm from "@/components/lead/SmartLeadForm";
import FAQStatic from "@/components/home-v5/FAQStatic";
import { contactFaqs } from "./faqs";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

export default function ContactPage() {
  return (
    <div className="v5-shell">
      <V6Nav />
      <main>
        <SmartLeadForm
          formName="contact_form"
          formPath="/contact"
          defaultHeading="Let's talk."
          defaultInquiryType="general"
          ctaLabel="Send message"
        />
        <FAQStatic
          items={contactFaqs}
          heading="Before you reach out"
          bg="white"
          withSchema={false}
        />
      </main>
      <V6Footer />
    </div>
  );
}
