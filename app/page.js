"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* 상단 파란색 바 */}
      <div style={{ backgroundColor: "#2b5a9f", color: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>에스파워 <span style={{ fontWeight: "normal" }}>방문예약</span></div>
      </div>

      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#dee2e6", fontSize: "5rem", margin: "0 0 20px 0", fontWeight: "900" }}>S-Power</h1>

        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "30px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", maxWidth: "400px", margin: "0 auto" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>방문신청을 하시려면</p>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}><strong>시작하기</strong> 버튼을 눌러주세요.</h2>
          
          <button 
            onClick={() => router.push("/spowervisitor")}
            style={{ width: "100%", padding: "15px", backgroundColor: "#1a1a1a", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", cursor: "pointer", marginBottom: "20px" }}
          >
            시작하기
          </button>

          <div style={{ display: "flex", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <div style={{ flex: 1, borderRight: "1px solid #eee", cursor: "pointer" }}>방문신청조회</div>
            <div 
              onClick={() => router.push("/login")}
              style={{ flex: 1, cursor: "pointer", color: "#333" }}
            >
              관리자 로그인
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}