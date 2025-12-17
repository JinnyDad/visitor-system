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
    setMessage("");

    // ⭐ 여기서 Supabase 생성 (브라우저에서만)
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("로그인 실패: " + error.message);
      return;
    }

    router.push("/visitors");
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h1>로그인</h1>

      <form onSubmit={handleLogin}>
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <button type="submit" style={{ padding: 10, width: "100%" }}>
          로그인
        </button>
      </form>

      {message && (
        <p style={{ color: "red", marginTop: 12 }}>{message}</p>
      )}
    </div>
  );
}
