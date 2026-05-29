/**
 * Domain Research API
 *
 * Triggers AI-powered domain research for company intelligence.
 * Protected by admin authentication.
 *
 * POST /api/admin/research - Start research job
 * GET /api/admin/research?domain=example.com - Get cached result
 * GET /api/admin/research?job_id=xxx - Get job status
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { researchDomain, getDomainResearchAgent } from "@/lib/agents/domain-research-agent";
import { createServiceClient } from "@/lib/supabase/server";
import type { ResearchDepth } from "@/types/domain-research";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const researchRequestSchema = z.object({
  domain: z.string().min(3).max(253).regex(
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/,
    "Invalid domain format"
  ),
  depth: z.enum(["quick", "standard", "deep"]).optional().default("standard"),
  lead_profile_id: z.string().uuid().optional(),
});

// ============================================
// API HANDLERS
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = researchRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { domain, depth, lead_profile_id } = parseResult.data;
    const supabase = await createServiceClient();

    // Check for recent cached result (within 7 days)
    const { data: cached } = await supabase
      .from("domain_intelligence_cache")
      .select("*")
      .eq("domain", domain.toLowerCase())
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return NextResponse.json({
        status: "cached",
        result: cached.research_result,
        confidence: cached.confidence,
        cached_at: cached.updated_at,
      });
    }

    // Check for existing running job
    const { data: existingJob } = await supabase
      .from("research_jobs")
      .select("*")
      .eq("domain", domain.toLowerCase())
      .eq("status", "running")
      .single();

    if (existingJob) {
      return NextResponse.json({
        status: "running",
        job_id: existingJob.id,
        message: "Research already in progress",
      });
    }

    // Start new research job
    const job = await researchDomain(domain, depth as ResearchDepth);

    // Save job to database
    await supabase.from("research_jobs").insert({
      id: job.id,
      domain: job.domain,
      status: job.status,
      lead_profile_id,
      depth,
      sources_checked: job.sources_checked,
      raw_findings: job.raw_findings,
      synthesized_result: job.synthesized_result,
      confidence_score: job.confidence_score,
      error_message: job.error_message,
      started_at: job.started_at,
      completed_at: job.completed_at,
    });

    // If successful, cache the result
    if (job.status === "completed" && job.synthesized_result) {
      await supabase.from("domain_intelligence_cache").upsert({
        domain: job.domain,
        research_result: job.synthesized_result,
        source: "research_agent",
        confidence: job.confidence_score,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      }, { onConflict: "domain" });

      // Update lead profile if provided
      if (lead_profile_id) {
        await supabase
          .from("lead_profiles")
          .update({
            company_intel: {
              company_name: job.synthesized_result.company_name,
              size: job.synthesized_result.company_size,
              industry: job.synthesized_result.industry,
              compliance_frameworks: job.synthesized_result.compliance_frameworks,
              technology_stack: job.synthesized_result.technology_stack?.other,
              source: "research_agent",
              confidence: job.confidence_score,
            },
          })
          .eq("id", lead_profile_id);
      }
    }

    return NextResponse.json({
      status: job.status,
      job_id: job.id,
      result: job.synthesized_result,
      confidence: job.confidence_score,
      sources_checked: job.sources_checked.length,
      error: job.error_message,
    });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      { error: "Research failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const jobId = searchParams.get("job_id");

    const supabase = await createServiceClient();

    if (jobId) {
      // Get job status
      const { data: job, error } = await supabase
        .from("research_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error || !job) {
        return NextResponse.json(
          { error: "Job not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        job_id: job.id,
        domain: job.domain,
        status: job.status,
        result: job.synthesized_result,
        confidence: job.confidence_score,
        sources_checked: job.sources_checked,
        error: job.error_message,
        created_at: job.created_at,
        completed_at: job.completed_at,
      });
    }

    if (domain) {
      // Get cached result for domain
      const { data: cached } = await supabase
        .from("domain_intelligence_cache")
        .select("*")
        .eq("domain", domain.toLowerCase())
        .single();

      if (cached) {
        return NextResponse.json({
          domain: cached.domain,
          result: cached.research_result,
          confidence: cached.confidence,
          source: cached.source,
          cached_at: cached.updated_at,
          expires_at: cached.expires_at,
        });
      }

      // Check for completed job
      const { data: job } = await supabase
        .from("research_jobs")
        .select("*")
        .eq("domain", domain.toLowerCase())
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      if (job) {
        return NextResponse.json({
          domain: job.domain,
          result: job.synthesized_result,
          confidence: job.confidence_score,
          source: "research_agent",
          job_id: job.id,
          completed_at: job.completed_at,
        });
      }

      return NextResponse.json(
        { error: "No data found for domain", domain },
        { status: 404 }
      );
    }

    // List recent jobs
    const { data: jobs } = await supabase
      .from("research_jobs")
      .select("id, domain, status, confidence_score, created_at, completed_at")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ jobs: jobs ?? [] });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch research data" },
      { status: 500 }
    );
  }
}
