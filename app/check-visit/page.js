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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "14px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push(`/?lang=${lang}`)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", marginRight: "12px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{cur.head}</span>
      </header>
      <main style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
          <form onSubmit={handleSearch}>
            <input placeholder={cur.nameP} value={name} onChange={(e)=>setName(e.target.value)} required style={{ width: "100%", height: "52px", padding: "0 14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box" }} />
            <input placeholder={cur.phoneP} value={phone} onChange={(e)=>setPhone(e.target.value)} required style={{ width: "100%", height: "52px", padding: "0 14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box" }} />
            <button type="submit" style={{ width: "100%", height: "52px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold" }}>{loading ? "..." : cur.btn}</button>
          </form>
        </div>
        {result?.map((item) => (
          <div key={item.id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>{cur.date}: {new Date(item.created_at).toLocaleDateString()}</span>
              <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", backgroundColor: item.status === "승인" ? "#dcfce7" : "#f1f5f9" }}>
                {cur.status[item.status] || cur.status["대기"]}
              </span>
            </div>
            <div style={{ marginTop: "10px", fontSize: "18px", fontWeight: "bold" }}>{item.purpose}</div>
            <div style={{ marginTop: "8px", color: "#64748b" }}>📅 {item.visit_time.replace("T", " ").split("+")[0]}</div>
            <div style={{ marginTop: "4px", color: "#64748b" }}>🚗 {cur.car}: {item.car_number || "-"}</div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default function CheckVisitPage() {
  return <Suspense fallback={<div>Loading...</div>}><CheckVisitContent /></Suspense>;
}