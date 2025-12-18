"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("로그인 실패: " + error.message);
    else router.push("/admin"); // 관리자 대시보드로 이동
    setLoading(false);
  }

  const inputStyle = { 
    width: "100%", 
    height: "52px", 
    padding: "0 16px", 
    borderRadius: "12px", 
    border: "1px solid #e2e8f0", 
    marginBottom: "12px", 
    boxSizing: "border-box", 
    fontSize: "16px", 
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#000000"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      {/* 1. 헤더: 방문자 조회 페이지와 동일한 22px 및 스타일 적용 */}
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "20px", display: "flex", alignItems: "center" }}>
        <button 
          onClick={() => router.push("/")} 
          style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", marginRight: "15px", display: "flex", alignItems: "center" }}
        >
          ❮
        </button>
        <span style={{ fontWeight: "bold", fontSize: "22px" }}>관리자 로그인</span>
      </header>

      {/* 2. 메인: 카드를 상단으로 바짝 올려 방문자 조회 페이지와 높이 통일 */}
      <main style={{ padding: "10px 20px", maxWidth: "450px", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "24px", 
          padding: "40px 20px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)", 
          textAlign: "center", 
          boxSizing: "border-box",
          marginTop: "10px" // 방문자 조회 카드 위치와 맞춤
        }}>
          
          {/* 방문자 조회 페이지에 추가할 디자인과 톤앤매너 일치 */}
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", marginBottom: "10px" }}>S-Power Admin</h2>
          <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px" }}>관리자 계정으로 로그인하세요.</p>

          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="이메일" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={inputStyle} 
            />
            <input 
              type="password" 
              placeholder="비밀번호" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={inputStyle} 
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", 
                height: "54px", 
                backgroundColor: "#1e40af", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                fontWeight: "bold", 
                fontSize: "18px", 
                cursor: "pointer", 
                marginTop: "10px",
                transition: "background-color 0.2s"
              }}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}