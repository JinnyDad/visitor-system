"use client";

import { getSupabaseClient } from "@/lib/supabaseClient";
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
      btnSearch: "조회하기",
      noData: "조회된 신청 내역이 없습니다."
    },
    en: { 
      head: "Check Reservation", 
      cardTitle: "Check Status",
      cardDesc: "Please enter your name and phone number.",
      nameP: "Enter your name",
      phoneP: "Enter your phone number",
      btnSearch: "Search",
      noData: "No registration found."
    }
  };
  const cur = t[lang];

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    // 조회 로직 (기존에 구현하신 로직이 있다면 여기에 연결)
    // 예: router.push(`/spowervisitor/result?name=${name}&phone=${phone}&lang=${lang}`);
    setLoading(false);
  }

  const inputStyle = { 
    width: "100%", height: "52px", padding: "0 16px", borderRadius: "12px", 
    border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", 
    fontSize: "16px", outline: "none", color: "#000000"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      {/* 1. 헤더: 관리자 로그인과 동일한 22px 높이 및 스타일 */}
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "20px", display: "flex", alignItems: "center" }}>
        <button 
          onClick={() => router.push(`/?lang=${lang}`)} 
          style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", marginRight: "15px", display: "flex", alignItems: "center" }}
        >
          ❮
        </button>
        <span style={{ fontWeight: "bold", fontSize: "22px" }}>{cur.head}</span>
      </header>

      {/* 2. 메인: 카드를 상단으로 올려 관리자 화면과 위치 통일 */}
      <main style={{ padding: "10px 20px", maxWidth: "450px", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "24px", 
          padding: "40px 20px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)", 
          textAlign: "center", 
          boxSizing: "border-box",
          marginTop: "10px" 
        }}>
          
          {/* 3. 관리자 화면처럼 제목과 설명 추가 */}
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", marginBottom: "10px" }}>
            {cur.cardTitle}
          </h2>
          <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px" }}>
            {cur.cardDesc}
          </p>

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
                border: "none", borderRadius: "12px", fontSize: "18px", fontWeight: "bold", 
                cursor: "pointer", marginTop: "10px" 
              }}
            >
              {loading ? "..." : cur.btnSearch}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function VisitorCheckPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitorCheckContent />
    </Suspense>
  );
}