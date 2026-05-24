"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Cheer {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  return `${Math.floor(seconds / 86400)}일 전`;
}

const PAGE_SIZE = 20;

export default function CheerList({ refreshKey }: { refreshKey: number }) {
  const [cheers, setCheers] = useState<Cheer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  async function load(append = false) {
    const from = append ? cheers.length : 0;
    const { data, count } = await supabase
      .from("cheers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (data) {
      setCheers((prev) => (append ? [...prev, ...data] : data));
      setHasMore(from + PAGE_SIZE < (count ?? 0));
    }
    if (count !== null) setTotal(count);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (loading && cheers.length === 0) {
    return (
      <div style={{ marginTop: 32, textAlign: "center", color: "var(--ink-soft)", fontSize: 13 }}>
        응원 메시지를 불러오는 중...
      </div>
    );
  }

  if (cheers.length === 0) return null;

  return (
    <div style={{ marginTop: 36 }}>
      <div
        style={{
          marginBottom: 18,
          textAlign: "center",
          fontWeight: 800,
          color: "var(--navy)",
          fontSize: 14,
        }}
      >
        <span style={{ color: "var(--red)" }}>♥</span>{" "}
        총 {total}명이 응원하고 있습니다
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {cheers.map((cheer) => (
          <div
            key={cheer.id}
            style={{
              background: "#fff",
              border: "1px solid rgba(21,35,63,0.08)",
              borderRadius: 12,
              padding: "14px 18px",
              textAlign: "left",
              boxShadow: "0 2px 8px rgba(21,35,63,0.04)",
            }}
          >
            <div
              style={{
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--ink-soft)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--navy)" }}>
                {cheer.name || "익명의 주민"}
              </span>
              <span>{timeAgo(cheer.created_at)}</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>
              {cheer.message}
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            onClick={() => load(true)}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(21,35,63,0.18)",
              color: "var(--navy)",
              padding: "10px 22px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  );
}
