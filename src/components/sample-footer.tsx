const LINKS = [
  { label: "홈", path: "/" },
  { label: "소개", path: "/about" },
  { label: "공약", path: "/pledges" },
  { label: "소식", path: "/news" },
  { label: "의견함", path: "/opinions" },
  { label: "후원", path: "/donate" },
];

export default function SampleFooter({ note }: { note?: string }) {
  return (
    <footer>
      <div className="foot">
        <div className="id">
          <span className="party">진보당</span>
          <span className="cand">이승효</span>
        </div>
        <div className="links">
          {LINKS.map((l) => (
            <a key={l.path} href={l.path}>
              {l.label}
            </a>
          ))}
        </div>
        <small>
          {note ??
            "서울특별시의회의원선거 · 동대문구 제2선거구(회기동·휘경1·2동·이문1·2동) 시의원 후보 이승효 · 진보당"}
        </small>
      </div>
    </footer>
  );
}
