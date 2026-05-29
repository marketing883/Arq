import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Image optimization settings
const IMAGE_SETTINGS = {
  featured: { maxWidth: 1920, maxHeight: 1080, quality: 85 },
  content: { maxWidth: 1200, maxHeight: 800, quality: 82 },
  thumbnail: { maxWidth: 400, maxHeight: 300, quality: 80 },
};

// Optimize image using sharp
async function optimizeImage(
  buffer: Buffer,
  folder: string
): Promise<{ buffer: Buffer; format: string }> {
  // Determine settings based on folder
  let settings = IMAGE_SETTINGS.content;
  if (folder.includes("featured")) {
    settings = IMAGE_SETTINGS.featured;
  } else if (folder.includes("thumb")) {
    settings = IMAGE_SETTINGS.thumbnail;
  }

  // Process image with sharp
  const optimized = await sharp(buffer)
    .resize(settings.maxWidth, settings.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: settings.quality })
    .toBuffer();

  return { buffer: optimized, format: "webp" };
}

// Supported file types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      const missingVars = [];
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");

      return NextResponse.json({
        error: "Storage not configured. Missing Supabase credentials.",
        missing: missingVars,
        instructions: "Add the missing environment variables to your .env.local file"
      }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "content-uploads";
    const folder = formData.get("folder") as string || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: `File type not allowed. Supported: ${ALLOWED_FILE_TYPES.join(", ")}`
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Optimize images (skip for PDFs and GIFs)
    let uploadBuffer: Buffer | Uint8Array = originalBuffer;
    let contentType = file.type;
    let extension = file.name.split(".").pop();

    const isOptimizableImage = ALLOWED_IMAGE_TYPES.includes(file.type) && file.type !== "image/gif";

    if (isOptimizableImage) {
      try {
        const optimized = await optimizeImage(originalBuffer, folder);
        uploadBuffer = optimized.buffer;
        contentType = "image/webp";
        extension = "webp";
        console.log(`[Upload] Optimized image: ${file.size} bytes -> ${optimized.buffer.length} bytes (${Math.round((1 - optimized.buffer.length / file.size) * 100)}% reduction)`);
      } catch (optError) {
        console.error("[Upload] Optimization failed, using original:", optError);
        uploadBuffer = new Uint8Array(arrayBuffer);
      }
    } else {
      uploadBuffer = new Uint8Array(arrayBuffer);
    }

    const fileName = `${timestamp}-${randomStr}.${extension}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, uploadBuffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      const errorMsg = error.message || "";

      // Check if bucket doesn't exist
      if (errorMsg.includes("Bucket not found") || errorMsg.includes("bucket") || errorMsg.includes("not found")) {
        return NextResponse.json({
          error: `Storage bucket '${bucket}' not found. Please create it in Supabase Dashboard.`,
          instructions: "Go to Supabase Dashboard > Storage > New Bucket > Name it 'content-uploads' > Make it PUBLIC",
          steps: [
            "1. Go to your Supabase Dashboard",
            "2. Click on 'Storage' in the left sidebar",
            "3. Click 'New bucket'",
            "4. Name it: content-uploads",
            "5. Check 'Public bucket' checkbox",
            "6. Click 'Create bucket'"
          ]
        }, { status: 500 });
      }

      // Check for policy/permission errors
      if (errorMsg.includes("policy") || errorMsg.includes("permission") || errorMsg.includes("denied") || errorMsg.includes("unauthorized")) {
        return NextResponse.json({
          error: "Storage permission denied. The bucket may not be public.",
          instructions: "Make sure the 'content-uploads' bucket is set to PUBLIC in Supabase Dashboard"
        }, { status: 500 });
      }

      return NextResponse.json({ error: errorMsg || "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      error: "Failed to upload file. Please try again."
    }, { status: 500 });
  }
}

// Delete file
export async function DELETE(request: Request) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        error: "Storage not configured"
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const bucket = searchParams.get("bucket") || "content-uploads";

    if (!path) {
      return NextResponse.json({ error: "File path required" }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({
      error: "Failed to delete file"
    }, { status: 500 });
  }
}
