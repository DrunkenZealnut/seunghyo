import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("opinions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[opinions GET]", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category, title, content, name, phone } = body;

  if (!category || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("opinions")
    .insert({
      category,
      title: title.trim(),
      content: content.trim(),
      name: name?.trim() || null,
      phone: phone?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[opinions POST]", error);
    return NextResponse.json({ error: "저장에 실패했습니다" }, { status: 500 });
  }
  return NextResponse.json({ data });
}
