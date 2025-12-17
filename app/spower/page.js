"use client";

export default function SpowerHome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        방문자 관리 시스템
      </h1>

      <button
        style={{
          width: 220,
          padding: 14,
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.href = "/spowervisitor";
        }}
      >
        방문자 등록
      </button>

      <button
        style={{
          width: 220,
          padding: 14,
          fontSize: 16,
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        관리자 로그인
      </button>
    </div>
  );
}
