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
    ko: { head: "방문신청 등록", name: "성함", phone: "연락처", company: "소속 (회사명)", car: "차량번호 (선택)", purpose: "방문 목적", time: "방문 일시", btn: "방문 신청하기", alert: "방문 신청이 완료되었습니다." },
    en: { head: "Registration", name: "Name", phone: "Phone", company: "Company", car: "Car Number (Opt)", purpose: "Purpose", time: "Visit Time", btn: "Register Now", alert: "Registration Complete." }
  };
  const cur = t[lang];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { error } = await getSupabaseClient().from("visitors").insert({
      name: formData.get("name"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      car_number: formData.get("car_number"),
      purpose: formData.get("purpose"),
      visit_time: formData.get("visit_time"),
      status: "대기"
    });
    if (error) alert(error.message);
    else { alert(cur.alert); router.push(`/?lang=${lang}`); }
    setLoading(false);
  }

  const inputStyle = { width: "100%", height: "52px", padding: "0 14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginTop: "6px", marginBottom: "18px", fontSize: "16px", boxSizing: "border-box", display: "block" };
  const labelStyle = { fontSize: "14px", fontWeight: "600", color: "#475569", marginLeft: "4px" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "14px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push(`/?lang=${lang}`)} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", marginRight: "12px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{cur.head}</span>
      </header>
      <main style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>{cur.name}</label><input type="text" name="name" required style={inputStyle} />
            <label style={labelStyle}>{cur.phone}</label><input type="text" name="phone" required style={inputStyle} />
            <label style={labelStyle}>{cur.company}</label><input type="text" name="company" style={inputStyle} />
            <label style={labelStyle}>{cur.car}</label><input type="text" name="car_number" style={inputStyle} />
            <label style={labelStyle}>{cur.purpose}</label><input type="text" name="purpose" required style={inputStyle} />
            <label style={labelStyle}>{cur.time}</label><input type="datetime-local" name="visit_time" required style={inputStyle} />
            <button type="submit" disabled={loading} style={{ width: "100%", height: "56px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "600", cursor: "pointer" }}>
              {loading ? "..." : cur.btn}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function VisitorPage() {
  return <Suspense fallback={<div>Loading...</div>}><VisitorFormContent /></Suspense>;
}