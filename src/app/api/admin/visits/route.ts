import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function auth(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  return !!token && verifyToken(token);
}

type Visit = {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  session_id: string;
  created_at: string;
};

function startOfDayKST(d: Date): Date {
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  kst.setUTCHours(0, 0, 0, 0);
  return new Date(kst.getTime() - 9 * 60 * 60 * 1000);
}

function daysAgoStart(days: number): Date {
  const d = startOfDayKST(new Date());
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "stats";

  const supabase = getSupabaseAdmin();

  if (action === "stats") {
    const since30 = daysAgoStart(29).toISOString();
    const { data: visits, error } = await supabase
      .from("visits")
      .select("path, session_id, created_at, referrer")
      .gte("created_at", since30)
      .order("created_at", { ascending: false })
      .limit(50000);

    if (error) {
      console.error("[admin/visits stats]", error);
      return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 });
    }

    const { count: totalAll } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true });

    const todayStart = startOfDayKST(new Date()).getTime();
    const start7 = daysAgoStart(6).getTime();
    const start30 = daysAgoStart(29).getTime();

    let today = 0,
      d7 = 0,
      d30 = 0;
    const sessionsToday = new Set<string>();
    const sessions7 = new Set<string>();
    const sessions30 = new Set<string>();
    const pathCount = new Map<string, number>();
    const referrerCount = new Map<string, number>();
    const dailyCount = new Map<string, number>();

    type Row = Pick<Visit, "path" | "session_id" | "created_at" | "referrer">;
    for (const v of (visits ?? []) as Row[]) {
      const ts = new Date(v.created_at).getTime();
      if (ts >= start30) {
        d30 += 1;
        sessions30.add(v.session_id);
      }
      if (ts >= start7) {
        d7 += 1;
        sessions7.add(v.session_id);
      }
      if (ts >= todayStart) {
        today += 1;
        sessionsToday.add(v.session_id);
      }
      pathCount.set(v.path, (pathCount.get(v.path) ?? 0) + 1);
      const ref = (v.referrer && v.referrer.trim()) || "(direct)";
      referrerCount.set(ref, (referrerCount.get(ref) ?? 0) + 1);

      const dayKey = new Date(ts + 9 * 3600 * 1000).toISOString().slice(0, 10);
      dailyCount.set(dayKey, (dailyCount.get(dayKey) ?? 0) + 1);
    }

    const topPaths = [...pathCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    const topReferrers = [...referrerCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i -= 1) {
      const d = daysAgoStart(i);
      const key = new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
      daily.push({ date: key, count: dailyCount.get(key) ?? 0 });
    }

    return NextResponse.json({
      totals: {
        all: totalAll ?? 0,
        last30Days: d30,
        last7Days: d7,
        today,
      },
      uniqueSessions: {
        last30Days: sessions30.size,
        last7Days: sessions7.size,
        today: sessionsToday.size,
      },
      topPaths,
      topReferrers,
      daily,
    });
  }

  if (action === "recent") {
    const limit = Math.min(
      Math.max(1, parseInt(url.searchParams.get("limit") || "100", 10) || 100),
      500
    );
    const { data, error } = await supabase
      .from("visits")
      .select("id, path, referrer, user_agent, session_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("[admin/visits recent]", error);
      return NextResponse.json({ error: "Failed to fetch recent visits" }, { status: 500 });
    }
    return NextResponse.json({ data: data ?? [] });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
