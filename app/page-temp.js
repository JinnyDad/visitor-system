"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // 의도하지 않은 리다이렉트가 있는지 콘솔에서 확인하기 위함
  console.log("홈페이지 로드됨");

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px", textAlign: "center" }}>
      <h1 style={{ color: "#2b5a9f" }}>S-Power 방문예약 시스템</h1>
      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={() => router.push("/spowervisitor")}
          style={{ padding: "15px 30px", fontSize: "1.2rem", cursor: "pointer" }}
        >
          시작하기
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => router.push("/login")} style={{ color: "#666", border: "none", background: "none", cursor: "pointer" }}>
          관리자 로그인
        </button>
      </div>
    </div>
  );
}