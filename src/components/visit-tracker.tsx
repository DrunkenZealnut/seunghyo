"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "seunghyo_session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;

    const sessionId = getOrCreateSessionId();
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent || null;

    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer,
        user_agent: userAgent,
        session_id: sessionId,
      }),
      keepalive: true,
    }).catch((err) => {
      console.warn("[visit-tracker]", err);
    });
  }, [pathname]);

  return null;
}
