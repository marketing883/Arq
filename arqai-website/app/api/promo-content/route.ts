import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Disable Next.js route caching to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({ promo: null });
    }

    const now = new Date().toISOString();

    // First, try to find an upcoming or featured webinar
    const { data: webinar } = await supabase
      .from("webinars")
      .select("id, title, slug, description, banner_image, webinar_date, status, featured")
      .neq("status", "draft")
      .or(`status.eq.upcoming,status.eq.live,featured.eq.true`)
      .gte("webinar_date", now)
      .order("webinar_date", { ascending: true })
      .limit(1)
      .single();

    if (webinar) {
      return NextResponse.json({
        promo: {
          type: "webinar",
          title: webinar.title,
          description: webinar.description,
          slug: webinar.slug,
          image: webinar.banner_image,
          date: webinar.webinar_date,
          status: webinar.status,
          link: `/webinars/${webinar.slug}`,
          cta: webinar.status === "live" ? "Join Now" : "Register Now",
        },
      });
    }

    // If no upcoming webinar, try featured whitepaper
    const { data: whitepaper } = await supabase
      .from("whitepapers")
      .select("id, title, slug, description, cover_image, category")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (whitepaper) {
      return NextResponse.json({
        promo: {
          type: "whitepaper",
          title: whitepaper.title,
          description: whitepaper.description,
          slug: whitepaper.slug,
          image: whitepaper.cover_image,
          category: whitepaper.category,
          link: `/whitepapers/${whitepaper.slug}`,
          cta: "Download Free",
        },
      });
    }

    // If no whitepaper, try featured case study
    const { data: caseStudy } = await supabase
      .from("case_studies")
      .select("id, title, slug, client_name, industry, hero_image")
      .eq("status", "published")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (caseStudy) {
      return NextResponse.json({
        promo: {
          type: "case-study",
          title: caseStudy.title,
          description: `See how ${caseStudy.client_name} transformed their ${caseStudy.industry.toLowerCase()} operations with ArqAI`,
          slug: caseStudy.slug,
          image: caseStudy.hero_image,
          industry: caseStudy.industry,
          link: `/case-studies/${caseStudy.slug}`,
          cta: "Read Case Study",
        },
      });
    }

    // Last resort: get any published case study
    const { data: anyCase } = await supabase
      .from("case_studies")
      .select("id, title, slug, client_name, industry, hero_image")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (anyCase) {
      return NextResponse.json({
        promo: {
          type: "case-study",
          title: anyCase.title,
          description: `See how ${anyCase.client_name} transformed their ${anyCase.industry.toLowerCase()} operations with ArqAI`,
          slug: anyCase.slug,
          image: anyCase.hero_image,
          industry: anyCase.industry,
          link: `/case-studies/${anyCase.slug}`,
          cta: "Read Case Study",
        },
      });
    }

    return NextResponse.json({ promo: null });
  } catch (error) {
    console.error("Error fetching promo content:", error);
    return NextResponse.json({ promo: null });
  }
}
