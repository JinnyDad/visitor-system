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

    // 회원가입 시도
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // 자동 승인을 끄면 관리자가 승인해야 로그인 가능해집니다.
        emailRedirectTo: `${window.location.origin}/temp-login`,
      },
    });

    if (error) {
      setMessage("가입 실패: " + error.message);
    } else {
      setMessage("가입 신청이 완료되었습니다! 관리자의 승인 후 로그인이 가능합니다.");
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => router.push("/temp-login"), 3000);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9", padding: "20px" }}>
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "400px", width: "100%" }}>
        <h2 style={{ textAlign: "center", color: "#1e40af", marginBottom: "20px" }}>관리자 가입 신청</h2>
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "5px" }}>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#475569", display: "block", marginBottom: "5px" }}>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            {loading ? "신청 중..." : "가입 신청하기"}
          </button>
        </form>
        {message && <p style={{ marginTop: "15px", fontSize: "14px", color: "#2563eb", textAlign: "center" }}>{message}</p>}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => router.push("/temp-login")} style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>이미 계정이 있으신가요? 로그인</button>
        </div>
      </div>
    </div>
  );
}