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
      // Insert lead record with the resource info
      const { error: insertError } = await supabase.from("resource_leads").insert({
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

      if (insertError) {
        console.error("Error inserting lead:", insertError);
      }
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
    if (!supabase) {
      return NextResponse.json({ error: "Database connection not available" }, { status: 500 });
    }

    // Get the lead record with the token
    const { data: lead, error: leadError } = await supabase
      .from("resource_leads")
      .select("*")
      .eq("download_token", token)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 404 });
    }

    if (new Date(lead.token_expires_at) < new Date()) {
      return NextResponse.json({ error: "Download link has expired" }, { status: 410 });
    }

    // Fetch the actual resource based on resource_type and resource_id
    let resourceData = null;

    if (lead.resource_type === "whitepaper") {
      const { data: whitepaper, error: wpError } = await supabase
        .from("whitepapers")
        .select("id, title, description, file_url, cover_image")
        .eq("id", lead.resource_id)
        .single();

      if (wpError || !whitepaper) {
        console.error("Error fetching whitepaper:", wpError);
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }

      resourceData = {
        title: whitepaper.title,
        description: whitepaper.description || "Download your resource",
        download_url: whitepaper.file_url,
        file_name: `${whitepaper.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        cover_image: whitepaper.cover_image,
        expires_at: lead.token_expires_at,
      };
    } else if (lead.resource_type === "webinar") {
      const { data: webinar, error: webError } = await supabase
        .from("webinars")
        .select("id, title, description, recording_url")
        .eq("id", lead.resource_id)
        .single();

      if (webError || !webinar) {
        console.error("Error fetching webinar:", webError);
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }

      resourceData = {
        title: webinar.title,
        description: webinar.description || "Watch the recording",
        download_url: webinar.recording_url,
        file_name: `${webinar.title.toLowerCase().replace(/\s+/g, '-')}-recording`,
        expires_at: lead.token_expires_at,
      };
    } else {
      return NextResponse.json({ error: "Unknown resource type" }, { status: 400 });
    }

    // Mark token as used only after successful resource fetch
    if (!lead.token_used) {
      await supabase
        .from("resource_leads")
        .update({ token_used: true, downloaded_at: new Date().toISOString() })
        .eq("id", lead.id);
    }

    return NextResponse.json(resourceData);
  } catch (error) {
    console.error("Error validating download token:", error);
    return NextResponse.json({ error: "Failed to validate download link" }, { status: 500 });
  }
}
