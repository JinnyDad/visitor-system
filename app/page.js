"use client"; // 반드시 첫 줄에 있어야 합니다!

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px" }}>
      {/* 테스트를 위해 아주 심플하게 작성했습니다 */}
      <h1>S-Power 방문예약 시스템</h1>
      <button onClick={() => router.push("/spowervisitor")}>방문자 등록 시작하기</button>
      <br /><br />
      <button onClick={() => router.push("/login")}>관리자 로그인</button>
    </div>
  );
}