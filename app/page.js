"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 상단 네이비 헤더 */}
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>(주)에스파워</span>
          <span style={{ fontSize: "16px", opacity: 0.9 }}>방문예약</span>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,0.5)", borderRadius: "4px", padding: "4px 8px", fontSize: "13px" }}>🌐 KOR ▾</div>
      </header>

      <main style={{ flex: 1, padding: "0 20px", maxWidth: "450px", width: "100%", boxSizing: "border-box" }}>
        {/* S-Power 배경 글자 영역: 시인성 강화 버전 */}
        <div style={{ textAlign: "center", padding: "60px 0 30px 0", userSelect: "none" }}>
          <div style={{ 
            fontSize: "64px", 
            fontWeight: "900", 
            color: "#cbd5e1", // 가독성을 위해 더 진한 색상으로 변경
            letterSpacing: "-3px",
            lineHeight: "1",
            // 글자를 돋보이게 하는 입체감 효과
            textShadow: "2px 2px 4px rgba(0,0,0,0.05), -1px -1px 0px rgba(255,255,255,0.8)",
            opacity: "0.8"
          }}>
            S-Power
          </div>
          {/* 안산복합화력발전소 문구도 조금 더 또렷하게 */}
          <div style={{ 
            fontSize: "15px", 
            fontWeight: "700", 
            color: "#64748b", // 더 진한 회색
            marginTop: "12px",
            letterSpacing: "3px",
            wordBreak: "keep-all"
          }}>
            안산복합화력발전소
          </div>
        </div>

        {/* 시작하기 카드 및 나머지 하단 코드는 동일 */}
        <div style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", padding: "40px 24px", textAlign: "center", marginBottom: "20px" }}>
          <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "8px" }}>방문신청을 하시려면</p>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#1e293b", marginBottom: "30px", lineHeight: "1.4" }}>
            시작하기 버튼을 눌러주세요.
          </h2>

          <button 
            onClick={() => router.push("/spowervisitor")}
            style={{ width: "100%", padding: "18px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "14px", fontSize: "18px", fontWeight: "600", cursor: "pointer", marginBottom: "30px" }}
          >
            시작하기
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
            <button onClick={() => router.push("/check-visit")} style={{ background: "none", border: "none", color: "#64748b", fontSize: "14px", borderRight: "1px solid #f1f5f9", cursor: "pointer" }}>🔍 방문신청조회</button>
            <button onClick={() => router.push("/temp-login")} style={{ background: "none", border: "none", color: "#64748b", fontSize: "14px", cursor: "pointer" }}>관리자 로그인</button>
          </div>
        </div>

        {/* 방문절차안내 카드 */}
        <div style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", padding: "25px 20px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "25px", fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>🔗 방문절차안내</div>
          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
            {["방문신청", "내부승인", "방문수속", "방문"].map((step, i) => (
              <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>{["📝", "👤", "🪪", "📍"][i]}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>{step}</div>
                </div>
                {i < 3 && <div style={{ color: "#e2e8f0", fontSize: "10px" }}>❯</div>}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ paddingBottom: "40px", textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>
        <div style={{ marginBottom: "6px" }}>개인정보처리방침</div>
        <div>©2017-2025. S-Power Corp. All rights reserved.</div>
      </footer>
    </div>
  );
}