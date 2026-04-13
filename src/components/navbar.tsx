"use client";

import { useState } from "react";

const NAV_ITEMS = ["홈", "소개", "공약", "소식", "의견함", "후원"] as const;
const NAV_ICONS: Record<string, string> = { "홈": "🏠", "소개": "👤", "공약": "📋", "소식": "📰", "의견함": "💬", "후원": "💙" };

const ROUTE_MAP: Record<string, string> = {
  "홈": "/",
  "소개": "/#소개",
  "공약": "/#공약",
  "소식": "/#소식",
  "의견함": "/opinions",
  "후원": "/donate",
};

export default function Navbar({ activePage }: { activePage?: string }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const navTo = (p: string) => {
    setMobileMenu(false);
    const route = ROUTE_MAP[p];
    if (route) {
      window.location.href = route;
    }
  };

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "2px solid #29ABE2", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 60 }}>
        <div onClick={() => navTo("홈")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#29ABE2", color: "#fff", fontWeight: 900, fontSize: 13, padding: "3px 8px", borderRadius: 4 }}>진보당</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#29ABE2" }}>이승효</span>
        </div>
        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 4 }} className="seunghyo-desktop-nav">
          {NAV_ITEMS.map(p => (
            <button key={p} onClick={() => navTo(p)} style={{ background: activePage === p ? "#29ABE2" : "transparent", color: activePage === p ? "#fff" : "#0A0F2C", border: "none", borderRadius: 20, padding: "6px 16px", fontWeight: activePage === p ? 700 : 500, cursor: "pointer", fontSize: 14, transition: "all 0.2s", fontFamily: "inherit" }}>{p}</button>
          ))}
        </div>
        {/* Mobile menu btn */}
        <button onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#29ABE2" }} className="seunghyo-mobile-menu-btn">☰</button>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenu && (
        <div style={{ position: "fixed", top: 60, left: 0, right: 0, zIndex: 99, background: "#fff", borderBottom: "2px solid #29ABE2", padding: "8px 0" }}>
          {NAV_ITEMS.map(p => (
            <button key={p} onClick={() => navTo(p)} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 24px", background: activePage === p ? "#E8F5FF" : "none", color: "#0A0F2C", border: "none", fontWeight: activePage === p ? 700 : 500, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
          ))}
        </div>
      )}

      {/* Bottom nav (mobile) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e0e6f0", display: "flex", zIndex: 50 }} className="seunghyo-bottom-nav">
        {NAV_ITEMS.map(p => (
          <button key={p} onClick={() => navTo(p)} style={{ flex: 1, padding: "10px 0", background: "none", border: "none", fontSize: 11, fontWeight: activePage === p ? 800 : 500, color: activePage === p ? "#29ABE2" : "#888", cursor: "pointer", fontFamily: "inherit" }}>
            {NAV_ICONS[p]}<br />{p}
          </button>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        @media(max-width:640px){ .seunghyo-desktop-nav{display:none!important} .seunghyo-mobile-menu-btn{display:block!important} }
        .seunghyo-bottom-nav { display: none!important; }
        @media(max-width:640px){ .seunghyo-bottom-nav{ display:flex!important; } }
      `}</style>
    </>
  );
}
