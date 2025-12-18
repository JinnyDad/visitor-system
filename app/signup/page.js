"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClient();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/temp-login`,
      },
    });

    if (error) {
      setMessage("가입 실패: " + error.message);
    } else {
      setMessage("가입 신청 완료! 관리자 승인 후 로그인 가능합니다.");
      setTimeout(() => router.push("/temp-login"), 3000);
    }
    setLoading(false);
  };

  const inputStyle = { 
    width: "100%", height: "52px", padding: "0 16px", borderRadius: "12px", 
    border: "1px solid #e2e8f0", marginBottom: "12px", boxSizing: "border-box", 
    fontSize: "16px", outline: "none", color: "#000000", backgroundColor: "#ffffff"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'Pretendard', sans-serif" }}>
      {/* 로그인 페이지와 동일한 헤더 스타일 */}
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "20px", display: "flex", alignItems: "center" }}>
        <button onClick={() => router.push("/temp-login")} style={{ background: "none", border: "none", color: "white", fontSize: "24px", cursor: "pointer", marginRight: "15px" }}>❮</button>
        <span style={{ fontWeight: "bold", fontSize: "22px" }}>관리자 가입 신청</span>
      </header>

      <main style={{ padding: "10px 20px", maxWidth: "450px", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center", boxSizing: "border-box", marginTop: "10px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b", marginBottom: "10px" }}>계정 생성</h2>
          <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px" }}>사용하실 이메일과 비밀번호를 입력하세요.</p>
          
          <form onSubmit={handleSignUp}>
            <input type="email" placeholder="이메일 주소" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="비밀번호 (6자리 이상)" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" disabled={loading} style={{ width: "100%", height: "54px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "18px", cursor: "pointer", marginTop: "10px" }}>
              {loading ? "신청 중..." : "가입 신청하기"}
            </button>
          </form>

          {message && (
            <div style={{ marginTop: "20px", padding: "12px", borderRadius: "8px", backgroundColor: "#f0f7ff", color: "#1e40af", fontSize: "14px", lineHeight: "1.5" }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
            <button 
              onClick={() => router.push("/temp-login")} 
              style={{ background: "none", border: "none", color: "#64748b", fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}
            >
              이미 계정이 있으신가요? 로그인으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}