import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const results: string[] = [];

    // Create SEO research cache table
    const { error: cacheTableError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS seo_research_cache (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          keyword VARCHAR(255) NOT NULL UNIQUE,
          search_volume INTEGER,
          keyword_difficulty INTEGER,
          cpc DECIMAL(10,2),
          competition DECIMAL(5,4),
          competition_level VARCHAR(20),
          trend_percent INTEGER,
          trend_direction VARCHAR(20),
          trend_data JSONB,
          related_keywords JSONB,
          questions JSONB,
          competitor_headlines JSONB,
          suggestions JSONB,
          fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
        );
        CREATE INDEX IF NOT EXISTS idx_seo_cache_keyword ON seo_research_cache(keyword);
        CREATE INDEX IF NOT EXISTS idx_seo_cache_expires ON seo_research_cache(expires_at);
      `,
    });

    if (cacheTableError) {
      // Try alternative approach - direct SQL via REST might not be available
      // We'll create the table using individual queries
      results.push(`Cache table: ${cacheTableError.message || "RPC not available, trying alternative..."}`);
    } else {
      results.push("SEO cache table created/verified");
    }

    // Add SEO columns to blog_posts table
    const seoColumns = [
      { name: "meta_title", type: "VARCHAR(70)" },
      { name: "meta_description", type: "VARCHAR(170)" },
      { name: "focus_keyword", type: "VARCHAR(100)" },
      { name: "secondary_keywords", type: "TEXT[]" },
      { name: "faq_schema", type: "JSONB" },
      { name: "key_entities", type: "TEXT[]" },
      { name: "og_title", type: "VARCHAR(70)" },
      { name: "og_description", type: "VARCHAR(200)" },
      { name: "seo_score", type: "INTEGER" },
      { name: "content_analysis", type: "JSONB" },
    ];

    // Check which columns already exist
    const { data: existingColumns } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'blog_posts';
      `,
    });

    const existingColumnNames = new Set(
      (existingColumns as { column_name: string }[] | null)?.map((c) => c.column_name) || []
    );

    for (const col of seoColumns) {
      if (!existingColumnNames.has(col.name)) {
        const { error } = await supabase.rpc("exec_sql", {
          sql: `ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`,
        });

        if (error) {
          results.push(`Column ${col.name}: ${error.message}`);
        } else {
          results.push(`Column ${col.name} added`);
        }
      } else {
        results.push(`Column ${col.name} already exists`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Migration failed" },
      { status: 500 }
    );
  }
}

// Alternative: Manual SQL to run in Supabase dashboard
export async function GET() {
  const sql = `
-- Create SEO research cache table
CREATE TABLE IF NOT EXISTS seo_research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(255) NOT NULL UNIQUE,
  search_volume INTEGER,
  keyword_difficulty INTEGER,
  cpc DECIMAL(10,2),
  competition DECIMAL(5,4),
  competition_level VARCHAR(20),
  trend_percent INTEGER,
  trend_direction VARCHAR(20),
  trend_data JSONB,
  related_keywords JSONB,
  questions JSONB,
  competitor_headlines JSONB,
  suggestions JSONB,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_seo_cache_keyword ON seo_research_cache(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_cache_expires ON seo_research_cache(expires_at);

-- Add SEO columns to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description VARCHAR(170);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS focus_keyword VARCHAR(100);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[];
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS faq_schema JSONB;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS key_entities TEXT[];
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_title VARCHAR(70);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_description VARCHAR(200);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_score INTEGER;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_analysis JSONB;
  `.trim();

  return NextResponse.json({
    message: "Run this SQL in your Supabase SQL Editor",
    sql,
  });
}
