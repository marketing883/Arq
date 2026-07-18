import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import WhitepaperDetailClient from "./WhitepaperDetailClient";

export const revalidate = 300;

async function getWhitepaper(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("whitepapers")
    .select("title, slug, description, cover_image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const whitepaper = await getWhitepaper(params.slug);
  if (!whitepaper) {
    return { title: "Whitepaper Not Found" };
  }

  const title = `${whitepaper.title} — Whitepaper`;
  const description =
    whitepaper.description ||
    `${whitepaper.title} — a whitepaper from ArqAI Labs on operational AI.`;
  const canonical = `https://thearq.ai/whitepapers/${whitepaper.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ArqAI Labs`,
      description,
      url: canonical,
      ...(whitepaper.cover_image && { images: [{ url: whitepaper.cover_image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ArqAI Labs`,
      description,
      site: "@The_ArqAI",
      creator: "@The_ArqAI",
      ...(whitepaper.cover_image && { images: [whitepaper.cover_image] }),
    },
  };
}

export default function WhitepaperDetailPage() {
  return <WhitepaperDetailClient />;
}
