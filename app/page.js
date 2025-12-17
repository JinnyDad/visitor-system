"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8f9fa", 
      fontFamily: "'Pretendard', sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* 1. 상단 네이비 헤더 */}
      <header style={{ 
        backgroundColor: "#1e40af", 
        color: "white", 
        padding: "12px 20px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>에스파워</span>
          <span style={{ fontSize: "16px", opacity: 0.9 }}>방문예약</span>
        </div>
        <div style={{ 
          border: "1px solid rgba(255,255,255,0.5)", 
          borderRadius: "4px", 
          padding: "4px 8px", 
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "5px"
        }}>
          🌐 KOR ▾
        </div>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main style={{ flex: 1, padding: "40px 20px", maxWidth: "500px", margin: "0 auto", width: "100%" }}>
        
        {/* 대형 배경 로고 텍스트 */}
        <div style={{ 
          textAlign: "center", 
          fontSize: "70px", 
          fontWeight: "900", 
          color: "#e2e8f0", 
          letterSpacing: "-2px",
          marginBottom: "-30px",
          userSelect: "none"
        }}>
          S-Power
        </div>

        {/* 시작하기 카드 */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          padding: "40px 20px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          marginBottom: "20px",
          border: "1px solid #f1f5f9"
        }}>
          <p style={{ color: "#475569", fontSize: "18px", marginBottom: "8px" }}>방문신청을 하시려면</p>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", marginBottom: "25px" }}>
            <span style={{ color: "#000" }}>시작하기</span> 버튼을 눌러주세요.
          </h2>

          <button 
            onClick={() => router.push("/spowervisitor")}
            style={{ 
              width: "100%", 
              padding: "18px", 
              backgroundColor: "#1a1a1a", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              fontSize: "18px", 
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "25px"
            }}
          >
            시작하기
          </button>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            borderTop: "1px solid #f1f5f9",
            paddingTop: "20px"
          }}>
            <button style={{ background: "none", border: "none", color: "#64748b", fontSize: "15px", borderRight: "1px solid #f1f5f9" }}>
              🔍 방문신청조회
            </button>
            <button 
              onClick={() => router.push("/temp-login")}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: "15px" }}
            >
              관리자 로그인
            </button>
          </div>
        </div>

        {/* 방문절차안내 카드 */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          padding: "25px 20px",
          border: "1px solid #f1f5f9"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ color: "#3b82f6", fontSize: "20px" }}>🔗</span>
            <span style={{ fontWeight: "bold", fontSize: "17px" }}>방문절차안내</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>📝</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>방문신청</div>
            </div>
            <div style={{ alignSelf: "center", color: "#e2e8f0" }}>❯</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>👤</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>내부승인</div>
            </div>
            <div style={{ alignSelf: "center", color: "#e2e8f0" }}>❯</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>🪪</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>방문수속</div>
            </div>
            <div style={{ alignSelf: "center", color: "#e2e8f0" }}>❯</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>📍</div>
              <div style={{ fontSize: "12px", color: "#475569" }}>방문</div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. 푸터 */}
      <footer style={{ 
        padding: "30px 20px", 
        textAlign: "center", 
        borderTop: "1px solid #e2e8f0",
        fontSize: "13px",
        color: "#94a3b8"
      }}>
        <div style={{ marginBottom: "10px", fontWeight: "bold", color: "#64748b" }}>개인정보처리방침</div>
        <div>©2017-2025. S-Power Corp. All rights reserved.</div>
      </footer>
    </div>
  );
}