"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VisitorCheckContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "ko";
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const t = {
    ko: { 
      head: "방문신청 조회", 
      cardTitle: "신청 현황 확인", 
      cardDesc: "등록하신 성함과 연락처를 입력해주세요.", 
      nameP: "성함을 입력해주세요", 
      phoneP: "연락처를 입력해주세요", 
      btnSearch: "조회하기" 
    },
    en: { 
      head: "Check Status", 
      cardTitle: "Check Status", 
      cardDesc: "Please enter your name and phone number.", 
      nameP: "Your Name", 
      phoneP: "Your Phone", 
      btnSearch: "Search" 
    }
  };
  const cur = t[lang] || t.ko;

  async function handleSearch(e) {
    e.preventDefault();
    console.log("조회 시도:", { name, phone }); // 브라우저 콘솔에서 확인 가능
    
    setLoading(true);
    
    // 결과 페이지 경로가 /spowervisitor/result 인지 확인 필수
    const targetUrl = `/spowervisitor/result?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&lang=${lang}`;
    
    console.log("이동할 URL:", targetUrl);
    router.push(targetUrl);
    
    setTimeout(() => setLoading(false), 2000); // 2초 후 로딩 해제 (이동 실패 대비)
  }

  const inputStyle = { 
    width: "100%", height: "52px", padding: "0 16px", borderRadius: "12px", 
    border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", 
    fontSize: "16px", outline: "none", color: "#000000", backgroundColor: "#ffffff" 
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push(`/?lang=${lang}`)} style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", marginRight: "15px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "22px" }}>{cur.head}</span>
      </header>

      <main style={{ padding: "10px 20px", maxWidth: "450px", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", boxSizing: "border-box", marginTop: "10px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", marginBottom: "10px" }}>{cur.cardTitle}</h2>
          <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px" }}>{cur.cardDesc}</p>
          
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder={cur.nameP} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={inputStyle} 
            />
            <input 
              type="text" 
              placeholder={cur.phoneP} 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              style={inputStyle} 
            />
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: "100%", height: "54px", backgroundColor: "#1e40af", color: "white", 
                border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "18px", 
                cursor: "pointer", marginTop: "10px", opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "조회 중..." : cur.btnSearch}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function VisitorCheckPage() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>Loading...</div>}>
      <VisitorCheckContent />
    </Suspense>
  );
}