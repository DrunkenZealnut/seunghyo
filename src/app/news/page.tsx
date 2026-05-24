import type { Metadata } from "next";
import SampleNavbar from "@/components/sample-navbar";
import SampleFooter from "@/components/sample-footer";
import { INITIAL_NEWS } from "@/data/site-data";

export const metadata: Metadata = {
  title: "활동 소식 - 이승효",
  description: "이승효 후보의 캠페인 활동·공약 발표·서명운동 등 현장 소식.",
};

export default function NewsPage() {
  return (
    <div className="pl-page">
      <div className="wrap">
        <SampleNavbar activePage="소식" />

        <section className="hero">
          <span className="kicker">News · 활동 소식</span>
          <h1>
            현장에서 전하는
            <br />
            <span className="hl">소식</span>
          </h1>
          <p className="sub">이승효 후보의 캠페인 활동·공약 발표·서명운동 등 현장 소식을 전합니다.</p>
        </section>

        <div className="layout" style={{ gridTemplateColumns: "1fr", paddingTop: 8 }}>
          <div className="promises">
            {INITIAL_NEWS.map((n, idx) => (
              <article key={n.id} className={`card show${idx % 3 === 2 ? " accent" : ""}`}>
                <div className="head">
                  <div className="num">{String(idx + 1).padStart(2, "0")}</div>
                  <div className="htext">
                    <div className="em">{n.date}</div>
                    <h2>{n.title}</h2>
                  </div>
                </div>
                <ul>
                  <li>{n.body}</li>
                </ul>
              </article>
            ))}
          </div>
        </div>

        <SampleFooter />
      </div>
    </div>
  );
}
