"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AIGenerateButton } from "@/components/admin/seo/AIGenerateButton";

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona (MST)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const durations = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const statusOptions = [
  { value: "upcoming", label: "Upcoming", description: "Scheduled for the future" },
  { value: "live", label: "Live Now", description: "Currently in progress" },
  { value: "on-demand", label: "On-Demand", description: "Recording available" },
  { value: "past", label: "Past", description: "Completed, no recording" },
];

interface Presenter {
  name: string;
  title: string;
  company: string;
  photo: string;
}

export default function NewWebinarPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadingPresenterIndex, setUploadingPresenterIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    banner_image: "",
    webinar_date: "",
    webinar_time: "",
    duration: 60,
    timezone: "America/New_York",
    presenters: [{ name: "", title: "", company: "", photo: "" }] as Presenter[],
    learning_points: [""],
    registration_url: "",
    recording_url: "",
    status: "upcoming" as "upcoming" | "live" | "on-demand" | "past",
    featured: false,
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
          type: "webinar_title",
          title: formData.title,
          description: formData.description,
          topic: formData.title || formData.description,
          presenters: formData.presenters.map(p => p.name).filter(Boolean).join(", "),
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
          type: "webinar_description",
          title: formData.title,
          topic: formData.title,
          presenters: formData.presenters.map(p => `${p.name} (${p.title} at ${p.company})`).filter(p => p !== "( at )").join(", "),
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

  const generateLearningPoints = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "webinar_learning_points",
          title: formData.title,
          description: formData.description,
          topic: formData.title,
        }),
      });
      const data = await response.json();
      if (data.result) {
        // Parse the response to extract bullet points
        const points = data.result
          .split("\n")
          .map((line: string) => line.replace(/^[-•]\s*/, "").trim())
          .filter((line: string) => line.length > 0)
          .slice(0, 6);
        if (points.length > 0) {
          setFormData(prev => ({ ...prev, learning_points: points }));
        }
      }
    } catch (error) {
      console.error("Learning points generation error:", error);
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

  const handleBannerUpload = useCallback(async (file: File) => {
    setIsUploadingBanner(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "webinar-banners");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setFormData(prev => ({ ...prev, banner_image: data.url }));
      } else {
        alert(data.error || "Failed to upload banner image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload banner image");
    } finally {
      setIsUploadingBanner(false);
    }
  }, []);

  const handlePresenterPhotoUpload = useCallback(async (file: File, index: number) => {
    setUploadingPresenterIndex(index);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "presenter-photos");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setFormData(prev => {
          const newPresenters = [...prev.presenters];
          newPresenters[index] = { ...newPresenters[index], photo: data.url };
          return { ...prev, presenters: newPresenters };
        });
      } else {
        alert(data.error || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo");
    } finally {
      setUploadingPresenterIndex(null);
    }
  }, []);

  // Presenter management
  const addPresenter = () => {
    if (formData.presenters.length < 5) {
      setFormData(prev => ({
        ...prev,
        presenters: [...prev.presenters, { name: "", title: "", company: "", photo: "" }],
      }));
    }
  };

  const removePresenter = (index: number) => {
    if (formData.presenters.length > 1) {
      setFormData(prev => ({
        ...prev,
        presenters: prev.presenters.filter((_, i) => i !== index),
      }));
    }
  };

  const updatePresenter = (index: number, field: keyof Presenter, value: string) => {
    setFormData(prev => {
      const newPresenters = [...prev.presenters];
      newPresenters[index] = { ...newPresenters[index], [field]: value };
      return { ...prev, presenters: newPresenters };
    });
  };

  // Learning points management
  const addLearningPoint = () => {
    if (formData.learning_points.length < 6) {
      setFormData(prev => ({
        ...prev,
        learning_points: [...prev.learning_points, ""],
      }));
    }
  };

  const removeLearningPoint = (index: number) => {
    if (formData.learning_points.length > 1) {
      setFormData(prev => ({
        ...prev,
        learning_points: prev.learning_points.filter((_, i) => i !== index),
      }));
    }
  };

  const updateLearningPoint = (index: number, value: string) => {
    setFormData(prev => {
      const newPoints = [...prev.learning_points];
      newPoints[index] = value;
      return { ...prev, learning_points: newPoints };
    });
  };

  const handleSubmit = async (publishStatus: "draft" | "upcoming" | "on-demand") => {
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!formData.webinar_date) {
      alert("Please select a date");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time
      const dateTime = formData.webinar_time
        ? `${formData.webinar_date}T${formData.webinar_time}:00`
        : `${formData.webinar_date}T09:00:00`;

      // Filter out empty presenters and learning points
      const filteredPresenters = formData.presenters.filter(p => p.name.trim());
      const filteredLearningPoints = formData.learning_points.filter(p => p.trim());

      const response = await fetch("/api/admin/content/webinars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          description: formData.description,
          banner_image: formData.banner_image,
          webinar_date: dateTime,
          duration: formData.duration,
          timezone: formData.timezone,
          presenters: filteredPresenters,
          learning_points: filteredLearningPoints,
          registration_url: formData.registration_url,
          recording_url: formData.recording_url,
          status: publishStatus === "draft" ? "draft" : publishStatus,
          featured: formData.featured,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/content");
      } else {
        alert(data.error || "Failed to create webinar");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create webinar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/content" className="flex items-center text-slate-600 hover:text-slate-900">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <span className="font-semibold text-slate-900">New Webinar</span>
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
                onClick={() => handleSubmit(formData.recording_url ? "on-demand" : "upcoming")}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Webinar Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Title *</label>
                  <AIGenerateButton onClick={generateTitle} title="Generate title with AI" />
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., AI-Powered Compliance: A Live Demo"
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
                <label className="flex items-center gap-2 h-full pt-6">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Featured webinar (shows in mega menu)</span>
                </label>
              </div>
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
                placeholder="Describe what attendees will learn and why they should join..."
              />
            </div>
          </div>
        </section>

        {/* Date & Time */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Schedule</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                value={formData.webinar_date}
                onChange={(e) => setFormData(prev => ({ ...prev, webinar_date: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.webinar_time}
                onChange={(e) => setFormData(prev => ({ ...prev, webinar_time: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {durations.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Banner Image */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Banner Image</h2>
          <p className="text-sm text-slate-500 mb-4">This image will be displayed on the webinar page. Recommended: 1920x1080px</p>

          {formData.banner_image ? (
            <div className="relative inline-block w-full">
              <img
                src={formData.banner_image}
                alt="Banner"
                className="w-full h-64 rounded-lg object-cover shadow-md"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, banner_image: "" }))}
                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                {isUploadingBanner ? (
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium">Click to upload banner image</p>
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
                  if (file) handleBannerUpload(file);
                }}
              />
            </label>
          )}
        </section>

        {/* Presenters */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Presenters</h2>
            <button
              onClick={addPresenter}
              disabled={formData.presenters.length >= 5}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Presenter
            </button>
          </div>

          <div className="space-y-6">
            {formData.presenters.map((presenter, index) => (
              <div key={index} className="relative p-4 bg-slate-50 rounded-lg">
                {formData.presenters.length > 1 && (
                  <button
                    onClick={() => removePresenter(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div className="flex gap-4">
                  {/* Photo Upload */}
                  <div className="flex-shrink-0">
                    {presenter.photo ? (
                      <div className="relative">
                        <img
                          src={presenter.photo}
                          alt={presenter.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <button
                          onClick={() => updatePresenter(index, "photo", "")}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors">
                          {uploadingPresenterIndex === index ? (
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePresenterPhotoUpload(file, index);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Presenter Details */}
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={presenter.name}
                        onChange={(e) => updatePresenter(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={presenter.title}
                        onChange={(e) => updatePresenter(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VP of Engineering"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
                      <input
                        type="text"
                        value={presenter.company}
                        onChange={(e) => updatePresenter(index, "company", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ArqAI"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">What You&apos;ll Learn</h2>
            <div className="flex items-center gap-2">
              <AIGenerateButton onClick={generateLearningPoints} title="Generate learning points with AI" />
              <button
                onClick={addLearningPoint}
                disabled={formData.learning_points.length >= 6}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Point
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {formData.learning_points.map((point, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-2">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updateLearningPoint(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Key takeaway attendees will gain..."
                />
                {formData.learning_points.length > 1 && (
                  <button
                    onClick={() => removeLearningPoint(index)}
                    className="p-2 text-slate-400 hover:text-red-500 mt-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Registration & Recording Links */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Registration & Recording</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration URL</label>
              <p className="text-xs text-slate-500 mb-2">Link to your webinar platform (Zoom, Teams, etc.) where attendees will register</p>
              <input
                type="url"
                value={formData.registration_url}
                onChange={(e) => setFormData(prev => ({ ...prev, registration_url: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://zoom.us/webinar/register/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recording URL (Optional)</label>
              <p className="text-xs text-slate-500 mb-2">Add after the webinar ends to make it on-demand</p>
              <input
                type="url"
                value={formData.recording_url}
                onChange={(e) => setFormData(prev => ({ ...prev, recording_url: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </section>

        {/* Status Info */}
        <section className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Status Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusOptions.map(status => (
              <div key={status.value} className="text-sm">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${
                  status.value === "upcoming" ? "bg-blue-100 text-blue-700" :
                  status.value === "live" ? "bg-green-100 text-green-700" :
                  status.value === "on-demand" ? "bg-purple-100 text-purple-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {status.label}
                </span>
                <p className="text-slate-500 text-xs">{status.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
