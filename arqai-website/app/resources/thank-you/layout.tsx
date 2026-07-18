import type { Metadata } from "next";

// Token-based download confirmation page — not for search indexes.
export const metadata: Metadata = {
  title: "Your download",
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
