"use client";

import { useState } from "react";

export type ActivePage = "홈" | "소개" | "공약" | "소식" | "의견함" | "후원" | undefined;

const NAV_ITEMS = [
  { label: "홈", path: "/" },
  { label: "소개", path: "/about" },
  { label: "공약", path: "/pledges" },
  { label: "소식", path: "/news" },
  { label: "의견함", path: "/opinions" },
  { label: "후원", path: "/donate" },
] as const;

export default function SampleNavbar({ activePage }: { activePage?: ActivePage }) {
  const [open, setOpen] = useState(false);
  const nav = (p: string) => {
    setOpen(false);
    window.location.href = p;
  };

  return (
    <header>
      <nav className="nav">
        <button className="brand" onClick={() => nav("/")} aria-label="홈">
          <span className="party">진보당</span>
          <span className="cand">이승효</span>
        </button>
        <button className="burger" aria-label="메뉴" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
        <div className={`menu${open ? " open" : ""}`}>
          {NAV_ITEMS.map((item) => {
            const on = activePage === item.label;
            const isDonate = item.label === "후원";
            const cls = [on ? "on" : "", isDonate ? "donate" : ""].filter(Boolean).join(" ");
            return (
              <a
                key={item.path}
                href={item.path}
                className={cls || undefined}
                onClick={(e) => {
                  e.preventDefault();
                  nav(item.path);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
