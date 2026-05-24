"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import CheerList from "./cheer-list";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError("");

    const { error: dbError } = await supabase.from("cheers").insert({
      message: message.trim(),
      name: name.trim() || null,
    });

    setSubmitting(false);

    if (dbError) {
      setError("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      console.error(dbError);
      return;
    }

    setMessage("");
    setName("");
    setRefreshKey((k) => k + 1);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid rgba(21,35,63,0.16)",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 15,
    color: "var(--ink)",
    background: "#fff",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color .18s",
  };

  return (
    <section style={{ textAlign: "center" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-archivo), system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: 2,
          color: "var(--red)",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        <span aria-hidden style={{ width: 34, height: 3, background: "var(--red)", display: "inline-block" }} />
        Cheers · 응원 메시지
      </span>
      <h2
        style={{
          fontFamily: "var(--font-black-han-sans), 'Noto Sans KR', sans-serif",
          fontSize: "clamp(26px, 5vw, 38px)",
          color: "var(--navy)",
          margin: "0 0 14px",
          fontWeight: 400,
          letterSpacing: -0.3,
        }}
      >
        이승효에게 응원 보내기
      </h2>
      <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 28px" }}>
        동대문의 변화는 주민 여러분의 관심과 참여에서 시작됩니다.
        <br />
        따뜻한 한마디가 큰 힘이 됩니다.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          textAlign: "left",
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 (선택사항)"
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="응원 메시지를 남겨주세요"
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
        />
        {error && (
          <p style={{ color: "var(--red)", fontSize: 13, margin: 0 }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          style={{
            background: submitting || !message.trim() ? "rgba(228,3,46,0.4)" : "var(--red)",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 999,
            fontWeight: 800,
            fontSize: 15,
            border: 0,
            cursor: submitting || !message.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: "0 6px 18px rgba(228,3,46,0.28)",
            transition: "transform .18s",
          }}
        >
          {submitting ? "보내는 중..." : "응원 보내기 →"}
        </button>
      </form>

      <CheerList refreshKey={refreshKey} />
    </section>
  );
}
