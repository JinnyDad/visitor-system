"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      {/* 상단 헤더 */}
      <header
        style={{
          background: "#1f4ea3",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>에스파워 방문예약</strong>
        <button
          style={{
            background: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            borderRadius: 6,
            padding: "6px 10px",
          }}
        >
          KOR ▼
        </button>
      </header>

      {/* 메인 */}
      <main style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: 42,
            color: "#ccc",
            margin: "40px 0",
          }}
        >
          S-Power
        </h1>

        {/* 카드 */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 18, marginBottom: 20 }}>
            방문신청을 하시려면<br />
            <strong>시작하기</strong> 버튼을 눌러주세요.
          </p>

          <button
            onClick={() => router.push("/spowervisitor")}
            style={{
              width: "100%",
              padding: 14,
              fontSize: 16,
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            시작하기
          </button>

          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <button
              style={{
                flex: 1,
                padding: 12,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              방문신청조회
            </button>
            <button
              onClick={() => router.push("/login")}
              style={{
                flex: 1,
                padding: 12,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              관리자 로그인
            </button>
          </div>
        </div>

        {/* 절차 안내 */}
        <div
          style={{
            marginTop: 30,
            background: "#fff",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3>방문절차안내</h3>
          <ol style={{ paddingLeft: 20 }}>
            <li>방문신청</li>
            <li>내부승인</li>
            <li>방문수속</li>
            <li>방문</li>
          </ol>
        </div>
      </main>

      {/* 푸터 */}
      <footer
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#777",
          marginTop: 40,
          paddingBottom: 20,
        }}
      >
        개인정보처리방침<br />
        ©2017-2025. nLobby Corp. All rights reserved.
      </footer>
    </div>
  );
}
