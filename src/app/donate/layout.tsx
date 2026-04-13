import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "후원금 입금정보 입력 - 이승효",
  description: "이승효 후보 후원 기부금영수증 발급을 위한 입금정보 입력 페이지",
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
