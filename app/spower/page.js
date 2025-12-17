"use client";
import { useRouter } from "next/navigation";

export default function SpowerPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 40 }}>
      <h1>S-Power 방문예약</h1>

      <button
        onClick={() => router.push("/spowervisitor")}
        style={{ marginRight: 12 }}
      >
        시작하기 (방문자 등록)
      </button>

      <button onClick={() => router.push("/login")}>
        관리자 로그인
      </button>
    </div>
  );
}
