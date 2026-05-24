export type PledgeCategory =
  | "Transit"
  | "Care"
  | "Youth-Women"
  | "Housing"
  | "Dongbu"
  | "Labor"
  | "Small-Business"
  | "Politics"
  | "Infra";

export interface PledgeSubItem {
  text: string;
  boldParts?: string[];
}

export interface Pledge {
  id: string;
  num: string;
  category: PledgeCategory;
  categoryKo: string;
  title: string;
  subItems: PledgeSubItem[];
  accent?: boolean;
}

export interface Career {
  period: "학력" | "전" | "현";
  label: string;
}

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  body: string;
}

export const DISTRICT_LABELS = ["회기동", "휘경 1·2동", "이문 1·2동"] as const;
export const PARTY = "진보당";
export const CAND_NAME = "이승효";
export const CAND_NUMBER = "5";
export const CAND_TAGLINE = "일하는 사람의 시의원";
export const CAND_HEADLINE_TOP = "내란세력 완전청산";
export const CAND_HEADLINE_BOTTOM = "동대문구 정치교체";
export const DISTRICT_FULL =
  "서울특별시의회의원선거 · 동대문구 제2선거구(회기동·휘경1·2동·이문1·2동) 시의원 후보 이승효 · 진보당";

export const PLEDGES: Pledge[] = [
  {
    id: "p1",
    num: "01",
    category: "Transit",
    categoryKo: "교통",
    title: "편안한 출퇴근, 다니기 좋은 우리 동네",
    subItems: [
      { text: "대중교통 노선 배차 개선 및 교통 사각지대 해소" },
      {
        text: "폭염·혹한을 피할 수 있는 스마트 정류장 설치 및 확대",
        boldParts: ["스마트 정류장"],
      },
      {
        text: "외대앞역 2번 승강장 엘리베이터 설치 — 유모차·휠체어 이용불가 상태 종식",
        boldParts: ["외대앞역 2번 승강장 엘리베이터 설치"],
      },
      { text: "신이문역 공사 조속 추진 및 주변 보안조명·CCTV·안심귀가 거점 보완" },
      { text: "회기역 1호선·경의중앙선 구간 개선 종합대책 요구" },
      {
        text: "휘경2동 교통문제 개선 — 면목선 배봉·장안교 정거장을 인근 대단지 아파트에서도 도보로 이용 가능한 위치에 설정하도록 역 위치 의견 적극 개진, 청량리역 GTX 연계노선 확충",
        boldParts: ["휘경2동 교통문제 개선"],
      },
      { text: "무장애 보행로(1층 경사로) 동대문 우선 사업 지정" },
    ],
  },
  {
    id: "p2",
    num: "02",
    category: "Care",
    categoryKo: "돌봄",
    title: "아이 키우기 좋게, 어르신이 건강하게",
    subItems: [
      {
        text: "동대문구 야간·주말 달빛어린이병원 추진 및 서울시 예산 지원",
        boldParts: ["달빛어린이병원"],
      },
      { text: "거점형 키움센터 유치, 청소년 문화의 집 신설 등 아동·청소년 복지문화 공간 확충" },
      { text: "어르신 대상포진 예방접종 무료대상 확대" },
      { text: "어르신 돌봄 주치의 시범사업 동대문 유치" },
    ],
  },
  {
    id: "p3",
    num: "03",
    category: "Youth-Women",
    categoryKo: "청년·여성",
    title: "청년이 떠나는 동네가 아니라, 청년이 사는 동대문",
    subItems: [
      {
        text: "대학연합형 청년·신혼부부 공공임대주택 시 공급 확대 — 외대·경희대·시립대 권역",
      },
      { text: "청년 AI·디지털 역량 지원 — 자격증·취업준비·청년노동권" },
      { text: "청년 알바 임금체불 통합 신고센터 신설" },
      { text: "신혼부부·청년 공공임대주택 공급" },
      { text: "청년 마음건강지원 확대 — 서울청년센터 동대문 거점 강화" },
      {
        text: "디지털성범죄안심지원센터 설치",
        boldParts: ["디지털성범죄안심지원센터"],
      },
      { text: "여성·청소년 생리대 보편지원 전면 확대" },
    ],
  },
  {
    id: "p4",
    num: "04",
    category: "Housing",
    categoryKo: "주거",
    title: "전세사기 입증을 세입자가 책임지지 않도록",
    subItems: [
      {
        text: "전세사기 신고·증거수집 원스톱 지원 — 임차인은 신고만, 서울시가 등기·체납·중개기록 자료수집을 대행하고 수사기관에 이관",
        boldParts: ["전세사기 신고·증거수집 원스톱 지원"],
      },
      {
        text: "모든 임대인 전세금 반환보증 의무가입 법 개정 촉구 및 시 차원의 보증료 지원 확대",
      },
    ],
  },
  {
    id: "p5",
    num: "05",
    category: "Dongbu",
    categoryKo: "동부간선",
    title: "동부간선 지하화, 주민과 함께 다시",
    subItems: [
      { text: "진입 램프 구간 문제 재검토 — 시의회 결의안·예산심의 적극 활용" },
      { text: "통학로·산책로 대안 마련 의무화 — 도시계획 조례 개정" },
      { text: "주민협의체 조례화" },
    ],
  },
  {
    id: "p6",
    num: "06",
    category: "Labor",
    categoryKo: "노동",
    accent: true,
    title: "노동이 존중받는 동대문 만들기",
    subItems: [
      {
        text: "동대문구 노동자 종합 지원센터 설치",
        boldParts: ["노동자 종합 지원센터"],
      },
      { text: "플랫폼·특수고용노동자 권리보장 시범 사업 동대문구 유치" },
      { text: "돌봄노동자 권익보호 조례 제정 및 처우 개선" },
    ],
  },
  {
    id: "p7",
    num: "07",
    category: "Small-Business",
    categoryKo: "자영업·소상공인",
    accent: true,
    title: "자영업자·소상공인의 버팀목이 필요해",
    subItems: [
      { text: "소상공인 부채조정·재기 지원 시 보조 확대" },
      { text: "1인 자영업자 사회 안전망 확충" },
      { text: "공공배달앱 동대문구 활성화" },
    ],
  },
  {
    id: "p8",
    num: "08",
    category: "Politics",
    categoryKo: "정치혁신",
    title: "내란세력 완전 청산! 동대문구 정치교체!",
    subItems: [
      { text: "오세훈 서울시정의 피해 회복" },
      { text: "공직자 헌정질서 책임 강화" },
    ],
  },
  {
    id: "p9",
    num: "09",
    category: "Infra",
    categoryKo: "공공 인프라 개발",
    accent: true,
    title: "우리 동네 큰 땅을 공공의 자산으로",
    subItems: [
      {
        text: "이문 차량사업소 복합개발 도시계획위원회 심의에서 공공임대·보육·노인복지·청년주거 비율 명시 확보",
        boldParts: ["이문 차량사업소 복합개발"],
      },
      {
        text: "연탄공장 이전 부지·철도 하부공간을 사익 개발이 아닌 주민 생활·공공시설로 — 공공기여 비율 조례화",
      },
      { text: "신이문역 역세권 개발이익의 지역 환원 장치 명문화" },
    ],
  },
];

export const PLEDGE_PREVIEW_IDS = ["p1", "p2", "p4", "p6"] as const;

export const CAREERS: Career[] = [
  { period: "학력", label: "광주 고려고등학교 졸업" },
  { period: "학력", label: "동국대학교 국어교육과 졸업" },
  { period: "전", label: "동국대학교 총학생회 부총학생회장" },
  { period: "전", label: "학교급식법 개정 100만 청원운동본부 언론홍보팀 총괄" },
  { period: "현", label: "진보당 달빛어린이병원 추진 공동운동본부장" },
  { period: "현", label: "진보당 동대문지역위 민생위원장" },
  { period: "현", label: "민주노총 서비스연맹 정책국장" },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 1,
    date: "2026.04.10",
    title: "이승효 후보, 달빛어린이병원 공약 발표",
    body: "야간·휴일 소아과 공백을 해결하기 위해 동대문구 달빛어린이병원 설치를 공식 공약으로 발표했습니다.",
  },
  {
    id: 2,
    date: "2026.04.07",
    title: "진보당 서울시의원 후보 출마 선언",
    body: "오직 주민편! 새로운 선택 이승효 후보가 동대문 제2선거구 출마를 공식 선언했습니다.",
  },
  {
    id: 3,
    date: "2026.04.03",
    title: "지하철 1호선 지하화 추진 서명운동 시작",
    body: "회기동·이문동 주민들과 함께 1호선 지하화 서명운동을 시작했습니다. 1,000명을 목표로 합니다.",
  },
];
