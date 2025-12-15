"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function VisitorPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const company = formData.get("company");
    const purpose = formData.get("purpose");
    const visit_time = formData.get("visit_time");

    const { error } = await supabase.from("visitors").insert({
      name,
      phone,
      company,
      purpose,
      visit_time
    });

    if (error) {
      setMessage("저장 중 오류 발생: " + error.message);
    } else {
      setMessage("등록 완료되었습니다!");
      e.target.reset();
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>방문자 등록</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input type="text" name="name" required />
        </div>

        <div>
          <label>연락처</label>
          <input type="text" name="phone" required />
        </div>

        <div>
          <label>회사명</label>
          <input type="text" name="company" />
        </div>

        <div>
          <label>방문 목적</label>
          <input type="text" name="purpose" required />
        </div>

        <div>
          <label>방문 예정일시</label>
          <input type="datetime-local" name="visit_time" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "저장 중..." : "등록하기"}
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}
