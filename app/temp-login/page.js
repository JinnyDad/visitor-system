"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("실패: " + error.message);
    } else {
      router.push("/visitors");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", display: "flex", flexDirection: "column", fontFamily: "'Pretendard', sans-serif" }}>
      <header style={{ backgroundColor: "#1e40af", color: "white", padding: "12px 20px" }}>
        <span style={{ fontWeight: "bold" }}>관리자 로그인</span>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "white", borderRadius: "20px", padding: "40px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#1e293b" }}>S-Power Admin</h2>
            <p style={{ color: "#64748b", marginTop: "8px" }}>관리자 계정으로 로그인하세요.</p>
          </div>

          <form onSubmit={handleLogin}>
            <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }} />
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }} />
            <button type="submit" style={{ width: "100%", padding: "16px", backgroundColor: "#1e40af", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>로그인</button>
          </form>
          {message && <p style={{ color: "red", marginTop: "15px", textAlign: "center", fontSize: "14px" }}>{message}</p>}
        </div>
      </main>
    </div>
  );
}