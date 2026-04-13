"use client";

import dynamic from "next/dynamic";

const SeunghyoApp = dynamic(() => import("./SeunghyoApp"), { ssr: false });

export default function Home() {
  return <SeunghyoApp />;
}
