import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { donor_name, resident_id, phone, postal_code, address, detail_address, email, amount, deposit_date } = body;

  if (!donor_name?.trim()) {
    return NextResponse.json({ error: "이름을 입력해주세요" }, { status: 400 });
  }
  if (!phone?.trim()) {
    return NextResponse.json({ error: "전화번호를 입력해주세요" }, { status: 400 });
  }
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: "올바른 금액을 입력해주세요" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: donor_name.trim(),
      resident_id: resident_id?.trim() || "",
      phone: phone.trim(),
      postal_code: postal_code?.trim() || null,
      address: address?.trim() || "",
      detail_address: detail_address?.trim() || null,
      email: email?.trim() || null,
      amount: Number(amount),
      deposit_date: deposit_date || new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) {
    console.error("[donations POST]", error);
    return NextResponse.json({ error: "저장에 실패했습니다" }, { status: 500 });
  }
  return NextResponse.json({ data });
}
