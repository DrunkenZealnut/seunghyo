"use client";

import SampleNavbar from "@/components/sample-navbar";
import SampleFooter from "@/components/sample-footer";

export default function App() {
  return (
    <div className="idx-page">
      <SampleNavbar activePage="홈" />

      <section className="hero">
        <div className="hero-grid">
          <div className="htext">
            <span className="badge">
              서울시의원 후보 · 진보당 <b>기호 5번</b>
            </span>
            <h1>
              내란세력 완전청산
              <br />
              <span className="blk">동대문구 정치교체</span>
            </h1>
            <div className="nameplate">
              <div className="no">5</div>
              <div className="nm">
                <div className="tag-line">일하는 사람의 시의원</div>
                <h2>이승효</h2>
              </div>
            </div>
            <div className="district">
              <span className="d">회기동</span>
              <span className="d">휘경 1·2동</span>
              <span className="d">이문 1·2동</span>
            </div>
            <div className="cta-row">
              <a className="btn red" href="/pledges">
                8대 약속 보기 →
              </a>
            </div>
          </div>

          <div className="poster-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.jpeg" alt="이승효 후보 선거 벽보 - 동대문구 제2선거구" />
          </div>
        </div>
      </section>

      <div className="band">
        <p>
          출퇴근 교통 문제부터 달빛어린이병원, 어르신돌봄, 전세사기, 노동과 골목상권까지
          <br />
          <span className="r">주민의 하루</span>를 바꾸는 이승효의 약속
        </p>
      </div>

      <section className="block">
        <span className="eyebrow">Profile · 약력</span>
        <h2 className="sec-title">현장에서 일해 온 사람</h2>
        <div className="bio">
          <div className="row">
            <span className="k">학력</span>광주 고려고등학교 졸업
          </div>
          <div className="row">
            <span className="k">학력</span>동국대학교 국어교육과 졸업
          </div>
          <div className="row">
            <span className="k">전</span>동국대학교 총학생회 부총학생회장
          </div>
          <div className="row">
            <span className="k now">현</span>진보당 달빛어린이병원 추진 공동운동본부장
          </div>
          <div className="row">
            <span className="k now">현</span>진보당 동대문지역위 민생위원장
          </div>
          <div className="row">
            <span className="k now">현</span>민주노총 서비스연맹 정책국장
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <span className="eyebrow">Pledges · 핵심 약속</span>
        <h2 className="sec-title">동네를 바꾸는 8대 약속, 미리보기</h2>
        <div className="promises">
          <a className="pr" href="/pledges#p1">
            <div className="pn">01</div>
            <h3>편안한 출퇴근</h3>
            <p>외대앞역 엘리베이터·신이문역 안심 정비, 배차 개선</p>
          </a>
          <a className="pr" href="/pledges#p2">
            <div className="pn">02</div>
            <h3>아이·어르신 돌봄</h3>
            <p>야간·주말 달빛어린이병원, 키움센터·돌봄주치의</p>
          </a>
          <a className="pr" href="/pledges#p4">
            <div className="pn">04</div>
            <h3>전세사기 대응</h3>
            <p>신고는 임차인, 증거수집은 서울시가 원스톱 대행</p>
          </a>
          <a className="pr" href="/pledges#p6">
            <div className="pn">06</div>
            <h3>존중받는 노동</h3>
            <p>노동자 종합지원센터, 플랫폼·돌봄노동 권리보장</p>
          </a>
        </div>
        <div className="more">
          <a className="btn navy" href="/pledges">
            8대 약속 전체 보기 →
          </a>
        </div>
      </section>

      <section className="cta-band">
        <h3>
          가장 확실한 정치교체,
          <br />
          기호 5번 이승효입니다.
        </h3>
        <div className="cta-row">
          <a className="btn navy" href="/opinions">
            의견 보내기 →
          </a>
        </div>
      </section>

      <SampleFooter />
    </div>
  );
}
