"use client";

import Navbar from "@/components/navbar";
import { INITIAL_NEWS } from "@/data/site-data";

export default function NewsPage() {
  return (
    <div style={{ fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif", background: "#F5F7FF", minHeight: "100vh", color: "#0A0F2C" }}>
      <Navbar activePage="소식" />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "32px 0 16px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#29ABE2", margin: 0 }}>활동 소식</h1>
        </div>
        {INITIAL_NEWS.map(n => (
          <div key={n.id} style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,87,255,0.08)", marginBottom: 16 }}>
            <div style={{ color: "#29ABE2", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{n.date}</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800 }}>{n.title}</h3>
            <p style={{ color: "#555", lineHeight: 1.7, margin: 0, fontSize: 15 }}>{n.body}</p>
          </div>
        ))}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
      `}</style>
    </div>
  );
}
