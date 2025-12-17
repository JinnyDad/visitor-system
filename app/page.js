"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      backgroundColor: "#f0f2f5" 
    }}>
      <div style={{ 
        padding: "40px", 
        backgroundColor: "white", 
        borderRadius: "15px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1 style={{ color: "#1e3a8a", marginBottom: "20px" }}>S-Power 방문예약 시스템</h1>
        <p style={{ marginBottom: "30px", color: "#666" }}>방문을 환영합니다. 아래 버튼을 선택해 주세요.</p>
        
        <button 
          onClick={() => router.push("/spowervisitor")}
          style={{ 
            padding: "12px 24px", 
            fontSize: "18px", 
            backgroundColor: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer",
            width: "100%",
            marginBottom: "10px"
          }}
        >
          방문자 등록 시작하기
        </button>

        <button 
          onClick={() => router.push("/temp-login")}
          style={{ 
            padding: "10px 20px", 
            fontSize: "14px", 
            backgroundColor: "transparent", 
            color: "#666", 
            border: "1px solid #ccc", 
            borderRadius: "8px", 
            cursor: "pointer",
            width: "100%"
          }}
        >
          관리자 로그인
        </button>
      </div>
    </div>
  );
}