import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("cheers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[cheers GET]", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, message } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "메시지를 입력해주세요" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("cheers")
    .insert({ name: name?.trim() || null, message: message.trim() })
    .select()
    .single();

  if (error) {
    console.error("[cheers POST]", error);
    return NextResponse.json({ error: "저장에 실패했습니다" }, { status: 500 });
  }
  return NextResponse.json({ data });
}
