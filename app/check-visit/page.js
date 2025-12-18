"use client";

import { useState, Suspense } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

function CheckVisitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = searchParams.get("lang") || "ko";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = {
    ko: { head: "방문신청 조회", btn: "조회하기", nameP: "성함", phoneP: "연락처", date: "신청일", car: "차량", status: { "대기": "대기", "승인": "승인", "반려": "반려" } },
    en: { head: "Check Reservation", btn: "Search", nameP: "Full Name", phoneP: "Phone Number", date: "Applied", car: "Car", status: { "대기": "Pending", "승인": "Approved", "반려": "Rejected" } }
  };
  const cur = t[lang];

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const { data } = await getSupabaseClient().from("visitors").select("*").eq("name", name).eq("phone", phone).order("created_at", { ascending: false });
    setResult(data);
    setLoading(false);
  }

  const inputStyle = { width: "100%", height: "54px", padding: "0 16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", fontSize: "16px" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      {/* ⭐ 헤더 글씨 크기 확대 (20px) 및 여백 조정 */}
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "18px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push(`/?lang=${lang}`)} style={{ background: "none", border: "none", color: "white", fontSize: "22px", cursor: "pointer", marginRight: "15px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>{cur.head}</span>
      </header>
      
      <main style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", boxSizing: "border-box" }}>
        {/* ⭐ 카드 내부 입력창 너비 수정 */}
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "20px", width: "100%", boxSizing: "border-box" }}>
          <form onSubmit={handleSearch} style={{ width: "100%" }}>
            <input placeholder={cur.nameP} value={name} onChange={(e)=>setName(e.target.value)} required style={inputStyle} />
            <input placeholder={cur.phoneP} value={phone} onChange={(e)=>setPhone(e.target.value)} required style={inputStyle} />
            <button type="submit" style={{ width: "100%", height: "54px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "17px", cursor: "pointer" }}>
              {loading ? "..." : cur.btn}
            </button>
          </form>
        </div>

        {result?.map((item) => (
          <div key={item.id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", marginBottom: "15px", border: "1px solid #e2e8f0", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>{cur.date}: {new Date(item.created_at).toLocaleDateString()}</span>
              <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", backgroundColor: item.status === "승인" ? "#dcfce7" : "#f1f5f9", color: item.status === "승인" ? "#166534" : "#475569" }}>
                {cur.status[item.status] || cur.status["대기"]}
              </span>
            </div>
            <div style={{ marginTop: "12px", fontSize: "19px", fontWeight: "bold", color: "#1e293b" }}>{item.purpose}</div>
            <div style={{ marginTop: "10px", color: "#64748b", fontSize: "15px" }}>📅 {item.visit_time.replace("T", " ").split("+")[0]}</div>
            <div style={{ marginTop: "6px", color: "#64748b", fontSize: "15px" }}>🚗 {cur.car}: <span style={{color: "#2563eb", fontWeight: "600"}}>{item.car_number || "-"}</span></div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default function CheckVisitPage() {
  return <Suspense fallback={<div>Loading...</div>}><CheckVisitContent /></Suspense>;
}