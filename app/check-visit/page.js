"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CheckVisitPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .eq("name", name)
      .eq("phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      alert("조회 중 오류 발생");
    } else {
      setResult(data);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "14px 20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", marginRight: "12px" }}>❮</button>
        <span style={{ fontWeight: "bold" }}>방문신청 조회</span>
      </header>

      <main style={{ padding: "20px", maxWidth: "450px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="성함" value={name} onChange={(e)=>setName(e.target.value)} required style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box" }} />
            <input type="text" placeholder="연락처 (010-0000-0000)" value={phone} onChange={(e)=>setPhone(e.target.value)} required style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box" }} />
            <button type="submit" style={{ width: "100%", padding: "16px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold" }}>
              {loading ? "조회 중..." : "조회하기"}
            </button>
          </form>
        </div>

        {result && result.length > 0 ? (
          result.map((item) => (
            <div key={item.id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", marginBottom: "15px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>신청일: {new Date(item.created_at).toLocaleDateString()}</div>
              <div style={{ fontWeight: "bold", fontSize: "18px", color: "#1e293b" }}>{item.purpose}</div>
              <div style={{ marginTop: "10px", fontSize: "15px" }}>📍 일시: {item.visit_time.replace("T", " ")}</div>
              <div style={{ fontSize: "15px" }}>🚗 차량: {item.car_number || "없음"}</div>
            </div>
          ))
        ) : result && <p style={{ textAlign: "center", color: "#94a3b8" }}>조회된 내역이 없습니다.</p>}
      </main>
    </div>
  );
}