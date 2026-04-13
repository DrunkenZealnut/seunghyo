import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_TABLES = ["cheers", "opinions", "donations"];
const DELETABLE_TABLES = ["cheers", "opinions", "donations"];
const INSERTABLE_TABLES = ["donations"];

const INSERTABLE_FIELDS: Record<string, string[]> = {
  donations: ["donor_name", "resident_id", "phone", "postal_code", "address", "detail_address", "is_anonymous", "email", "amount", "deposit_date"],
};

const PAGE_LIMIT_MAX = 100;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function internalError() {
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

function auth(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  return !!token && verifyToken(token);
}

function getSearchParams(request: NextRequest) {
  return new URL(request.url).searchParams;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return unauthorized();

  const searchParams = getSearchParams(request);
  const action = searchParams.get("action");

  if (action === "counts") {
    const counts: Record<string, number> = {};
    for (const table of ALLOWED_TABLES) {
      const { count } = await getSupabaseAdmin()
        .from(table)
        .select("*", { count: "exact", head: true });
      counts[table] = count ?? 0;
    }
    return NextResponse.json(counts);
  }

  if (action === "all") {
    const table = searchParams.get("table");
    if (!table || !ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }
    const { data, error } = await getSupabaseAdmin()
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (error) {
      console.error("[admin/data GET all]", error);
      return internalError();
    }
    return NextResponse.json({ data: data ?? [] });
  }

  const table = searchParams.get("table");
  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20), PAGE_LIMIT_MAX);
  const from = (page - 1) * limit;

  const { data, count } = await getSupabaseAdmin()
    .from(table)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  return NextResponse.json({ data: data ?? [], count: count ?? 0 });
}

export async function POST(request: NextRequest) {
  if (!auth(request)) return unauthorized();

  const body = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { table, data } = body as Record<string, unknown>;
  if (typeof table !== "string") {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  if (!INSERTABLE_TABLES.includes(table)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 400 });
  }

  if (table === "donations") {
    const d = data as Record<string, unknown>;
    const depositDate = d.deposit_date;
    if (typeof depositDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(depositDate)) {
      return NextResponse.json({ error: "Invalid deposit_date" }, { status: 400 });
    }
    const amount = d.amount;
    if (!Number.isInteger(amount) || (amount as number) <= 0 || (amount as number) >= 1_000_000_000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
  }

  const allowedFields = INSERTABLE_FIELDS[table] ?? [];
  const sanitized = Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(([key]) => allowedFields.includes(key))
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: result, error } = await (getSupabaseAdmin().from(table) as any).insert(sanitized).select().single();

  if (error) {
    console.error("[admin/data POST]", error);
    return internalError();
  }
  return NextResponse.json({ data: result });
}

const UPDATABLE_TABLES = ["donations"];

export async function PUT(request: NextRequest) {
  if (!auth(request)) return unauthorized();

  const body = await request.json();
  const { table, id, data } = body;

  if (!UPDATABLE_TABLES.includes(table)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 400 });
  }

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (table === "donations") {
    const d = data as Record<string, unknown>;
    const depositDate = d.deposit_date;
    if (typeof depositDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(depositDate)) {
      return NextResponse.json({ error: "Invalid deposit_date" }, { status: 400 });
    }
    const amount = d.amount;
    if (!Number.isInteger(amount) || (amount as number) <= 0 || (amount as number) >= 1_000_000_000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
  }

  const allowedFields = INSERTABLE_FIELDS[table] ?? [];
  const sanitized = Object.fromEntries(
    Object.entries(data as Record<string, unknown>).filter(([key]) => allowedFields.includes(key))
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: result, error } = await (getSupabaseAdmin().from(table) as any)
    .update(sanitized)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/data PUT]", error);
    return internalError();
  }
  return NextResponse.json({ data: result });
}

export async function DELETE(request: NextRequest) {
  if (!auth(request)) return unauthorized();

  const searchParams = getSearchParams(request);
  const table = searchParams.get("table");
  const id = searchParams.get("id");

  if (!table || !id || !DELETABLE_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table or id" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from(table).delete().eq("id", id);

  if (error) {
    console.error("[admin/data DELETE]", error);
    return internalError();
  }
  return NextResponse.json({ ok: true });
}
