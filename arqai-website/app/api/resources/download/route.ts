import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, job_title, resource_id, resource_type } = body;

    if (!name || !email || !resource_id || !resource_type) {
      return NextResponse.json({ error: "Name, email, resource ID, and resource type are required" }, { status: 400 });
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("resource_leads").insert({
        name,
        email,
        company: company || null,
        job_title: job_title || null,
        resource_id,
        resource_type,
        download_token: token,
        token_expires_at: expiresAt.toISOString(),
        token_used: false,
      });
    }

    return NextResponse.json({ success: true, token, expires_at: expiresAt.toISOString() });
  } catch (error) {
    console.error("Error processing download request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Download token is required" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      const { data: lead, error } = await supabase
        .from("resource_leads")
        .select("*")
        .eq("download_token", token)
        .single();

      if (error || !lead) {
        return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 });
      }

      if (new Date(lead.token_expires_at) < new Date()) {
        return NextResponse.json({ error: "Download link has expired" }, { status: 410 });
      }

      if (lead.token_used) {
        return NextResponse.json({ error: "This download link has already been used" }, { status: 410 });
      }

      await supabase
        .from("resource_leads")
        .update({ token_used: true, downloaded_at: new Date().toISOString() })
        .eq("id", lead.id);

      return NextResponse.json({
        title: "The Enterprise AI Governance Playbook 2025",
        description: "Your comprehensive guide to AI governance",
        download_url: "/downloads/enterprise-ai-governance-playbook-2025.pdf",
        file_name: "enterprise-ai-governance-playbook-2025.pdf",
        expires_at: lead.token_expires_at,
      });
    }

    return NextResponse.json({
      title: "The Enterprise AI Governance Playbook 2025",
      description: "Your comprehensive guide to AI governance",
      download_url: "/downloads/enterprise-ai-governance-playbook-2025.pdf",
      file_name: "enterprise-ai-governance-playbook-2025.pdf",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Error validating download token:", error);
    return NextResponse.json({ error: "Failed to validate download link" }, { status: 500 });
  }
}
