"use client";

/**
 * Slim link-tab bar shared by admin sections whose sub-pages were consolidated
 * from separate sidebar links (Inbox, Content, Hiring, Insights). Rendered by
 * each section's layout so the sidebar can stay at one link per section.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SectionTab {
  name: string;
  href: string;
  /** Also mark active for these prefixes (e.g. nested edit pages). */
  match?: string[];
}

const SECTIONS: Record<string, { label: string; tabs: SectionTab[] }> = {
  leads: {
    label: "Leads",
    tabs: [
      { name: "Pipeline", href: "/admin/leads-v2" },
      { name: "Alerts", href: "/admin/alerts" },
      { name: "Chats", href: "/admin/chats" },
    ],
  },
  inbox: {
    label: "Inbox",
    tabs: [
      { name: "Contacts", href: "/admin/contacts" },
      { name: "Partners", href: "/admin/partners" },
      { name: "Downloads", href: "/admin/resources" },
      { name: "Subscribers", href: "/admin/subscribers" },
    ],
  },
  content: {
    label: "Content",
    tabs: [
      { name: "Blog", href: "/admin/content", match: ["/admin/content/blog"] },
      { name: "Case Studies", href: "/admin/content/case-studies" },
      { name: "Whitepapers", href: "/admin/content/whitepapers" },
      { name: "Webinars", href: "/admin/content/webinars" },
    ],
  },
  hiring: {
    label: "Hiring",
    tabs: [
      {
        name: "Job Postings",
        href: "/admin/jobs",
        match: ["/admin/jobs/new", "/admin/jobs/["],
      },
      { name: "Applications", href: "/admin/jobs/applications" },
    ],
  },
  insights: {
    label: "Insights",
    tabs: [
      { name: "Analytics", href: "/admin/analytics" },
      { name: "SEO", href: "/admin/seo" },
    ],
  },
};

function isTabActive(pathname: string, tab: SectionTab, tabs: SectionTab[]): boolean {
  if (pathname === tab.href) return true;
  if (tab.match?.some((m) => pathname.startsWith(m))) return true;
  // Prefix match, but only when no sibling matches more specifically.
  if (pathname.startsWith(tab.href + "/")) {
    const moreSpecific = tabs.some(
      (t) => t !== tab && t.href.length > tab.href.length && pathname.startsWith(t.href)
    );
    return !moreSpecific;
  }
  return false;
}

export default function SectionTabs({ section }: { section: keyof typeof SECTIONS | string }) {
  const pathname = usePathname() || "";
  const config = SECTIONS[section];
  if (!config) return null;

  return (
    <div className="bg-white border-b border-slate-200 px-5 pt-3">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {config.label}
      </p>
      <nav className="flex gap-1 -mb-px">
        {config.tabs.map((tab) => {
          const active = isTabActive(pathname, tab, config.tabs);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                active
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
