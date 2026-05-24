"use client";

import { useEffect, useState } from "react";
import { adminGet } from "@/lib/admin-fetch";
import { Users, Eye, TrendingUp, Globe } from "lucide-react";

interface Stats {
  totals: { all: number; last30Days: number; last7Days: number; today: number };
  uniqueSessions: { last30Days: number; last7Days: number; today: number };
  topPaths: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  daily: { date: string; count: number }[];
}

interface Recent {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  session_id: string;
  created_at: string;
}

function shortUA(ua: string | null): string {
  if (!ua) return "—";
  if (/iPhone|iPad/i.test(ua)) return "iOS Safari";
  if (/Android/i.test(ua)) return "Android";
  if (/Edg/i.test(ua)) return "Edge";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua)) return "Safari";
  return ua.slice(0, 30);
}

function timeAgo(date: string): string {
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (sec < 60) return "방금 전";
  if (sec < 3600) return `${Math.floor(sec / 60)}분 전`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}시간 전`;
  return `${Math.floor(sec / 86400)}일 전`;
}

export default function VisitorsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminGet("action=stats", "/api/admin/visits"),
      adminGet("action=recent&limit=100", "/api/admin/visits"),
    ])
      .then(([s, r]) => {
        setStats(s);
        setRecent(r.data ?? []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("통계를 불러오지 못했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">방문자 통계를 불러오는 중...</div>
    );
  }
  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        {error || "데이터 없음"}
      </div>
    );
  }

  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">방문자 통계</h1>

      {/* 메트릭 카드 4개 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Eye}
          label="오늘 페이지뷰"
          value={stats.totals.today}
          sub={`고유 ${stats.uniqueSessions.today}명`}
          color="from-sky-500 to-sky-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="최근 7일 페이지뷰"
          value={stats.totals.last7Days}
          sub={`고유 ${stats.uniqueSessions.last7Days}명`}
          color="from-violet-500 to-violet-600"
        />
        <MetricCard
          icon={Users}
          label="최근 30일 페이지뷰"
          value={stats.totals.last30Days}
          sub={`고유 ${stats.uniqueSessions.last30Days}명`}
          color="from-emerald-500 to-emerald-600"
        />
        <MetricCard
          icon={Globe}
          label="전체 누적 페이지뷰"
          value={stats.totals.all}
          sub="개설 후 전체"
          color="from-rose-500 to-rose-600"
        />
      </div>

      {/* 일별 차트 */}
      <section className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-800">최근 30일 일별 페이지뷰</h2>
        <div className="flex h-40 items-end gap-1">
          {stats.daily.map((d) => {
            const ratio = (d.count / maxDaily) * 100;
            return (
              <div
                key={d.date}
                className="group relative flex-1 min-w-0"
                title={`${d.date}: ${d.count}`}
              >
                <div
                  className="rounded-t bg-gradient-to-t from-sky-400 to-sky-500"
                  style={{ height: `${Math.max(ratio, 2)}%` }}
                />
                <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                  {d.date.slice(5)} · {d.count}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>{stats.daily[0]?.date.slice(5)}</span>
          <span>{stats.daily[stats.daily.length - 1]?.date.slice(5)}</span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-800">인기 페이지 (최근 30일)</h2>
          <ul className="divide-y">
            {stats.topPaths.length === 0 && (
              <li className="py-3 text-sm text-gray-400">데이터 없음</li>
            )}
            {stats.topPaths.map((p) => {
              const ratio = (p.count / (stats.topPaths[0]?.count || 1)) * 100;
              return (
                <li key={p.path} className="py-2.5">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <code className="truncate font-mono text-sky-700">{p.path}</code>
                    <span className="ml-2 font-bold text-gray-700">{p.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded bg-gray-100">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-sky-500"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Top Referrers */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-800">유입 경로 (최근 30일)</h2>
          <ul className="divide-y">
            {stats.topReferrers.length === 0 && (
              <li className="py-3 text-sm text-gray-400">데이터 없음</li>
            )}
            {stats.topReferrers.map((r) => {
              const ratio = (r.count / (stats.topReferrers[0]?.count || 1)) * 100;
              const display =
                r.referrer === "(direct)"
                  ? "직접 접속"
                  : (() => {
                      try {
                        return new URL(r.referrer).hostname;
                      } catch {
                        return r.referrer;
                      }
                    })();
              return (
                <li key={r.referrer} className="py-2.5">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="truncate text-gray-700">{display}</span>
                    <span className="ml-2 font-bold text-gray-700">{r.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded bg-gray-100">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-violet-500"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Recent visits */}
      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-800">최근 방문 (최신 100건)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500">
              <tr className="border-b">
                <th className="py-2 pr-3">시간</th>
                <th className="py-2 pr-3">페이지</th>
                <th className="py-2 pr-3">유입</th>
                <th className="py-2 pr-3">브라우저</th>
                <th className="py-2 pr-3">세션</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-center text-gray-400">
                    데이터 없음
                  </td>
                </tr>
              )}
              {recent.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-3 whitespace-nowrap text-gray-600">
                    {timeAgo(r.created_at)}
                  </td>
                  <td className="py-2 pr-3">
                    <code className="font-mono text-sky-700">{r.path}</code>
                  </td>
                  <td className="py-2 pr-3 text-gray-600">
                    {r.referrer
                      ? (() => {
                          try {
                            return new URL(r.referrer).hostname;
                          } catch {
                            return r.referrer.slice(0, 30);
                          }
                        })()
                      : "직접"}
                  </td>
                  <td className="py-2 pr-3 text-gray-600">{shortUA(r.user_agent)}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-gray-400">
                    {r.session_id.slice(2, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  sub: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-sm`}>
      <Icon className="mb-2 h-6 w-6 opacity-80" />
      <p className="text-3xl font-black">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm opacity-90">{label}</p>
      <p className="text-xs opacity-70">{sub}</p>
    </div>
  );
}
