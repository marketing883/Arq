import type { Metadata } from "next";
import RetailClient from "./RetailClient";

export const metadata: Metadata = {
  title: "AI for Retail: Loyalty, Pricing & Customer Service",
  description:
    "Production AI for retail operations — loyalty intelligence, pricing and promotion decisions, and customer-service automation grounded in your commerce stack.",
  alternates: { canonical: "https://thearq.ai/industries/retail" },
  openGraph: {
    title: "AI for Retail: Loyalty, Pricing & Customer Service | ArqAI Labs",
    description:
      "Production AI for retail operations — loyalty intelligence, pricing and promotion decisions, and customer-service automation grounded in your commerce stack.",
    url: "https://thearq.ai/industries/retail",
  },
};

export default function RetailPage() {
  return <RetailClient />;
}
