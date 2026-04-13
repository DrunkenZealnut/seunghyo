"use client";

import Navbar from "@/components/navbar";
import { CAREERS } from "@/data/site-data";
import { SITTING_IMG } from "@/data/sitting-image";

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", background: "#F5F7FF", minHeight: "100vh", color: "#0A0F2C" }}>
      <Navbar activePage="소개" />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "32px 0 16px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#29ABE2", margin: 0 }}>후보 소개</h1>
        </div>

        <div className="card" style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,87,255,0.08)", marginBottom: 20, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <img src={SITTING_IMG} alt="이승효" style={{ width: 140, borderRadius: 16, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>이승효</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <span style={{ display: "inline-block", background: "#EEF9FF", color: "#1A8FCC", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>진보당</span>
              <span style={{ display: "inline-block", background: "#EEF9FF", color: "#1A8FCC", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>동대문 제2선거구</span>
              <span style={{ display: "inline-block", background: "#EEF9FF", color: "#1A8FCC", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>회기·휘경·이문</span>
            </div>
            <p style={{ color: "#444", lineHeight: 1.7, fontSize: 15 }}>
              광주에서 태어나 동국대를 졸업하고, 청년 시절부터 학생운동·급식법 개정운동을 이끌어온 현장 활동가입니다. 지금은 민주노총 서비스연맹 정책국장으로 노동자의 목소리를 제도로 만드는 일을 하고 있습니다.
            </p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,87,255,0.08)", marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, color: "#29ABE2" }}>약력</h3>
          {CAREERS.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < CAREERS.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <span style={{ color: "#29ABE2", fontWeight: 700, fontSize: 13, minWidth: 30 }}>{c.period}</span>
              <span style={{ fontSize: 15, color: "#0A0F2C" }}>{c.label}</span>
            </div>
          ))}
          <div style={{ padding: "10px 0", borderTop: "1px solid #f0f0f0", marginTop: 4 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#888", fontWeight: 700, fontSize: 13, minWidth: 30 }}>학력</span>
              <span style={{ fontSize: 15, color: "#0A0F2C" }}>동국대학교 사범대학 졸업 / 광주 고려고등학교 졸업</span>
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg,#1A8FCC,#29ABE2)", color: "#fff", textAlign: "center", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,87,255,0.08)" }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: "#FFE066" }}>오직 주민편!</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>새로운 선택 이승효</div>
          <div style={{ marginTop: 12, opacity: 0.85, fontSize: 15 }}>회기동 · 휘경1·2동 · 이문1·2동 주민과 함께 만들어가겠습니다</div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
      `}</style>
    </div>
  );
}
