"use client";

import V6Nav from "@/components/v6/V6Nav";
import V6Footer from "@/components/v6/V6Footer";
import SmartLeadForm from "@/components/lead/SmartLeadForm";
import FAQStatic from "@/components/home-v5/FAQStatic";
import { engageFaqs } from "./faqs";
import "@/components/v6/v6.css";
import "@/components/home-v5/styles.css";

export default function EngageUsPage() {
  return (
    <div className="v5-shell">
      <V6Nav />
      <main>
        <SmartLeadForm
          formName="engagement_form"
          formPath="/engage-us"
          defaultHeading="Book a demo."
          defaultInquiryType="demo"
          ctaLabel="Book a demo"
        />
        <FAQStatic
          items={engageFaqs}
          heading="What to expect"
          bg="white"
          withSchema={false}
        />
      </main>
      <V6Footer />
    </div>
  );
}
