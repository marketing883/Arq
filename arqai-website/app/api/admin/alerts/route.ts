/**
 * Admin API for Lead Alerts
 *
 * Provides access to the smart alert system:
 * - View active alerts
 * - Acknowledge alerts
 * - Dismiss alerts
 * - Get alert history
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-auth";
import {
  getActiveAlerts,
  acknowledgeAlert,
  dismissAlert,
} from "@/lib/lead/lead-profile-service";

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const alerts = await getActiveAlerts(limit);

    // Group alerts by priority
    const grouped = {
      critical: alerts.filter(a => a.priority === "critical"),
      high: alerts.filter(a => a.priority === "high"),
      medium: alerts.filter(a => a.priority === "medium"),
      low: alerts.filter(a => a.priority === "low"),
    };

    return NextResponse.json({
      alerts,
      grouped,
      total: alerts.length,
      by_priority: {
        critical: grouped.critical.length,
        high: grouped.high.length,
        medium: grouped.medium.length,
        low: grouped.low.length,
      },
    });
  } catch (error) {
    console.error("Admin alerts GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, alert_id } = body;

    if (!alert_id) {
      return NextResponse.json(
        { error: "alert_id is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "acknowledge": {
        const alert = await acknowledgeAlert(alert_id, "admin");
        if (!alert) {
          return NextResponse.json(
            { error: "Failed to acknowledge alert" },
            { status: 500 }
          );
        }
        return NextResponse.json({
          success: true,
          alert,
          message: "Alert acknowledged",
        });
      }

      case "dismiss": {
        const success = await dismissAlert(alert_id);
        if (!success) {
          return NextResponse.json(
            { error: "Failed to dismiss alert" },
            { status: 500 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Alert dismissed",
        });
      }

      default:
        return NextResponse.json(
          { error: "Unknown action. Use 'acknowledge' or 'dismiss'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin alerts POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
