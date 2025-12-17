"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // 페이지가 로드되자마자 실행을 멈추고 로그를 찍습니다.
    console.log("여기는 메인 페이지입니다. 어디로도 이동하지 마세요!");
  }, []);

  return (
    <div style={{ padding: "50px", border: "10px solid red", backgroundColor: "white" }}>
      <h1 style={{ color: "black" }}>정지! 여기가 메인 화면입니다.</h1>
      <p style={{ color: "black" }}>만약 이 화면이 1초만 보이고 사라진다면, 다른 파일(layout 등)이 범인입니다.</p>
    </div>
  );
}