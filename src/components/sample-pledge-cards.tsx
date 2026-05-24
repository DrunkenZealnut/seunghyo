"use client";

import { useEffect, useRef } from "react";

interface PledgeItem {
  text?: string;
  bold?: string;
  after?: string;
}
interface SampleCard {
  id: string;
  num: string;
  em: string;
  title: string;
  accent: boolean;
  items: PledgeItem[];
}

const CARDS: SampleCard[] = [
  { id: "p1", num: "01", em: "Transit · 교통", title: "편안한 출퇴근, 다니기 좋은 우리 동네", accent: false, items: [
    { text: "대중교통 노선 배차 개선 및 교통 사각지대 해소" },
    { text: "폭염·혹한을 피할 수 있는 ", bold: "스마트 정류장", after: " 설치 및 확대" },
    { bold: "외대앞역 2번 승강장 엘리베이터 설치", after: " — 유모차·휠체어 이용불가 상태 종식" },
    { text: "신이문역 공사 조속 추진 및 주변 보안조명·CCTV·안심귀가 거점 보완" },
    { text: "회기역 1호선·경의중앙선 구간 개선 종합대책 요구" },
    { bold: "휘경2동 교통문제 개선", after: " — 면목선 배봉·장안교 정거장을 인근 대단지 아파트에서도 도보로 이용 가능한 위치에 설정하도록 역 위치 의견 적극 개진, 청량리역 GTX 연계노선 확충" },
    { text: "무장애 보행로(1층 경사로) 동대문 우선 사업 지정" },
  ]},
  { id: "p2", num: "02", em: "Care · 돌봄", title: "아이 키우기 좋게, 어르신이 건강하게", accent: false, items: [
    { text: "동대문구 야간·주말 ", bold: "달빛어린이병원", after: " 추진 및 서울시 예산 지원" },
    { text: "거점형 키움센터 유치, 청소년 문화의 집 신설 등 아동·청소년 복지문화 공간 확충" },
    { text: "어르신 대상포진 예방접종 무료대상 확대" },
    { text: "어르신 돌봄 주치의 시범사업 동대문 유치" },
  ]},
  { id: "p3", num: "03", em: "Youth · Women", title: "청년·여성이 행복하고 안전하게", accent: false, items: [
    { text: "신혼부부·청년 공공임대주택 공급" },
    { text: "청년 마음건강지원 확대 — 서울청년센터 동대문 거점 강화" },
    { bold: "디지털성범죄안심지원센터", after: " 설치" },
    { text: "여성·청소년 생리대 보편지원 전면 확대" },
  ]},
  { id: "p4", num: "04", em: "Housing · 주거", title: "전세사기 입증을 세입자가 책임지지 않도록", accent: false, items: [
    { bold: "전세사기 신고·증거수집 원스톱 지원", after: " — 임차인은 신고만, 서울시가 등기·체납·중개기록 자료수집을 대행하고 수사기관에 이관" },
    { text: "모든 임대인 전세금 반환보증 의무가입 법 개정 촉구 및 시 차원의 보증료 지원 확대" },
  ]},
  { id: "p5", num: "05", em: "Dongbu Expressway", title: "동부간선 지하화, 주민과 함께 다시", accent: false, items: [
    { text: "진입 램프 구간 문제 재검토 — 시의회 결의안·예산심의 적극 활용" },
    { text: "통학로·산책로 대안 마련 의무화 — 도시계획 조례 개정" },
    { text: "주민협의체 조례화" },
  ]},
  { id: "p6", num: "06", em: "Labor · 노동", title: "노동이 존중받는 동대문 만들기", accent: true, items: [
    { text: "동대문구 ", bold: "노동자 종합 지원센터", after: " 설치" },
    { text: "플랫폼·특수고용노동자 권리보장 시범 사업 동대문구 유치" },
    { text: "돌봄노동자 권익보호 조례 제정 및 처우 개선" },
  ]},
  { id: "p7", num: "07", em: "Small Business", title: "자영업자·소상공인의 버팀목이 필요해", accent: true, items: [
    { text: "소상공인 부채조정·재기 지원 시 보조 확대" },
    { text: "1인 자영업자 사회 안전망 확충" },
    { text: "공공배달앱 동대문구 활성화" },
  ]},
  { id: "p8", num: "08", em: "Politics · 정치교체", title: "내란세력 완전 청산! 동대문구 정치교체!", accent: false, items: [
    { text: "오세훈 서울시정의 피해 회복" },
    { text: "공직자 헌정질서 책임 강화" },
  ]},
];

export default function SamplePledgeCards() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const cards = containerRef.current?.querySelectorAll<HTMLElement>(".card") ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.animationDelay = `${(i % 3) * 60}ms`;
            target.classList.add("show");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((c) => io.observe(c));

    const indexLinks = document.querySelectorAll<HTMLAnchorElement>(".pl-page .index a");
    const map = new Map<string, HTMLAnchorElement>();
    indexLinks.forEach((l) => {
      const href = l.getAttribute("href");
      if (href) map.set(href.slice(1), l);
    });
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) {
            indexLinks.forEach((l) => l.classList.remove("active"));
            map.get(x.target.id)?.classList.add("active");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    cards.forEach((c) => spy.observe(c));

    return () => {
      io.disconnect();
      spy.disconnect();
    };
  }, []);

  return (
    <div className="promises" ref={containerRef}>
      {CARDS.map((c) => (
        <article key={c.id} className={`card${c.accent ? " accent" : ""}`} id={c.id}>
          <div className="head">
            <div className="num">{c.num}</div>
            <div className="htext">
              <div className="em">{c.em}</div>
              <h2>{c.title}</h2>
            </div>
          </div>
          <ul>
            {c.items.map((item, i) => (
              <li key={i}>
                {item.text}
                {item.bold && <b>{item.bold}</b>}
                {item.after}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
