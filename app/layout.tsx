import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 사이트 제목과 설명을 프로젝트에 맞게 수정했습니다.
export const metadata: Metadata = {
  title: "S-Power 방문예약 시스템",
  description: "에스파워 방문객 관리 및 승인 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko"> {/* 언어 설정을 한국어로 변경했습니다. */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0 }} // 기본 여백을 제거하여 디자인을 깔끔하게 유지합니다.
      >
        {children}
      </body>
    </html>
  );
}