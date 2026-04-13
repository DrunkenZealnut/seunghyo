"use client";

import Navbar from "@/components/navbar";
import { PLEDGES } from "@/data/site-data";

export default function PledgesPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", background: "#F5F7FF", minHeight: "100vh", color: "#0A0F2C" }}>
      <Navbar activePage="공약" />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "32px 0 16px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#29ABE2", margin: 0 }}>핵심 공약</h1>
          <p style={{ color: "#555", marginTop: 8 }}>말이 아닌 행동으로, 주민의 삶을 바꾸는 약속</p>
        </div>
        {PLEDGES.map((p, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,87,255,0.08)", marginBottom: 16, display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ fontSize: 44, minWidth: 56, textAlign: "center" }}>{p.icon}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#29ABE2", color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>{i + 1}</span>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{p.title}</h3>
              </div>
              <p style={{ color: "#444", lineHeight: 1.7, margin: 0, fontSize: 15 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
      `}</style>
    </div>
  );
}
