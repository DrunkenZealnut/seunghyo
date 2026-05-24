import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_LEN = {
  path: 512,
  referrer: 1024,
  user_agent: 1024,
  session_id: 128,
};

function clamp(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const obj = (body ?? {}) as Record<string, unknown>;
  const path = clamp(obj.path, MAX_LEN.path);
  const session_id = clamp(obj.session_id, MAX_LEN.session_id);
  const referrer = clamp(obj.referrer, MAX_LEN.referrer);
  const user_agent = clamp(obj.user_agent, MAX_LEN.user_agent);

  if (!path || !session_id) {
    return NextResponse.json({ error: "path and session_id are required" }, { status: 400 });
  }

  const { error } = await supabase.from("visits").insert({
    path,
    referrer,
    user_agent,
    session_id,
  });

  if (error) {
    console.error("[api/visits POST]", error);
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
