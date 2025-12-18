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

  const inputStyle = { 
    width: "100%", 
    height: "52px", 
    padding: "0 14px", 
    borderRadius: "10px", 
    border: "1px solid #e2e8f0", 
    marginBottom: "12px", 
    fontSize: "16px", 
    boxSizing: "border-box",
    backgroundColor: "white"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif", width: "100%", overflowX: "hidden" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "14px 20px", display: "flex", alignItems: "center", boxSizing: "border-box" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", marginRight: "12px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>방문신청 조회</span>
      </header>

      <main style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "25px", boxSizing: "border-box" }}>
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="성함" value={name} onChange={(e)=>setName(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="연락처 (010-0000-0000)" value={phone} onChange={(e)=>setPhone(e.target.value)} required style={inputStyle} />
            <button type="submit" style={{ width: "100%", height: "52px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
              {loading ? "조회 중..." : "조회하기"}
            </button>
          </form>
        </div>

        {result && result.length > 0 ? (
          result.map((item) => (
            <div key={item.id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "24px", marginBottom: "15px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "4px" }}>신청일: {new Date(item.created_at).toLocaleDateString()}</div>
                  <div style={{ fontWeight: "bold", fontSize: "20px", color: "#1e293b" }}>{item.purpose}</div>
                </div>
                {/* 승인 상태 표시 태그 */}
                <div style={{ 
                  padding: "6px 12px", 
                  borderRadius: "8px", 
                  fontSize: "14px", 
                  fontWeight: "700",
                  backgroundColor: item.status === "승인" ? "#dcfce7" : item.status === "반려" ? "#fee2e2" : "#f1f5f9",
                  color: item.status === "승인" ? "#166534" : item.status === "반려" ? "#991b1b" : "#475569"
                }}>
                  {item.status || "대기"}
                </div>
              </div>
              
              <div style={{ marginTop: "15px", fontSize: "16px", color: "#334155", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>📅 일시: {item.visit_time.replace("T", " ").split("+")[0]}</div>
                <div>🚗 차량: {item.car_number || "없음"}</div>
              </div>
            </div>
          ))
        ) : result && <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>조회된 내역이 없습니다.</p>}
      </main>
    </div>
  );
}