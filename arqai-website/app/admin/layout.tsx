import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | ArqAI",
  description: "ArqAI admin dashboard for lead management and analytics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
