"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AIGenerateButton } from "@/components/admin/seo/AIGenerateButton";

const categories = ["Technical", "Business", "Research", "Guide", "Industry Report"];

export default function NewWhitepaperPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
    file_url: "",
    category: "",
    status: "draft" as "draft" | "published",
    gated: true,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // AI Generation Functions
  const generateTitle = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whitepaper_title",
          title: formData.title,
          description: formData.description,
          topic: formData.title || formData.description,
          category: formData.category,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setFormData(prev => ({
          ...prev,
          title: data.result,
          slug: prev.slug || generateSlug(data.result),
        }));
      }
    } catch (error) {
      console.error("Title generation error:", error);
    }
  };

  const generateDescription = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whitepaper_description",
          title: formData.title,
          topic: formData.title,
          category: formData.category,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setFormData(prev => ({ ...prev, description: data.result }));
      }
    } catch (error) {
      console.error("Description generation error:", error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleCoverUpload = useCallback(async (file: File) => {
    setIsUploadingCover(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "whitepaper-covers");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setFormData(prev => ({ ...prev, cover_image: data.url }));
      } else {
        alert(data.error || "Failed to upload cover image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploadingFile(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "whitepaper-files");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setFormData(prev => ({ ...prev, file_url: data.url }));
      } else {
        alert(data.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploadingFile(false);
    }
  }, []);

  const handleSubmit = async (publishStatus: "draft" | "published") => {
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/content/whitepapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: publishStatus,
          slug: formData.slug || generateSlug(formData.title),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/content");
      } else {
        alert(data.error || "Failed to create whitepaper");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create whitepaper");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/content" className="flex items-center text-slate-600 hover:text-slate-900">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <span className="font-semibold text-slate-900">New Whitepaper</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit("published")}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Whitepaper Details</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Title *</label>
                <AIGenerateButton onClick={generateTitle} title="Generate title with AI" />
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., The Enterprise AI Governance Playbook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="url-friendly-slug"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <AIGenerateButton onClick={generateDescription} title="Generate description with AI" />
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Brief description of the whitepaper (shown on download cards)..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.gated}
                  onChange={(e) => setFormData(prev => ({ ...prev, gated: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Gated content (requires lead capture form)</span>
              </label>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Cover Image</h2>
          <p className="text-sm text-slate-500 mb-4">This image will be displayed on the homepage whitepaper section and download cards.</p>

          {formData.cover_image ? (
            <div className="relative inline-block">
              <img
                src={formData.cover_image}
                alt="Cover"
                className="h-64 rounded-lg object-cover shadow-md"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, cover_image: "" }))}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                {isUploadingCover ? (
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium">Click to upload cover image</p>
                    <p className="text-sm text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
              />
            </label>
          )}
        </section>

        {/* PDF File */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">PDF File</h2>
          <p className="text-sm text-slate-500 mb-4">Upload the whitepaper PDF that users will download.</p>

          {formData.file_url ? (
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">PDF Uploaded</p>
                <p className="text-sm text-green-600 truncate">{formData.file_url.split("/").pop()}</p>
              </div>
              <button
                onClick={() => setFormData(prev => ({ ...prev, file_url: "" }))}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                {isUploadingFile ? (
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium">Click to upload PDF</p>
                    <p className="text-sm text-slate-400 mt-1">PDF up to 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
          )}
        </section>
      </main>
    </div>
  );
}
