"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function VisitorsListPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [filterToday, setFilterToday] = useState(false);

  // 1. 보안 체크 및 데이터 로드 (기존 로직 유지)
  useEffect(() => {
    checkSessionAndLoad();
  }, []);

  async function checkSessionAndLoad() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data?.session) {
        router.replace("/temp-login");
        return;
      }
      await loadRows();
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      setLoading(false);
    }
  }

  // 2. 데이터 로드 (차량번호 car_number 추가)
  async function loadRows() {
    const { data, error } = await supabase
      .from("visitors")
      .select("id, name, company, phone, purpose, visit_time, status, car_number, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setRows(data ?? []);
    }
  }

  // 3. 승인/반려 기능 (새로 추가된 기능)
  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from("visitors")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("변경 실패: " + error.message);
    } else {
      alert(`${newStatus} 처리가 완료되었습니다.`);
      loadRows(); // 새로고침
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/temp-login");
  }

  // 4. 필터 및 검색 로직 (기존 로직 유지)
  const rowsToShow = rows
    .filter((r) => {
      if (!filterToday) return true;
      if (!r.visit_time) return false;
      const d = new Date(r.visit_time);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    })
    .filter((r) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (r.name || "").toLowerCase().includes(s) ||
        (r.company || "").toLowerCase().includes(s) ||
        (r.phone || "").toLowerCase().includes(s) ||
        (r.purpose || "").toLowerCase().includes(s) ||
        (r.car_number || "").toLowerCase().includes(s)
      );
    });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: "20px", fontFamily: "'Pretendard', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* 헤더 영역 */}
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>방문객 관리 시스템</h1>
          <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: "#64748b", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>로그아웃</button>
        </header>

        {/* 필터 및 검색바 */}
        <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "12px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
            <input type="checkbox" checked={filterToday} onChange={(e) => setFilterToday(e.target.checked)} /> 오늘 방문만
          </label>
          <input 
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            placeholder="이름/회사/차량번호 검색..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {loading ? <p style={{ textAlign: "center" }}>데이터 로딩 중...</p> : (
          rowsToShow.map((r) => (
            <div key={r.id} style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", marginBottom: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{new Date(r.visit_time).toLocaleString()} 예정</span>
                <span style={{ 
                  padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold",
                  backgroundColor: r.status === "승인" ? "#dcfce7" : r.status === "반려" ? "#fee2e2" : "#f1f5f9",
                  color: r.status === "승인" ? "#166534" : r.status === "반려" ? "#991b1b" : "#475569"
                }}>{r.status || "대기"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "15px", marginBottom: "15px" }}>
                <div>성함: <strong>{r.name}</strong></div>
                <div>연락처: <strong>{r.phone}</strong></div>
                <div>회사: <strong>{r.company || "-"}</strong></div>
                <div>차량: <strong style={{ color: "#2563eb" }}>{r.car_number || "없음"}</strong></div>
                <div style={{ gridColumn: "span 2" }}>목적: <strong>{r.purpose}</strong></div>
              </div>

              {/* 승인/반려 버튼 */}
              <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                <button onClick={() => updateStatus(r.id, "승인")} style={{ flex: 1, padding: "12px", backgroundColor: "#166534", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>승인</button>
                <button onClick={() => updateStatus(r.id, "반려")} style={{ flex: 1, padding: "12px", backgroundColor: "#991b1b", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>반려</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}