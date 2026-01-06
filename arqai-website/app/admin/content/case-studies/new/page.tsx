"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AIGenerateButton } from "@/components/admin/seo/AIGenerateButton";

const industries = [
  "Healthcare",
  "Financial Services",
  "Manufacturing",
  "Retail",
  "Technology",
  "Government",
  "Energy",
  "Telecommunications",
];

interface Metric {
  label: string;
  value: string;
  description: string;
}

interface ChallengePoint {
  text: string;
}

interface SolutionPoint {
  text: string;
}

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client_name: "",
    industry: "",
    hero_image: "",
    overview: "",
    challenge_description: "",
    challenge_points: [] as ChallengePoint[],
    solution_description: "",
    solution_points: [] as SolutionPoint[],
    metrics: [] as Metric[],
    impact_summary: "",
    testimonial_quote: "",
    testimonial_author_name: "",
    testimonial_author_title: "",
    testimonial_author_company: "",
    testimonial_author_photo: "",
    status: "draft" as "draft" | "published",
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
          type: "casestudy_title",
          client_name: formData.client_name,
          industry: formData.industry,
          overview: formData.overview,
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

  const generateOverview = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "casestudy_overview",
          client_name: formData.client_name,
          industry: formData.industry,
          challenge_description: formData.challenge_description,
          solution_description: formData.solution_description,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setFormData(prev => ({ ...prev, overview: data.result }));
      }
    } catch (error) {
      console.error("Overview generation error:", error);
    }
  };

  const generateChallenge = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "casestudy_challenge",
          client_name: formData.client_name,
          industry: formData.industry,
          overview: formData.overview,
        }),
      });
      const data = await response.json();
      if (data.result) {
        // Parse the response to extract description and points
        const descMatch = data.result.match(/DESCRIPTION:\s*([\s\S]*?)(?=POINTS:|$)/);
        const pointsMatch = data.result.match(/POINTS:\s*([\s\S]*)/);

        if (descMatch) {
          setFormData(prev => ({ ...prev, challenge_description: descMatch[1].trim() }));
        }
        if (pointsMatch) {
          const points = pointsMatch[1]
            .split("\n")
            .map((line: string) => line.replace(/^[-•]\s*/, "").trim())
            .filter((line: string) => line.length > 0)
            .slice(0, 5)
            .map((text: string) => ({ text }));
          setFormData(prev => ({ ...prev, challenge_points: points }));
        }
      }
    } catch (error) {
      console.error("Challenge generation error:", error);
    }
  };

  const generateSolution = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "casestudy_solution",
          client_name: formData.client_name,
          industry: formData.industry,
          challenge_description: formData.challenge_description,
          overview: formData.overview,
        }),
      });
      const data = await response.json();
      if (data.result) {
        // Parse the response to extract description and points
        const descMatch = data.result.match(/DESCRIPTION:\s*([\s\S]*?)(?=POINTS:|$)/);
        const pointsMatch = data.result.match(/POINTS:\s*([\s\S]*)/);

        if (descMatch) {
          setFormData(prev => ({ ...prev, solution_description: descMatch[1].trim() }));
        }
        if (pointsMatch) {
          const points = pointsMatch[1]
            .split("\n")
            .map((line: string) => line.replace(/^[-•]\s*/, "").trim())
            .filter((line: string) => line.length > 0)
            .slice(0, 5)
            .map((text: string) => ({ text }));
          setFormData(prev => ({ ...prev, solution_points: points }));
        }
      }
    } catch (error) {
      console.error("Solution generation error:", error);
    }
  };

  const generateImpact = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "casestudy_impact",
          client_name: formData.client_name,
          industry: formData.industry,
          solution_description: formData.solution_description,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setFormData(prev => ({ ...prev, impact_summary: data.result }));
      }
    } catch (error) {
      console.error("Impact generation error:", error);
    }
  };

  const generateTestimonial = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "casestudy_testimonial",
          client_name: formData.client_name,
          industry: formData.industry,
          overview: formData.overview,
          solution_description: formData.solution_description,
        }),
      });
      const data = await response.json();
      if (data.result) {
        setFormData(prev => ({ ...prev, testimonial_quote: data.result }));
      }
    } catch (error) {
      console.error("Testimonial generation error:", error);
    }
  };

  const generateMetrics = async () => {
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "casestudy_metrics",
          client_name: formData.client_name,
          industry: formData.industry,
          overview: formData.overview,
          solution_description: formData.solution_description,
        }),
      });
      const data = await response.json();
      if (data.result && Array.isArray(data.result)) {
        setFormData(prev => ({ ...prev, metrics: data.result.slice(0, 6) }));
      }
    } catch (error) {
      console.error("Metrics generation error:", error);
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

  const handleImageUpload = useCallback(async (file: File, field: "hero_image" | "testimonial_author_photo") => {
    setIsUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "case-studies");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.url) {
        setFormData(prev => ({ ...prev, [field]: data.url }));
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

  // Challenge points
  const addChallengePoint = () => {
    if (formData.challenge_points.length < 5) {
      setFormData(prev => ({
        ...prev,
        challenge_points: [...prev.challenge_points, { text: "" }],
      }));
    }
  };

  const updateChallengePoint = (index: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      challenge_points: prev.challenge_points.map((p, i) => i === index ? { text } : p),
    }));
  };

  const removeChallengePoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      challenge_points: prev.challenge_points.filter((_, i) => i !== index),
    }));
  };

  // Solution points
  const addSolutionPoint = () => {
    if (formData.solution_points.length < 5) {
      setFormData(prev => ({
        ...prev,
        solution_points: [...prev.solution_points, { text: "" }],
      }));
    }
  };

  const updateSolutionPoint = (index: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      solution_points: prev.solution_points.map((p, i) => i === index ? { text } : p),
    }));
  };

  const removeSolutionPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      solution_points: prev.solution_points.filter((_, i) => i !== index),
    }));
  };

  // Metrics
  const addMetric = () => {
    if (formData.metrics.length < 6) {
      setFormData(prev => ({
        ...prev,
        metrics: [...prev.metrics, { label: "", value: "", description: "" }],
      }));
    }
  };

  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (publishStatus: "draft" | "published") => {
    if (!formData.title.trim() || !formData.client_name.trim()) {
      alert("Please enter a title and client name");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/content/case-studies", {
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
        alert(data.error || "Failed to create case study");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create case study");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/content" className="flex items-center text-slate-600 hover:text-slate-900">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <div className="h-6 w-px bg-slate-200" />
              <span className="font-semibold text-slate-900">New Case Study</span>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-4 border-b">Header Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Case Study Title *</label>
                <AIGenerateButton onClick={generateTitle} title="Generate title with AI" />
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Healthcare AI Transformation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client/Company Name *</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Regional Health Network"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select industry</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
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
          </div>

          {/* Hero Image */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Image</label>
            {formData.hero_image ? (
              <div className="relative inline-block">
                <img src={formData.hero_image} alt="Hero" className="h-32 rounded-lg object-cover" />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, hero_image: "" }))}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="inline-block cursor-pointer">
                <div className="border-2 border-dashed border-slate-200 rounded-lg px-8 py-6 text-center hover:border-blue-400 transition-colors">
                  <svg className="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-slate-600">Upload hero image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "hero_image");
                  }}
                />
              </label>
            )}
          </div>

          {/* Featured checkbox */}
          <div className="mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Featured case study (show on homepage)</span>
            </label>
          </div>
        </section>

        {/* Overview Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <AIGenerateButton onClick={generateOverview} title="Generate overview with AI" />
          </div>
          <textarea
            value={formData.overview}
            onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Brief overview of the case study (1-2 paragraphs)..."
          />
        </section>

        {/* Challenge Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">The Challenge</h2>
            <AIGenerateButton onClick={generateChallenge} title="Generate challenge section with AI" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Challenge Description</label>
              <textarea
                value={formData.challenge_description}
                onChange={(e) => setFormData(prev => ({ ...prev, challenge_description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Describe the main challenges the client was facing..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Key Challenge Points (max 5)</label>
              {formData.challenge_points.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={point.text}
                    onChange={(e) => updateChallengePoint(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Challenge point ${index + 1}`}
                  />
                  <button
                    onClick={() => removeChallengePoint(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              {formData.challenge_points.length < 5 && (
                <button
                  onClick={addChallengePoint}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add challenge point
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Our Solution</h2>
            <AIGenerateButton onClick={generateSolution} title="Generate solution section with AI" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Solution Description</label>
              <textarea
                value={formData.solution_description}
                onChange={(e) => setFormData(prev => ({ ...prev, solution_description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Describe how ArqAI addressed the challenges..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Key Solution Points (max 5)</label>
              {formData.solution_points.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={point.text}
                    onChange={(e) => updateSolutionPoint(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Solution point ${index + 1}`}
                  />
                  <button
                    onClick={() => removeSolutionPoint(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              {formData.solution_points.length < 5 && (
                <button
                  onClick={addSolutionPoint}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add solution point
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Key Metrics (max 6)</h2>
            <AIGenerateButton onClick={generateMetrics} title="Generate metrics with AI" />
          </div>
          <div className="space-y-4">
            {formData.metrics.map((metric, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-slate-500">Metric {index + 1}</span>
                  <button
                    onClick={() => removeMetric(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => updateMetric(index, "label", e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Label (e.g., Cost Reduction)"
                  />
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => updateMetric(index, "value", e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Value (e.g., 40%)"
                  />
                  <input
                    type="text"
                    value={metric.description}
                    onChange={(e) => updateMetric(index, "description", e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description"
                  />
                </div>
              </div>
            ))}
            {formData.metrics.length < 6 && (
              <button
                onClick={addMetric}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add Metric
              </button>
            )}
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Impact Summary</h2>
            <AIGenerateButton onClick={generateImpact} title="Generate impact summary with AI" />
          </div>
          <textarea
            value={formData.impact_summary}
            onChange={(e) => setFormData(prev => ({ ...prev, impact_summary: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Summarize the overall impact and results achieved..."
          />
        </section>

        {/* Testimonial Section */}
        <section className="bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-4 border-b">Client Testimonial</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Quote</label>
                <AIGenerateButton onClick={generateTestimonial} title="Generate testimonial quote with AI" />
              </div>
              <textarea
                value={formData.testimonial_quote}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonial_quote: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="&quot;The testimonial quote from the client...&quot;"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author Name</label>
                <input
                  type="text"
                  value={formData.testimonial_author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, testimonial_author_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.testimonial_author_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, testimonial_author_title: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chief Technology Officer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.testimonial_author_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, testimonial_author_company: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Company Name"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
