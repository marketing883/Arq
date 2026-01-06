"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SEOIssue {
  type: "error" | "warning" | "info";
  message: string;
  recommendation: string;
}

interface ContentSEOScore {
  id: string;
  type: string;
  title: string;
  slug?: string;
  url: string;
  score: number;
  issues: SEOIssue[];
  hasMetaDescription: boolean;
  hasFeaturedImage: boolean;
  titleLength: number;
  descriptionLength: number;
  status: string;
}

interface SEOData {
  overview: {
    totalContent: number;
    averageScore: number;
    needsAttention: number;
    excellent: number;
    byType: {
      blog: number;
      caseStudy: number;
      whitepaper: number;
      webinar: number;
    };
  };
  content: ContentSEOScore[];
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600 bg-green-100 dark:bg-green-900/30";
  if (score >= 70) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
  if (score >= 50) return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
  return "text-red-600 bg-red-100 dark:bg-red-900/30";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

function IssueIcon({ type }: { type: "error" | "warning" | "info" }) {
  if (type === "error") {
    return (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (type === "warning") {
    return (
      <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function SEODashboardPage() {
  const [data, setData] = useState<SEOData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/seo/analyze");
      if (!response.ok) throw new Error("Failed to fetch SEO data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContent = data?.content.filter(
    item => selectedType === "all" || item.type === selectedType
  ) || [];

  const getEditUrl = (item: ContentSEOScore) => {
    switch (item.type) {
      case "blog":
        return `/admin/content/blog/${item.id}/edit`;
      case "case-study":
        return `/admin/content/case-studies/${item.id}/edit`;
      case "whitepaper":
        return `/admin/content/whitepapers/${item.id}/edit`;
      case "webinar":
        return `/admin/content/webinars/${item.id}/edit`;
      default:
        return "#";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchSEOData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Optimization Console</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Analyze and optimize your content for SEO, AEO, and GEO
            </p>
          </div>
          <button
            onClick={fetchSEOData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Analysis
          </button>
        </div>

        {/* Overview Cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Content</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.totalContent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreColor(data.overview.averageScore)}`}>
                  <span className="text-lg font-bold">{data.overview.averageScore}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getScoreLabel(data.overview.averageScore)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Needs Attention</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.needsAttention}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Excellent SEO</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overview.excellent}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Best Practices Guide */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-lg font-semibold mb-4">SEO/AEO/GEO Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">S</span>
                SEO (Search Engines)
              </h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Title: 50-60 characters</li>
                <li>Meta description: 150-160 chars</li>
                <li>Use H2 subheadings</li>
                <li>Add internal links</li>
                <li>Include featured image</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">A</span>
                AEO (Answer Engines)
              </h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Direct answers to questions</li>
                <li>FAQ sections in content</li>
                <li>Structured data markup</li>
                <li>Clear, concise definitions</li>
                <li>Topic tags/keywords</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">G</span>
                GEO (Generative AI)
              </h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>Specific data & statistics</li>
                <li>Authoritative sources</li>
                <li>Clear entity definitions</li>
                <li>Factual, verifiable claims</li>
                <li>Comprehensive coverage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Content" },
            { key: "blog", label: `Blog (${data?.overview.byType.blog || 0})` },
            { key: "case-study", label: `Case Studies (${data?.overview.byType.caseStudy || 0})` },
            { key: "whitepaper", label: `Whitepapers (${data?.overview.byType.whitepaper || 0})` },
            { key: "webinar", label: `Webinars (${data?.overview.byType.webinar || 0})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedType === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Issues
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContent.map(item => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.url}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                        {item.type.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-12 h-8 text-sm font-bold rounded-lg ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpandedItem(expandedItem === `${item.type}-${item.id}` ? null : `${item.type}-${item.id}`)}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <span className="flex items-center gap-1">
                          {item.issues.filter(i => i.type === "error").length > 0 && (
                            <span className="flex items-center gap-1 text-red-500">
                              <IssueIcon type="error" />
                              {item.issues.filter(i => i.type === "error").length}
                            </span>
                          )}
                          {item.issues.filter(i => i.type === "warning").length > 0 && (
                            <span className="flex items-center gap-1 text-yellow-500 ml-2">
                              <IssueIcon type="warning" />
                              {item.issues.filter(i => i.type === "warning").length}
                            </span>
                          )}
                          {item.issues.filter(i => i.type === "info").length > 0 && (
                            <span className="flex items-center gap-1 text-blue-500 ml-2">
                              <IssueIcon type="info" />
                              {item.issues.filter(i => i.type === "info").length}
                            </span>
                          )}
                        </span>
                        <svg className={`w-4 h-4 transition-transform ${expandedItem === `${item.type}-${item.id}` ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={getEditUrl(item)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredContent.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No content found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expanded Issues Panel */}
        {expandedItem && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO Recommendations for: {filteredContent.find(c => `${c.type}-${c.id}` === expandedItem)?.title}
            </h3>
            <div className="space-y-4">
              {filteredContent
                .find(c => `${c.type}-${c.id}` === expandedItem)
                ?.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      issue.type === "error"
                        ? "bg-red-50 dark:bg-red-900/20"
                        : issue.type === "warning"
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "bg-blue-50 dark:bg-blue-900/20"
                    }`}
                  >
                    <IssueIcon type={issue.type} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{issue.message}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.recommendation}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
