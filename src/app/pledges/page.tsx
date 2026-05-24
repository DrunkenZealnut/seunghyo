import type { Metadata } from "next";
import SampleNavbar from "@/components/sample-navbar";
import SampleFooter from "@/components/sample-footer";
import SamplePledgeCards from "@/components/sample-pledge-cards";

export const metadata: Metadata = {
  title: "공약 - 이승효",
  description: "이승효 후보 공약 - 동대문구 제2선거구(이문·회기·휘경) 9대 약속",
};

const INDEX_ITEMS = [
  { id: "p1", num: "01", ttl: "편안한 출퇴근, 다니기 좋은 동네" },
  { id: "p2", num: "02", ttl: "아이 키우기 좋게, 어르신이 건강하게" },
  { id: "p3", num: "03", ttl: "청년·여성이 행복하고 안전하게" },
  { id: "p4", num: "04", ttl: "전세사기, 세입자가 책임지지 않도록" },
  { id: "p5", num: "05", ttl: "동부간선 지하화, 주민과 함께" },
  { id: "p6", num: "06", ttl: "노동이 존중받는 동대문" },
  { id: "p7", num: "07", ttl: "자영업자·소상공인의 버팀목" },
  { id: "p8", num: "08", ttl: "내란세력 청산, 정치교체" },
  { id: "p9", num: "09", ttl: "우리 동네 큰 땅, 공공의 자산으로" },
];

export default function PledgesPage() {
  return (
    <div className="pl-page">
      <div className="wrap">
        <SampleNavbar activePage="공약" />

        <section className="hero">
          <span className="kicker">동대문구 제2선거구 · 시의원 후보 이승효</span>
          <h1>
            이문·휘경·회기동,
            <br />
            <span className="hl">살만 하십니까?</span>
          </h1>
          <p className="sub">
            출퇴근 교통 문제부터 달빛어린이병원, 어르신돌봄, 전세사기, 노동과 골목상권까지 — 주민의
            하루를 바꾸는 이승효의 <b>9대 약속</b>입니다.
          </p>
          <div className="meta">
            <span className="tag fill">이문 1·2동</span>
            <span className="tag fill">휘경 1·2동</span>
            <span className="tag fill">회기동</span>
            <span className="tag">9대 약속 / 31개 정책</span>
          </div>
        </section>

        <div className="layout">
          <aside className="index">
            <div className="lbl">9대 약속</div>
            <div className="scroller">
              {INDEX_ITEMS.map((i) => (
                <a key={i.id} href={`#${i.id}`}>
                  <span className="num">{i.num}</span>
                  <span className="ttl">{i.ttl}</span>
                </a>
              ))}
            </div>
          </aside>

          <SamplePledgeCards />
        </div>

        <section className="cta">
          <div className="cta-inner">
            <h3>
              주민의 하루를 바꾸는
              <br />
              가장 확실한 한 표.
            </h3>
            <p>이승효의 약속이 동네를 바꿉니다. 함께 만들어 주세요.</p>
            <div className="btns">
              <a className="btn primary" href="/opinions">
                의견 보내기
              </a>
            </div>
          </div>
        </section>

        <SampleFooter note="동대문구 제2선거구(이문·회기·휘경) 서울시의원 후보 이승효 · 진보당" />
      </div>
    </div>
  );
}
