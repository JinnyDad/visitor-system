"use client";

import { useRouter } from "next/navigation";

export default function SpowerLandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 상단 바 */}
      <div
        style={{
          width: "100%",
          background: "#1e5bb8",
          color: "#fff",
          padding: "16px 20px",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        에스파워 방문예약
      </div>

      {/* 메인 카드 */}
      <div
        style={{
          marginTop: 40,
          width: "90%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "#bbb",
            marginBottom: 20,
          }}
        >
          S-Power
        </div>

        <h2 style={{ marginBottom: 12 }}>
          방문신청을 하시려면
          <br />
          시작하기 버튼을 눌러주세요.
        </h2>

        <button
          onClick={() => router.push("/spowervisitor")}
          style={{
            width: "100%",
            padding: "14px 0",
            background: "#111",
            color: "#fff",
            fontSize: 16,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            marginTop: 20,
          }}
        >
          시작하기
        </button>

        {/* 하단 버튼 */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            borderTop: "1px solid #eee",
          }}
        >
          <button
            onClick={() => router.push("/spowervisitor")}
            style={{
              flex: 1,
              padding: 12,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            방문자 등록
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

      {/* 하단 안내 */}
      <div
        style={{
          marginTop: 40,
          fontSize: 14,
          color: "#666",
        }}
      >
        개인정보처리방침
        <br />
        ©2017–2025. nLobby Corp. All rights reserved.
      </div>
    </div>
  );
}
