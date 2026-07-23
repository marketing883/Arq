"use client";

/**
 * Admin sidebar: six destinations, one per job to be done. Sub-views live as
 * tabs inside each section (see SectionTabs), so the sidebar stays scannable.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  /** Paths (prefixes) that should also light this item up. */
  match: string[];
  icon: React.ReactNode;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    items: [
      {
        name: "Home",
        href: "/admin",
        match: [],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        name: "Leads",
        href: "/admin/leads-v2",
        match: ["/admin/leads-v2", "/admin/alerts", "/admin/chats", "/admin/predictions"],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0 .656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        name: "Inbox",
        href: "/admin/contacts",
        match: [
          "/admin/contacts",
          "/admin/partners",
          "/admin/resources",
          "/admin/subscribers",
        ],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        ),
      },
      {
        name: "Content",
        href: "/admin/content",
        match: ["/admin/content"],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
      {
        name: "Hiring",
        href: "/admin/jobs",
        match: ["/admin/jobs"],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        name: "Insights",
        href: "/admin/analytics",
        match: ["/admin/analytics", "/admin/seo"],
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const isActive = (item: NavItem) => {
    if (item.href === "/admin") return pathname === "/admin";
    return (
      pathname.startsWith(item.href) ||
      item.match.some((m) => pathname.startsWith(m))
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image
              src="/img/ArqAI.png"
              alt="ArqAI"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          </div>
          {!collapsed && <span className="font-medium text-sm">ArqAI Admin</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navigation.map((group, gi) => (
          <div key={group.title || gi} className={gi > 0 ? "mt-6" : ""}>
            {!collapsed && group.title && (
              <h3 className="px-4 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded transition-colors text-[13px] ${
                        active
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <span className={active ? "text-white" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      {!collapsed && <span className="font-medium">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-2.5 py-2 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded transition-colors text-[13px] mb-1 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "View Site" : undefined}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {!collapsed && <span className="font-medium">View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 px-2.5 py-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors w-full text-[13px] ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
