import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주민 의견함 - 이승효",
  description: "동대문 주민 여러분의 의견을 자유롭게 남겨주세요",
};

export default function OpinionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
