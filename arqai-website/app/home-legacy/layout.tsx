import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home (legacy)",
  robots: { index: false, follow: false },
};

export default function HomeLegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
