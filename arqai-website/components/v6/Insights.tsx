import React from "react";
import { createClient } from "@supabase/supabase-js";
import InsightsGrid, { type InsightPost } from "./InsightsGrid";

// ---------------------------------------------------------------------------
// Data — latest published posts from the CMS (Supabase blog_posts).
// ---------------------------------------------------------------------------

async function getPosts(): Promise<InsightPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, category, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);

    if (error) return [];
    return (data as InsightPost[]) || [];
  } catch {
    return [];
  }
}

export default async function Insights() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <section className="relative overflow-hidden bg-[#0a0a0a]" id="insights">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-10 lg:px-14">
          <div className="h-5 w-56 animate-pulse rounded bg-white/10" />
          <div className="mt-5 h-9 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <InsightsGrid posts={posts} />;
}
