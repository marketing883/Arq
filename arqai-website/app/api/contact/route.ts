import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, jobTitle, message, inquiryType } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Store the contact submission
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        company: company || null,
        job_title: jobTitle || null,
        message,
        inquiry_type: inquiryType || "general",
        status: "new",
      });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail if DB insert fails - we might not have the table yet
      // In production, you'd want proper error handling
    }

    // TODO: Add email notification here (SendGrid, Resend, etc.)
    // For now, just log the submission
    console.log("Contact form submission:", {
      name,
      email,
      company,
      jobTitle,
      inquiryType,
      message: message.substring(0, 100) + "...",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
