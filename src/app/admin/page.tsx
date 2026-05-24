"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGet } from "@/lib/admin-fetch";
import { Heart, MessageSquare, HandHeart, Eye, Users, TrendingUp } from "lucide-react";

const DATA_CARDS = [
  { key: "cheers", label: "응원 메시지", href: "/admin/cheers", icon: Heart, color: "from-pink-500 to-pink-600" },
  { key: "opinions", label: "주민 의견", href: "/admin/opinions", icon: MessageSquare, color: "from-emerald-500 to-emerald-600" },
  { key: "donations", label: "후원자", href: "/admin/donations", icon: HandHeart, color: "from-rose-500 to-rose-600" },
] as const;

interface VisitStats {
  totals: { all: number; last30Days: number; last7Days: number; today: number };
  uniqueSessions: { last30Days: number; last7Days: number; today: number };
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [visits, setVisits] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminGet("action=counts"),
      adminGet("action=stats", "/api/admin/visits").catch(() => null),
    ]).then(([countsData, visitData]) => {
      setCounts(countsData);
      setVisits(visitData);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">대시보드</h1>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">방문자 현황</h2>
          <Link
            href="/admin/visitors"
            className="text-sm font-semibold text-sky-600 hover:text-sky-700"
          >
            상세 보기 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/visitors"
            className="rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Eye className="mb-2 h-6 w-6 opacity-80" />
            <p className="text-3xl font-black">
              {loading ? "—" : (visits?.totals.today ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm opacity-90">오늘 페이지뷰</p>
            <p className="text-xs opacity-70">
              {loading ? " " : `고유 ${visits?.uniqueSessions.today ?? 0}명`}
            </p>
          </Link>
          <Link
            href="/admin/visitors"
            className="rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <TrendingUp className="mb-2 h-6 w-6 opacity-80" />
            <p className="text-3xl font-black">
              {loading ? "—" : (visits?.totals.last7Days ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm opacity-90">최근 7일 페이지뷰</p>
            <p className="text-xs opacity-70">
              {loading ? " " : `고유 ${visits?.uniqueSessions.last7Days ?? 0}명`}
            </p>
          </Link>
          <Link
            href="/admin/visitors"
            className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Users className="mb-2 h-6 w-6 opacity-80" />
            <p className="text-3xl font-black">
              {loading ? "—" : (visits?.totals.last30Days ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-sm opacity-90">최근 30일 페이지뷰</p>
            <p className="text-xs opacity-70">
              {loading ? " " : `고유 ${visits?.uniqueSessions.last30Days ?? 0}명`}
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-700">데이터 현황</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DATA_CARDS.map(({ key, label, href, icon: Icon, color }) => (
            <Link
              key={key}
              href={href}
              className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
            >
              <Icon className="mb-2 h-6 w-6 opacity-80" />
              <p className="text-3xl font-black">
                {loading ? "—" : (counts[key] ?? 0)}
              </p>
              <p className="mt-1 text-sm opacity-90">{label}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
