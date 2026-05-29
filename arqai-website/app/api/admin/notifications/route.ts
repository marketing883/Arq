/**
 * Notifications API
 *
 * Manage notification channels and test notifications.
 * Protected by admin authentication.
 *
 * GET /api/admin/notifications - List channels and status
 * POST /api/admin/notifications - Register channel
 * POST /api/admin/notifications?action=test - Test notifications
 * DELETE /api/admin/notifications?id=xxx - Remove channel
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getNotificationStatus,
  registerChannel,
  getChannels,
  removeChannel,
  testNotifications,
} from "@/lib/integrations/notifications";
import type { NotificationChannel } from "@/types/integrations";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const channelSchema = z.object({
  id: z.string().uuid().optional(),
  channel_type: z.enum(["slack", "teams", "email"]),
  channel_config: z.object({
    webhook_url: z.string().url().optional(),
    channel_name: z.string().optional(),
    email_addresses: z.array(z.string().email()).optional(),
  }),
  alert_types: z.array(z.string()).default(["hot_lead_new", "engagement_surge"]),
  min_priority: z.enum(["critical", "high", "medium", "low"]).default("high"),
  is_active: z.boolean().default(true),
});

// ============================================
// API HANDLERS
// ============================================

export async function GET(request: NextRequest) {
  try {
    const status = getNotificationStatus();
    const channels = getChannels();

    return NextResponse.json({
      integrations: status,
      channels: channels.map(c => ({
        id: c.id,
        channel_type: c.channel_type,
        alert_types: c.alert_types,
        min_priority: c.min_priority,
        is_active: c.is_active,
        created_at: c.created_at,
      })),
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Test notifications
    if (action === "test") {
      const result = await testNotifications();
      return NextResponse.json({
        success: result.success,
        results: result.results,
        message: result.total_sent > 0
          ? `Sent to ${result.total_sent} channel(s)`
          : "No channels configured or all failed",
      });
    }

    // Register new channel
    const body = await request.json();
    const parseResult = channelSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid channel configuration", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const channelData = parseResult.data;
    const channel: NotificationChannel = {
      id: channelData.id ?? crypto.randomUUID(),
      channel_type: channelData.channel_type,
      channel_config: channelData.channel_config,
      alert_types: channelData.alert_types,
      min_priority: channelData.min_priority,
      is_active: channelData.is_active,
      created_at: new Date().toISOString(),
    };

    registerChannel(channel);

    return NextResponse.json({
      success: true,
      channel: {
        id: channel.id,
        channel_type: channel.channel_type,
        alert_types: channel.alert_types,
        min_priority: channel.min_priority,
        is_active: channel.is_active,
      },
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Failed to register channel" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Channel ID required" },
        { status: 400 }
      );
    }

    const removed = removeChannel(id);

    if (!removed) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Channel removed",
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Failed to remove channel" },
      { status: 500 }
    );
  }
}
