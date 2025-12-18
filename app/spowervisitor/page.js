"use client";

import { getSupabaseClient } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VisitorPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const supabase = getSupabaseClient();
    
    const { error } = await supabase.from("visitors").insert({
      name: formData.get("name"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      car_number: formData.get("car_number"), // 차량번호 추가
      purpose: formData.get("purpose"),
      visit_time: formData.get("visit_time")
    });

    if (error) {
      alert("오류가 발생했습니다: " + error.message);
    } else {
      alert("방문 신청이 완료되었습니다.");
      router.push("/");
    }
    setLoading(false);
  }

  const inputStyle = { width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginTop: "6px", marginBottom: "18px", fontSize: "16px", boxSizing: "border-box" };
  const labelStyle = { fontSize: "14px", fontWeight: "600", color: "#475569", marginLeft: "4px" };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "14px 20px", display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", marginRight: "12px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>방문신청 등록</span>
      </header>

      <main style={{ padding: "20px", maxWidth: "450px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>성함</label>
            <input type="text" name="name" required style={inputStyle} placeholder="성함을 입력하세요" />

            <label style={labelStyle}>연락처</label>
            <input type="text" name="phone" required style={inputStyle} placeholder="010-0000-0000" />

            <label style={labelStyle}>소속 (회사명)</label>
            <input type="text" name="company" style={inputStyle} placeholder="회사명을 입력하세요" />

            <label style={labelStyle}>차량번호 (선택)</label>
            <input type="text" name="car_number" style={inputStyle} placeholder="예: 12가 3456" />

            <label style={labelStyle}>방문 목적</label>
            <input type="text" name="purpose" required style={inputStyle} placeholder="방문 목적을 입력하세요" />

            <label style={labelStyle}>방문 일시</label>
            <input type="datetime-local" name="visit_time" required style={inputStyle} />

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "18px", backgroundColor: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: "600", marginTop: "10px", cursor: "pointer" }}>
              {loading ? "등록 중..." : "방문 신청하기"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}