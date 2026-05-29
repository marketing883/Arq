"use client";

import { useState } from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  showExport?: boolean;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  onRefresh,
  showExport = false,
  actions,
}: AdminHeaderProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/admin/export?type=all");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `all-leads-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}

            {showExport && (
              <button
                onClick={handleExportAll}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
