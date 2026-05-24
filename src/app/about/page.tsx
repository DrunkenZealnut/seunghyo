import type { Metadata } from "next";
import SampleNavbar from "@/components/sample-navbar";
import SampleFooter from "@/components/sample-footer";

export const metadata: Metadata = {
  title: "후보 소개 - 이승효",
  description: "민주노총 서비스연맹 정책국장, 진보당 동대문 민생위원장. 현장에서 일해 온 이승효 후보 소개.",
};

export default function AboutPage() {
  return (
    <div className="pl-page">
      <div className="wrap">
        <SampleNavbar activePage="소개" />

        <section className="hero">
          <span className="kicker">About · 후보 소개</span>
          <h1>
            현장에서 일해 온 사람,
            <br />
            <span className="hl">이승효</span>
          </h1>
          <p className="sub">
            광주에서 태어나 동국대를 졸업하고, 청년 시절부터 학생운동·학교급식법 개정운동을
            이끌어온 현장 활동가입니다. 지금은 민주노총 서비스연맹 정책국장으로 노동자의 목소리를
            제도로 만드는 일을 하고 있습니다.
          </p>
          <div className="meta">
            <span className="tag fill">진보당 기호 5번</span>
            <span className="tag">동대문 제2선거구</span>
          </div>
        </section>

        <div className="layout" style={{ gridTemplateColumns: "1fr", paddingTop: 8 }}>
          <div className="promises">
            <article className="card show">
              <div className="head">
                <div className="num">01</div>
                <div className="htext">
                  <div className="em">Education · 학력</div>
                  <h2>학력</h2>
                </div>
              </div>
              <ul>
                <li>광주 고려고등학교 졸업</li>
                <li>동국대학교 국어교육과 졸업</li>
              </ul>
            </article>

            <article className="card show">
              <div className="head">
                <div className="num">02</div>
                <div className="htext">
                  <div className="em">Previous · 전</div>
                  <h2>이전 활동</h2>
                </div>
              </div>
              <ul>
                <li>동국대학교 총학생회 부총학생회장</li>
                <li>학교급식법 개정 100만 청원운동본부 언론홍보팀 총괄</li>
              </ul>
            </article>

            <article className="card accent show">
              <div className="head">
                <div className="num">03</div>
                <div className="htext">
                  <div className="em">Current · 현</div>
                  <h2>현재 활동</h2>
                </div>
              </div>
              <ul>
                <li>
                  <b>진보당 달빛어린이병원</b> 추진 공동운동본부장
                </li>
                <li>진보당 동대문지역위 민생위원장</li>
                <li>민주노총 서비스연맹 정책국장</li>
              </ul>
            </article>
          </div>
        </div>

        <section className="cta">
          <div className="cta-inner">
            <h3>
              오직 주민편,
              <br />
              새로운 선택 이승효.
            </h3>
            <p>회기동 · 휘경1·2동 · 이문1·2동 주민과 함께 만들어가겠습니다.</p>
            <div className="btns">
              <a className="btn primary" href="/opinions">
                의견 보내기
              </a>
              <a className="btn ghost" href="/donate">
                후원하기
              </a>
            </div>
          </div>
        </section>

        <SampleFooter />
      </div>
    </div>
  );
}
