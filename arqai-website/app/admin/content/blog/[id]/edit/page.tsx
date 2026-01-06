"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import {
  KeywordResearchPanel,
  ContentSettings,
  ContentGenerator,
  SEOFieldsPanel,
  AIFieldWrapper,
  getDefaultSettings,
  getDefaultSEOFields,
  type ContentSettingsData,
  type SEOFieldsData,
} from "@/components/admin/seo";
import type { KeywordResearchResult } from "@/lib/dataforseo/types";

const categories = [
  "AI & Automation",
  "Compliance",
  "Security",
  "Enterprise",
  "Industry News",
  "Product Updates",
  "Best Practices",
];

type EditorStep = "research" | "settings" | "content";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<EditorStep>("content");
  const [seoData, setSeoData] = useState<KeywordResearchResult | null>(null);
  const [contentSettings, setContentSettings] = useState<ContentSettingsData>(getDefaultSettings());
  const [seoFields, setSeoFields] = useState<SEOFieldsData>(getDefaultSEOFields());
  const [showSEOPanel, setShowSEOPanel] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category: "",
    tags: [] as string[],
    author: "ArqAI Team",
    status: "draft" as "draft" | "published",
    published_at: null as string | null,
  });
  const [tagInput, setTagInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/admin/content/blog/${postId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.item) {
            setFormData({
              title: data.item.title || "",
              slug: data.item.slug || "",
              excerpt: data.item.excerpt || "",
              content: data.item.content || "",
              featured_image: data.item.featured_image || "",
              category: data.item.category || "",
              tags: data.item.tags || [],
              author: data.item.author || "ArqAI Team",
              status: data.item.status || "draft",
              published_at: data.item.published_at || null,
            });
            // Load existing SEO fields
            setSeoFields({
              focusKeyword: data.item.focus_keyword || "",
              metaTitle: data.item.meta_title || "",
              metaDescription: data.item.meta_description || "",
              secondaryKeywords: data.item.secondary_keywords || [],
              faqSchema: data.item.faq_schema || [],
              keyEntities: data.item.key_entities || [],
              ogTitle: data.item.og_title || "",
              ogDescription: data.item.og_description || "",
            });
            // If there's a focus keyword, start in content step
            if (data.item.focus_keyword) {
              setCurrentStep("content");
            }
          }
        } else {
          alert("Failed to load blog post");
          router.push("/admin/content");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to load blog post");
        router.push("/admin/content");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [postId, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleKeywordConfirmed = (keyword: string, data: KeywordResearchResult | null) => {
    setSeoData(data);
    setSeoFields(prev => ({ ...prev, focusKeyword: keyword }));
    setCurrentStep("settings");
  };

  const handleContentGenerated = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    setCurrentStep("content");
  };

  const handleOutlineGenerated = (_outline: string) => {
    // Outline is shown in the ContentGenerator component
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
    }));
  };

  const generateTitle = async () => {
    if (!seoFields.focusKeyword) {
      alert("Please complete keyword research first");
      return;
    }

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "title",
          topic: seoFields.focusKeyword,
          focusKeyword: seoFields.focusKeyword,
          seoData,
          toneId: contentSettings.toneId,
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

  const handleFeaturedImageUpload = useCallback(async (file: File) => {
    setIsUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "blog-featured");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setFormData(prev => ({ ...prev, featured_image: data.url }));
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFeaturedImageUpload(file);
    }
  }, [handleFeaturedImageUpload]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (publishStatus: "draft" | "published") => {
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/content/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          ...formData,
          status: publishStatus,
          slug: formData.slug || generateSlug(formData.title),
          // SEO fields
          meta_title: seoFields.metaTitle,
          meta_description: seoFields.metaDescription,
          focus_keyword: seoFields.focusKeyword,
          secondary_keywords: seoFields.secondaryKeywords,
          faq_schema: seoFields.faqSchema,
          key_entities: seoFields.keyEntities,
          og_title: seoFields.ogTitle,
          og_description: seoFields.ogDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/content");
      } else {
        alert(data.error || "Failed to update blog post");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/content" className="flex items-center text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-gray-700" />
              <Image src="/img/ArqAI-logo.png" alt="ArqAI" width={100} height={32} className="h-7 w-auto" />
              <span className="text-sm font-medium text-slate-500 dark:text-gray-400">Edit Blog Post</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSEOPanel(!showSEOPanel)}
                className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                  showSEOPanel
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-slate-100 text-slate-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                SEO Tools
              </button>
              <Link
                href={`/blog/${formData.slug}`}
                target="_blank"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600"
              >
                Preview
              </Link>
              <button
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit("published")}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : formData.status === "published" ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Column - SEO Tools */}
          {showSEOPanel && (
            <div className="w-[420px] flex-shrink-0 space-y-4">
              {/* Step Progress */}
              <div className="flex items-center gap-2 text-sm mb-2">
                <button
                  onClick={() => setCurrentStep("research")}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    currentStep === "research"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : seoData || seoFields.focusKeyword
                      ? "text-green-600 dark:text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  {(seoData || seoFields.focusKeyword) && currentStep !== "research" ? "✓" : "1."} Research
                </button>
                <span className="text-slate-300">→</span>
                <button
                  onClick={() => (seoData || seoFields.focusKeyword) && setCurrentStep("settings")}
                  disabled={!seoData && !seoFields.focusKeyword}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    currentStep === "settings"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : currentStep === "content"
                      ? "text-green-600 dark:text-green-400"
                      : "text-slate-400"
                  }`}
                >
                  {currentStep === "content" ? "✓" : "2."} Settings
                </button>
                <span className="text-slate-300">→</span>
                <button
                  onClick={() => (seoData || seoFields.focusKeyword) && setCurrentStep("content")}
                  disabled={!seoData && !seoFields.focusKeyword}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    currentStep === "content"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-slate-400"
                  }`}
                >
                  3. Generate
                </button>
              </div>

              {/* Step Content */}
              {currentStep === "research" && (
                <KeywordResearchPanel
                  onKeywordConfirmed={handleKeywordConfirmed}
                  initialKeyword={seoFields.focusKeyword}
                />
              )}

              {currentStep === "settings" && (
                <ContentSettings
                  settings={contentSettings}
                  onChange={setContentSettings}
                />
              )}

              {currentStep === "settings" && (
                <ContentGenerator
                  focusKeyword={seoFields.focusKeyword}
                  seoData={seoData}
                  settings={contentSettings}
                  onContentGenerated={handleContentGenerated}
                  onOutlineGenerated={handleOutlineGenerated}
                />
              )}

              {currentStep === "content" && (
                <>
                  <ContentGenerator
                    focusKeyword={seoFields.focusKeyword}
                    seoData={seoData}
                    settings={contentSettings}
                    onContentGenerated={handleContentGenerated}
                    onOutlineGenerated={handleOutlineGenerated}
                  />
                  <SEOFieldsPanel
                    fields={seoFields}
                    onChange={setSeoFields}
                    seoData={seoData}
                    toneId={contentSettings.toneId}
                  />
                </>
              )}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title with AI Generate */}
            <AIFieldWrapper
              label=""
              onGenerate={generateTitle}
              generateDisabled={!seoFields.focusKeyword}
            >
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="w-full text-4xl font-bold bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-gray-600 text-slate-900 dark:text-white"
              />
            </AIFieldWrapper>

            {/* Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-4 overflow-hidden">
              <TiptapEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Start writing your blog post... or use AI to generate content"
              />
            </div>
          </div>

          {/* Right Sidebar - Post Settings */}
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Post Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Post Settings</h3>

              {/* Status Indicator */}
              <div className="mb-4 p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${formData.status === "published" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300 capitalize">{formData.status}</span>
                </div>
                {formData.published_at && (
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    Published: {new Date(formData.published_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="url-friendly-slug"
                />
              </div>

              {/* Excerpt */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Brief summary..."
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 text-sm"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900 dark:hover:text-blue-100"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Featured Image</h3>

              {formData.featured_image ? (
                <div className="relative">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, featured_image: "" }))}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label
                  className="block cursor-pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-gray-600 hover:border-blue-400"
                  }`}>
                    {isUploadingImage ? (
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{isDragging ? "Drop here" : "Click or drag"}</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFeaturedImageUpload(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
