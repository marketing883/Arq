"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ContentType = "blog" | "case-studies" | "whitepapers" | "webinars";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at?: string;
  created_at: string;
  category?: string;
  industry?: string;
  excerpt?: string;
  client_name?: string;
  webinar_date?: string;
}

export default function ContentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>("blog");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const fetchContent = async (type: ContentType) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/content/${type}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push(`/admin/content/${activeTab}/new`);
  };

  const handleEdit = (item: ContentItem) => {
    router.push(`/admin/content/${activeTab}/${item.id}/edit`);
  };

  const handleView = (item: ContentItem) => {
    const basePath = activeTab === "blog" ? "/blog" : `/${activeTab}`;
    window.open(`${basePath}/${item.slug}`, "_blank");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/content/${activeTab}?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const tabs: { id: ContentType; label: string; icon: JSX.Element; description: string }[] = [
    {
      id: "blog",
      label: "Blog Posts",
      description: "Articles and updates",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    },
    {
      id: "case-studies",
      label: "Case Studies",
      description: "Client success stories",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      id: "whitepapers",
      label: "Whitepapers",
      description: "Downloadable resources",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    },
    {
      id: "webinars",
      label: "Webinars",
      description: "Live & on-demand events",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "live":
        return "bg-red-100 text-red-700";
      case "on-demand":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getItemSubtitle = (item: ContentItem) => {
    if (activeTab === "case-studies" && item.client_name) {
      return item.client_name;
    }
    if (activeTab === "webinars" && item.webinar_date) {
      return formatDate(item.webinar_date);
    }
    if (item.category) {
      return item.category;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center">
                <Image src="/img/ArqAI-logo.png" alt="ArqAI" width={120} height={40} className="h-8 w-auto" priority />
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
                <span className="text-xs font-medium text-white">Content Management</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Content Management</h1>
          <p className="text-slate-600 mt-1">Create and manage blog posts, case studies, and resources</p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start gap-1 p-4 rounded-md text-left transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </div>
              <span className={`text-xs ${activeTab === tab.id ? "text-blue-100" : "text-slate-400"}`}>
                {tab.description}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
          {/* Action Bar */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 capitalize">{activeTab.replace("-", " ")}</h2>
              <p className="text-sm text-slate-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </button>
          </div>

          {/* Content List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">No {activeTab.replace("-", " ")} yet</p>
              <p className="text-sm text-slate-400 mt-1 mb-6">Get started by creating your first item</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First {activeTab === "blog" ? "Blog Post" : activeTab === "case-studies" ? "Case Study" : activeTab === "whitepapers" ? "Whitepaper" : "Webinar"}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-slate-900 truncate">{item.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        {getItemSubtitle(item) && (
                          <>
                            <span>{getItemSubtitle(item)}</span>
                            <span className="text-slate-300">•</span>
                          </>
                        )}
                        <span>{formatDate(item.published_at || item.created_at)}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 truncate max-w-[200px]">/{item.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* View */}
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View live"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/admin/content/${tab.id}/new`}
              className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-md hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <span className="text-slate-500 group-hover:text-blue-600 transition-colors">
                  {tab.icon}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                  New {tab.id === "blog" ? "Post" : tab.id === "case-studies" ? "Case Study" : tab.id === "whitepapers" ? "Whitepaper" : "Webinar"}
                </p>
                <p className="text-xs text-slate-400">Create new content</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
