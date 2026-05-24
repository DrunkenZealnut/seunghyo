"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SampleNavbar from "@/components/sample-navbar";
import SampleFooter from "@/components/sample-footer";

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: { zonecode: string; roadAddress: string; jibunAddress: string }) => void;
      }) => { open: () => void };
    };
  }
}

interface FormData {
  name: string;
  isAnonymous: boolean;
  residentId1: string;
  residentId2: string;
  phone: string;
  email: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  amount: string;
  depositDate: string;
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

function StepBadge({ n }: { n: number }) {
  return (
    <span
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: 26,
        height: 26,
        background: "var(--red)",
        color: "#fff",
        borderRadius: 999,
        fontFamily: "var(--font-archivo), system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 900,
        marginRight: 8,
      }}
    >
      {n}
    </span>
  );
}

export default function DonatePage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    isAnonymous: false,
    residentId1: "",
    residentId2: "",
    phone: "",
    email: "",
    postalCode: "",
    address: "",
    detailAddress: "",
    amount: "",
    depositDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function openDaumPostcode() {
    const run = () => {
      new window.daum!.Postcode({
        oncomplete(data) {
          setForm((f) => ({
            ...f,
            postalCode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
            detailAddress: "",
          }));
        },
      }).open();
    };
    if (window.daum?.Postcode) {
      run();
      return;
    }
    const s = document.createElement("script");
    s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    s.onload = run;
    document.head.appendChild(s);
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function formatAmount(value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("ko-KR");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("이름을 입력해주세요.");
    if (form.residentId1.length !== 6 || form.residentId2.length !== 7) {
      return setError("주민등록번호를 정확히 입력해주세요.");
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      return setError("전화번호를 정확히 입력해주세요.");
    }
    if (!form.address.trim()) return setError("주소를 입력해주세요.");
    if (!form.amount || Number(form.amount.replace(/,/g, "")) <= 0) {
      return setError("후원금 금액을 입력해주세요.");
    }
    if (!form.depositDate) return setError("입금일자를 선택해주세요.");

    setSubmitting(true);
    const residentId = `${form.residentId1}-${form.residentId2}`;
    const amountNumber = Number(form.amount.replace(/,/g, ""));
    const { error: dbError } = await supabase.from("donations").insert({
      donor_name: form.name.trim(),
      resident_id: residentId,
      phone: form.phone.trim(),
      postal_code: form.postalCode.trim() || null,
      address: form.address.trim(),
      detail_address: form.detailAddress.trim() || null,
      email: form.email.trim() || null,
      is_anonymous: form.isAnonymous,
      amount: amountNumber,
      deposit_date: form.depositDate,
    });
    setSubmitting(false);

    if (dbError) {
      console.error(dbError);
      return setError("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "donation",
        name: form.name.trim(),
        amount: amountNumber,
        depositDate: form.depositDate,
        donorEmail: form.email.trim() || null,
      }),
    }).catch((err) => console.error("Email notify failed:", err));

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="pl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SampleNavbar activePage="후원" />
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
                fontSize: 26,
                color: "var(--navy)",
                margin: "0 0 12px",
                fontWeight: 400,
              }}
            >
              후원금 입금정보가 접수되었습니다.
            </h2>
            <p style={{ color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 28 }}>
              소중한 후원에 깊이 감사드립니다.
              <br />
              기부금영수증은 확인 후 발급해 드리겠습니다.
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
              추가 입력하기
            </button>
          </div>
        </main>
        <SampleFooter />
      </div>
    );
  }

  const legendStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: 800,
    color: "var(--navy)",
  };

  return (
    <div className="pl-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SampleNavbar activePage="후원" />
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
            Donate · 후원금 입금정보
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
            이승효 후보 후원,
            <br />
            <span style={{ color: "var(--red)" }}>기부금영수증</span> 발급 안내
          </h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.75, maxWidth: 560 }}>
            기부금영수증 발급을 위해 아래 정보를 정확히 입력해주세요. 수집된 개인정보는 영수증
            발급 목적으로만 사용되며 안전하게 관리됩니다.
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
            gap: 24,
          }}
        >
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={1} /> 이름 <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
            </legend>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="홍길동"
              style={inputStyle}
            />
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={2} /> 주민등록번호 <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
            </legend>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={form.residentId1}
                onChange={(e) =>
                  setForm({ ...form, residentId1: e.target.value.replace(/\D/g, "").slice(0, 6) })
                }
                placeholder="생년월일 6자리"
                style={{ ...inputStyle, textAlign: "center" }}
              />
              <span style={{ fontSize: 22, fontWeight: 800, color: "var(--ink-soft)" }}>-</span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={7}
                value={form.residentId2}
                onChange={(e) =>
                  setForm({ ...form, residentId2: e.target.value.replace(/\D/g, "").slice(0, 7) })
                }
                placeholder="뒷자리 7자리"
                style={{ ...inputStyle, textAlign: "center" }}
              />
            </div>
            <p style={{ marginTop: 6, fontSize: 12, color: "var(--ink-soft)" }}>
              기부금영수증 발급을 위해 필요하며, 안전하게 보호됩니다.
            </p>
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={3} /> 전화번호 <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
            </legend>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
              placeholder="010-1234-5678"
              style={inputStyle}
            />
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={4} /> 이메일{" "}
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-soft)", marginLeft: 4 }}>
                (선택)
              </span>
            </legend>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              style={inputStyle}
            />
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={5} /> 주소 <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
            </legend>
            <button
              type="button"
              onClick={openDaumPostcode}
              style={{
                background: "var(--navy)",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                border: 0,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: 10,
              }}
            >
              🔍 주소 검색
            </button>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                inputMode="numeric"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    postalCode: e.target.value.replace(/\D/g, "").slice(0, 5),
                  })
                }
                placeholder="우편번호"
                maxLength={5}
                style={{ ...inputStyle, width: 120, textAlign: "center", fontFamily: "var(--font-archivo), monospace" }}
              />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="도로명 주소"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
            <input
              type="text"
              value={form.detailAddress}
              onChange={(e) => setForm({ ...form, detailAddress: e.target.value })}
              placeholder="상세 주소 (동, 호수 등)"
              style={inputStyle}
            />
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={6} /> 후원금 금액 <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
            </legend>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="numeric"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: formatAmount(e.target.value) })}
                placeholder="100,000"
                style={{ ...inputStyle, paddingRight: 36 }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontWeight: 800,
                  color: "var(--ink-soft)",
                }}
              >
                원
              </span>
            </div>
          </fieldset>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={legendStyle}>
              <StepBadge n={7} /> 후원금 입금일자 <span style={{ color: "var(--red)", marginLeft: 4 }}>*</span>
            </legend>
            <input
              type="date"
              value={form.depositDate}
              onChange={(e) => setForm({ ...form, depositDate: e.target.value })}
              style={inputStyle}
            />
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
            }}
          >
            {submitting ? "제출 중..." : "♥ 후원정보 제출하기"}
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "var(--ink-soft)" }}>
            수집된 개인정보는 기부금영수증 발급 목적으로만 사용되며, 관련 법령에 따라 안전하게
            관리됩니다.
          </p>
        </form>
      </section>

      <SampleFooter />
    </div>
  );
}
