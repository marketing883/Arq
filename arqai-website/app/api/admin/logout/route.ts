import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth/admin-auth";

export async function POST() {
  try {
    await clearAdminSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
