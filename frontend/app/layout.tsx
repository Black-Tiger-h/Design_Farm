import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Design_Farm — 일상에 머무는 예술",
  description:
    "새로운 작가의 시선이 당신의 일상으로. 회화, 조소, 공예를 만나는 온라인 미술관.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
