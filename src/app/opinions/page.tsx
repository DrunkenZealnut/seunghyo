"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SampleNavbar from "@/components/sample-navbar";
import SampleFooter from "@/components/sample-footer";

const CATEGORIES = ["교통", "안전", "환경", "복지", "교육", "기타"] as const;

interface FormData {
  category: string;
  title: string;
  content: string;
  name: string;
  phone: string;
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
};

export default function OpinionsPage() {
  const [form, setForm] = useState<FormData>({
    category: "",
    title: "",
    content: "",
    name: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.category) return setError("카테고리를 선택해주세요.");
    if (!form.title.trim()) return setError("제목을 입력해주세요.");
    if (!form.content.trim()) return setError("내용을 입력해주세요.");

    setSubmitting(true);
    const { error: dbError } = await supabase.from("opinions").insert({
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      name: form.name.trim() || null,
      phone: form.phone.trim() || null,
    });
    setSubmitting(false);

    if (dbError) {
      console.error(dbError);
      return setError("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="pl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SampleNavbar activePage="의견함" />
        <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "40px 22px" }}>
          <div
            style={{
              maxWidth: 480,
              width: "100%",
              background: "#fff",
              borderRadius: 16,
              padding: "40px 32px",
              boxShadow: "0 8px 28px rgba(21,35,63,0.08)",
              border: "1px solid rgba(21,35,63,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
            <h2
              style={{
                fontFamily: "var(--font-black-han-sans), 'Noto Sans KR', sans-serif",
                fontSize: 28,
                color: "var(--navy)",
                margin: "0 0 12px",
                fontWeight: 400,
              }}
            >
              소중한 의견 감사합니다!
            </h2>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 28 }}>
              주민 여러분의 목소리를 귀담아 듣고
              <br />
              더 나은 동대문을 만들겠습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "var(--red)",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
                border: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 6px 18px rgba(228,3,46,0.28)",
              }}
            >
              다른 의견 제출하기
            </button>
          </div>
        </main>
        <SampleFooter />
      </div>
    );
  }

  return (
    <div className="pl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SampleNavbar activePage="의견함" />
      <section style={{ padding: "56px 22px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
            Voice · 주민 의견함
          </span>
          <h1
            style={{
              fontFamily: "var(--font-black-han-sans), 'Noto Sans KR', sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              color: "var(--navy)",
              margin: "0 0 12px",
              fontWeight: 400,
              letterSpacing: -0.5,
              lineHeight: 1.05,
            }}
          >
            동대문의 변화는
            <br />
            <span style={{ color: "var(--red)" }}>주민의 한마디</span>에서 시작됩니다.
          </h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.75, maxWidth: 560 }}>
            생활 불편, 정책 아이디어, 개선 제안 — 무엇이든 자유롭게 남겨주세요.
          </p>
        </div>
      </section>

      <section style={{ flex: 1, padding: "0 22px 60px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 16,
            padding: "32px",
            boxShadow: "0 8px 28px rgba(21,35,63,0.08)",
            border: "1px solid rgba(21,35,63,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ marginBottom: 10, fontSize: 14, fontWeight: 800, color: "var(--navy)" }}>
              카테고리 <span style={{ color: "var(--red)" }}>*</span>
            </legend>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const on = form.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 10,
                      border: `1.5px solid ${on ? "var(--red)" : "rgba(21,35,63,0.16)"}`,
                      background: on ? "rgba(228,3,46,0.08)" : "#fff",
                      color: on ? "var(--red)" : "var(--ink-soft)",
                      fontWeight: on ? 800 : 600,
                      fontSize: 14,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: ".15s",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ marginBottom: 10, fontSize: 14, fontWeight: 800, color: "var(--navy)" }}>
              제목 <span style={{ color: "var(--red)" }}>*</span>
            </legend>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="의견 제목을 입력해주세요"
              maxLength={50}
              style={inputStyle}
            />
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ marginBottom: 10, fontSize: 14, fontWeight: 800, color: "var(--navy)" }}>
              내용 <span style={{ color: "var(--red)" }}>*</span>
            </legend>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="구체적인 내용을 적어주세요"
              rows={6}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ marginBottom: 10, fontSize: 14, fontWeight: 800, color: "var(--navy)" }}>
              연락처{" "}
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)" }}>
                (선택 — 개선 결과를 안내드립니다)
              </span>
            </legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="이름"
                style={inputStyle}
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="전화번호"
                style={inputStyle}
              />
            </div>
          </fieldset>

          {error && (
            <div
              style={{
                background: "rgba(228,3,46,0.08)",
                border: "1px solid rgba(228,3,46,0.2)",
                color: "var(--red-deep)",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? "rgba(228,3,46,0.4)" : "var(--red)",
              color: "#fff",
              padding: "16px 22px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 16,
              border: 0,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: "0 8px 22px rgba(228,3,46,0.28)",
              transition: ".18s",
            }}
          >
            {submitting ? "제출 중..." : "의견 제출하기 →"}
          </button>
        </form>
      </section>

      <SampleFooter />
    </div>
  );
}
