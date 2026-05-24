import type { Metadata } from "next";
import { Noto_Sans_KR, Archivo, Black_Han_Sans, Geist_Mono } from "next/font/google";
import VisitTracker from "@/components/visit-tracker";
import "./globals.css";

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-black-han-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "이승효 · 일하는 사람의 시의원",
  description:
    "일하는 사람의 시의원 이승효 — 동대문구 제2선거구(이문·회기·휘경) 서울시의원 후보, 진보당 기호 5번",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoKr.variable} ${archivo.variable} ${blackHanSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
