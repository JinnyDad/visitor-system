"use client";

import { getSupabaseClient } from "@/lib/supabaseClient";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VisitorFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "ko";
  const [loading, setLoading] = useState(false);

  const t = {
    ko: { 
      head: "방문신청 등록", 
      name: "성함", nameP: "성함을 입력해주세요",
      phone: "연락처", phoneP: "010-0000-0000",
      company: "소속 (회사명)", companyP: "회사명을 입력해주세요",
      car: "차량번호 (선택)", carP: "12가 3456 (없으면 빈칸)",
      purpose: "방문 목적", purposeP: "방문 목적을 입력해주세요",
      time: "방문 일시", 
      btn: "방문 신청하기", 
      alert: "방문 신청이 완료되었습니다." 
    },
    en: { 
      head: "Registration", 
      name: "Name", nameP: "Enter your full name",
      phone: "Phone", phoneP: "010-0000-0000",
      company: "Company", companyP: "Enter your company name",
      car: "Car Number (Opt)", carP: "12A 3456 (Optional)",
      purpose: "Purpose", purposeP: "Enter purpose of visit",
      time: "Visit Time", 
      btn: "Register Now", 
      alert: "Registration Complete." 
    }
  };
  const cur = t[lang];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { error } = await getSupabaseClient().from("visitors").insert({
      name: formData.get("name"), phone: formData.get("phone"), company: formData.get("company"),
      car_number: formData.get("car_number"), purpose: formData.get("purpose"), visit_time: formData.get("visit_time"), status: "대기"
    });
    if (error) alert(error.message);
    else { alert(cur.alert); router.push(`/?lang=${lang}`); }
    setLoading(false);
  }

  // ⭐ 공통 입력창 스타일 (너비 이탈 방지 핵심)
  const inputStyle = { 
    width: "100%", 
    height: "52px", 
    padding: "0 14px", 
    borderRadius: "10px", 
    border: "1px solid #e2e8f0", 
    marginTop: "6px", 
    marginBottom: "18px", 
    fontSize: "16px", 
    boxSizing: "border-box", // 패딩을 너비 안에 가두는 핵심 속성
    outline: "none",
    display: "block",
    backgroundColor: "white", 
    color: "#000000",
    textAlign: "left"
  };
  
  const labelStyle = { fontSize: "14px", fontWeight: "600", color: "#475569", marginLeft: "4px", display: "block" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push(`/?lang=${lang}`)} style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", marginRight: "15px", display: "flex", alignItems: "center" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "22px" }}>{cur.head}</span>
      </header>

      <main style={{ padding: "20px", maxWidth: "450px", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", boxSizing: "border-box" }}>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>{cur.name}</label>
            <input type="text" name="name" required placeholder={cur.nameP} style={inputStyle} />
            
            <label style={labelStyle}>{cur.phone}</label>
            <input type="text" name="phone" required placeholder={cur.phoneP} style={inputStyle} />
            
            <label style={labelStyle}>{cur.company}</label>
            <input type="text" name="company" placeholder={cur.companyP} style={inputStyle} />
            
            <label style={labelStyle}>{cur.car}</label>
            <input type="text" name="car_number" placeholder={cur.carP} style={inputStyle} />
            
            <label style={labelStyle}>{cur.purpose}</label>
            <input type="text" name="purpose" required placeholder={cur.purposeP} style={inputStyle} />
            
            <label style={labelStyle}>{cur.time}</label>
            {/* ⭐ 날짜 입력창 특수 봉인 처리 */}
            <div style={{ position: "relative", width: "100%" }}>
              <input 
                type="datetime-local" 
                name="visit_time" 
                required 
                style={{
                  ...inputStyle,
                  color: "#000000",
                  lineHeight: "1.2", // 텍스트 중앙 위치 유도
                  paddingTop: "14px", // 상단 여백으로 중앙 맞춤
                  paddingBottom: "14px"
                }} 
              />
            </div>
            
            <button type="submit" disabled={loading} style={{ width: "100%", height: "56px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "18px", fontWeight: "600", cursor: "pointer", marginTop: "10px" }}>
              {loading ? "..." : cur.btn}
            </button>
          </form>
        </div>
      </main>

      {/* ⭐ 브라우저가 강제로 넣는 아이콘들을 숨기는 스타일 태그 추가 */}
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </div>
  );
}

export default function VisitorPage() {
  return <Suspense fallback={<div>Loading...</div>}><VisitorFormContent /></Suspense>;
}