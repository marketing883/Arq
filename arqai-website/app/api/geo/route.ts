import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get IP from headers (works with Vercel, Cloudflare, etc.)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const vercelIp = request.headers.get("x-real-ip");

    const ip = cfConnectingIp || vercelIp || forwardedFor?.split(",")[0].trim();

    // In development, return a default
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return NextResponse.json({
        country: "US",
        city: "Unknown",
        detected: false,
      });
    }

    // Try Vercel's geo headers first (free with Vercel deployment)
    const vercelCountry = request.headers.get("x-vercel-ip-country");
    const vercelCity = request.headers.get("x-vercel-ip-city");

    if (vercelCountry) {
      return NextResponse.json({
        country: vercelCountry,
        city: vercelCity || "Unknown",
        detected: true,
        source: "vercel",
      });
    }

    // Fallback: Try Cloudflare headers
    const cfCountry = request.headers.get("cf-ipcountry");
    if (cfCountry) {
      return NextResponse.json({
        country: cfCountry,
        city: "Unknown",
        detected: true,
        source: "cloudflare",
      });
    }

    // Last resort: Use a free geo-IP API
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: {
          "User-Agent": "ArqAI-Website/1.0",
        },
      });

      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        return NextResponse.json({
          country: geoData.country_code || "US",
          city: geoData.city || "Unknown",
          detected: true,
          source: "ipapi",
        });
      }
    } catch (geoError) {
      console.error("Geo API fallback failed:", geoError);
    }

    // Default fallback
    return NextResponse.json({
      country: "US",
      city: "Unknown",
      detected: false,
    });
  } catch (error) {
    console.error("Geo detection error:", error);
    return NextResponse.json({
      country: "US",
      city: "Unknown",
      detected: false,
      error: true,
    });
  }
}
