"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

function VisitorCheckContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const lang = searchParams.get("lang") || "ko";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [visitData, setVisitData] = useState(null); // 조회된 데이터 저장
  const [hasSearched, setHasSearched] = useState(false); // 조회 시도 여부

  const t = {
    ko: { 
      head: "방문신청 조회", cardTitle: "신청 현황 확인", 
      cardDesc: "등록하신 성함과 연락처를 입력해주세요.",
      nameP: "성함을 입력해주세요", phoneP: "연락처를 입력해주세요", 
      btnSearch: "조회하기", btnBack: "처음으로", noData: "신청 내역이 없습니다.",
      status: "현재 상태", date: "방문 예정일", retry: "다시 조회하기"
    },
    en: { 
      head: "Check Status", cardTitle: "Check Status", 
      cardDesc: "Please enter your name and phone number.",
      nameP: "Your Name", phoneP: "Your Phone", 
      btnSearch: "Search", btnBack: "Home", noData: "No application found.",
      status: "Status", date: "Visit Date", retry: "Search Again"
    }
  };
  const cur = t[lang] || t.ko;

  // 조회 로직
  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .eq("name", name)
        .eq("phone", phone)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setVisitData(data || null);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setVisitData(null);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
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
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", boxSizing: "border-box", marginTop: "10px" }}>
          
          {!hasSearched ? (
            /* 1. 입력 화면 */
            <>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", marginBottom: "10px", textAlign: "center" }}>{cur.cardTitle}</h2>
              <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px", textAlign: "center" }}>{cur.cardDesc}</p>
              <form onSubmit={handleSearch}>
                <input type="text" placeholder={cur.nameP} value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                <input type="text" placeholder={cur.phoneP} value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
                <button type="submit" disabled={loading} style={{ width: "100%", height: "54px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "18px", cursor: "pointer", marginTop: "10px" }}>
                  {loading ? "조회 중..." : cur.btnSearch}
                </button>
              </form>
            </>
          ) : (
            /* 2. 결과 화면 */
            <div style={{ textAlign: "center" }}>
              {visitData ? (
                <>
                  <div style={{ marginBottom: "25px" }}>
                    <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>{cur.status}</div>
                    <div style={{ 
                      display: "inline-block", padding: "10px 25px", borderRadius: "50px", fontWeight: "bold", fontSize: "22px",
                      backgroundColor: visitData.status === "승인" ? "#dcfce7" : visitData.status === "반려" ? "#fee2e2" : "#f1f5f9",
                      color: visitData.status === "승인" ? "#166534" : visitData.status === "반려" ? "#991b1b" : "#475569"
                    }}>
                      {visitData.status || "대기 중"}
                    </div>
                  </div>
                  <div style={{ textAlign: "left", fontSize: "15px", borderTop: "1px solid #f1f5f9", paddingTop: "20px", lineHeight: "2" }}>
                    <div>성함: <strong>{visitData.name}</strong></div>
                    <div>대상자: <strong>{visitData.host_name || "-"}</strong></div>
                    <div>{cur.date}: <strong>{new Date(visitData.visit_time).toLocaleString()}</strong></div>
                  </div>
                </>
              ) : (
                <p style={{ color: "#64748b", padding: "20px 0" }}>{cur.noData}</p>
              )}
              
              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button onClick={() => setHasSearched(false)} style={{ flex: 1, height: "50px", border: "1px solid #e2e8f0", backgroundColor: "white", borderRadius: "10px", cursor: "pointer" }}>{cur.retry}</button>
                <button onClick={() => router.push(`/?lang=${lang}`)} style={{ flex: 1, height: "50px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>{cur.btnBack}</button>
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default function VisitorCheckPage() {
  return <Suspense fallback={<div>Loading...</div>}><VisitorCheckContent /></Suspense>;
}