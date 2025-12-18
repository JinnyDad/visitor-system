"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState("ko");

  const t = {
    ko: {
      company: "(주)에스파워", subtitle: "방문예약", location: "안산복합화력발전소",
      startDesc: "방문신청을 하시려면", startTitle: "시작하기 버튼을 눌러주세요.",
      btnStart: "시작하기", btnCheck: "🔍 방문신청조회", btnAdmin: "관리자 로그인",
      procedure: "🔗 방문절차안내", steps: ["방문신청", "내부승인", "방문수속", "방문"],
      policy: "개인정보처리방침"
    },
    en: {
      company: "S-Power", subtitle: "Visit Reservation", location: "Ansan Combined Cycle Power Plant",
      startDesc: "To apply for a visit,", startTitle: "Please click the Start button.",
      btnStart: "Start", btnCheck: "🔍 Check Reservation", btnAdmin: "Admin Login",
      procedure: "🔗 Visit Procedure", steps: ["Apply", "Approval", "Check-in", "Visit"],
      policy: "Privacy Policy"
    }
  };

  const cur = t[lang];

  const navigateTo = (path) => {
    router.push(`${path}?lang=${lang}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>{cur.company}</span>
          <span style={{ fontSize: "16px", opacity: 0.9 }}>{cur.subtitle}</span>
        </div>
        <button onClick={() => setLang(lang === "ko" ? "en" : "ko")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.5)", color: "white", borderRadius: "4px", padding: "4px 8px", fontSize: "13px", cursor: "pointer" }}>
          🌐 {lang === "ko" ? "KOR ▾" : "ENG ▾"}
        </button>
      </header>

      <main style={{ flex: 1, padding: "0 20px", maxWidth: "450px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", padding: "60px 0 30px 0", userSelect: "none" }}>
          <div style={{ fontSize: "64px", fontWeight: "900", color: "#cbd5e1", letterSpacing: "-3px", lineHeight: "1", textShadow: "2px 2px 4px rgba(0,0,0,0.05), -1px -1px 0px rgba(255,255,255,0.8)", opacity: "0.8" }}>S-Power</div>
          <div style={{ fontSize: lang === "ko" ? "19px" : "14px", fontWeight: "800", color: "#475569", marginTop: "10px", letterSpacing: lang === "ko" ? "4.5px" : "0.5px", textAlign: "center" }}>
            {cur.location}
          </div>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", padding: "40px 24px", textAlign: "center", marginBottom: "20px" }}>
          <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "8px" }}>{cur.startDesc}</p>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1e293b", marginBottom: "30px", lineHeight: "1.4" }}>{cur.startTitle}</h2>
          <button onClick={() => navigateTo("/spowervisitor")} style={{ width: "100%", padding: "18px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "14px", fontSize: "18px", fontWeight: "600", cursor: "pointer", marginBottom: "30px" }}>
            {cur.btnStart}
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
            <button onClick={() => navigateTo("/check-visit")} style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", borderRight: "1px solid #f1f5f9", cursor: "pointer" }}>{cur.btnCheck}</button>
            <button onClick={() => navigateTo("/temp-login")} style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer" }}>{cur.btnAdmin}</button>
          </div>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", padding: "25px 20px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "25px", fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>{cur.procedure}</div>
          <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
            {cur.steps.map((step, i) => (
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
        <div style={{ marginBottom: "6px" }}>{cur.policy}</div>
        <div>©2017-2025. S-Power Corp. All rights reserved.</div>
      </footer>
    </div>
  );
}