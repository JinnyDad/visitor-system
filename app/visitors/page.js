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

  // 현재 인원 계산 (status가 '승인'인 데이터만 필터)
  const currentVisitorCount = rows.filter(r => r.status === "승인").length;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/temp-login");
      }
    });
    checkSessionAndLoad();
    return () => subscription.unsubscribe();
  }, []);

  async function checkSessionAndLoad() {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.replace("/temp-login");
        return;
      }
      await loadRows();
    } catch (err) {
      setErrorMsg("인증 확인 중 오류 발생: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadRows() {
    // 새로고침 시 로딩 표시를 보여주기 위해
    const { data, error } = await supabase
      .from("visitors")
      .select("id, name, company, phone, purpose, visit_time, status, car_number, host_name, created_at, checkout_time")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setRows(data ?? []);
    }
  }

  // ⭐ 수동 새로고침 함수
  async function handleRefresh() {
    setLoading(true);
    await loadRows();
    setLoading(false);
  }

  async function updateStatus(id, newStatus) {
    const updateData = { status: newStatus };
    if (newStatus === "방문 완료") {
      updateData.checkout_time = new Date().toISOString();
    }

    const { error } = await supabase
      .from("visitors")
      .update(updateData)
      .eq("id", id);

    if (error) {
      alert("변경 실패: " + error.message);
    } else {
      loadRows();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/temp-login");
  }

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
        (r.car_number || "").toLowerCase().includes(s) ||
        (r.host_name || "").toLowerCase().includes(s)
      );
    });

  if (errorMsg) return <div style={{ padding: "20px", color: "red" }}>오류: {errorMsg}</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: "20px", fontFamily: "'Pretendard', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
          {/* 제목 원복 */}
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1e40af" }}>방문객 관리시스템</h1>
          <button onClick={handleLogout} style={{ padding: "6px 12px", backgroundColor: "#64748b", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>로그아웃</button>
        </header>

        {/* 현재 방문 인원 현황판 + 새로고침 버튼 */}
        <div style={{ 
          backgroundColor: "#1e40af", color: "white", borderRadius: "16px", padding: "20px", marginBottom: "20px", 
          display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 15px rgba(30, 64, 175, 0.2)" 
        }}>
          <div>
            <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>현재 사내 방문객</div>
            <button 
              onClick={handleRefresh}
              style={{ 
                background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "4px 10px", 
                borderRadius: "6px", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" 
              }}
            >
              🔄 {loading ? "갱신 중..." : "새로고침"}
            </button>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "32px", fontWeight: "800" }}>{currentVisitorCount}</span>
            <span style={{ fontSize: "18px", marginLeft: "4px" }}>명</span>
          </div>
        </div>

        <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "12px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <label style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontWeight: "600", color: "#475569", minWidth: "90px" }}>
            <input type="checkbox" checked={filterToday} onChange={(e) => setFilterToday(e.target.checked)} /> 오늘 방문
          </label>
          <input 
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
            placeholder="이름/회사/차량/대상자 검색..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {loading && rows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>데이터 로딩 중...</div>
        ) : rowsToShow.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#64748b", backgroundColor: "white", borderRadius: "16px" }}>내역이 없습니다.</div>
        ) : (
          rowsToShow.map((r) => (
            <div key={r.id} style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", marginBottom: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{r.visit_time ? new Date(r.visit_time).toLocaleString() : "-"} 예정</span>
                <span style={{ 
                  padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold",
                  backgroundColor: r.status === "승인" ? "#dcfce7" : r.status === "반려" ? "#fee2e2" : r.status === "방문 완료" ? "#f1f5f9" : "#fff7ed",
                  color: r.status === "승인" ? "#166534" : r.status === "반려" ? "#991b1b" : r.status === "방문 완료" ? "#64748b" : "#c2410c"
                }}>{r.status || "대기"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "15px", marginBottom: "15px" }}>
                <div>성함: <strong>{r.name}</strong></div>
                <div>연락처: <strong>{r.phone}</strong></div>
                <div>회사: <strong>{r.company || "-"}</strong></div>
                <div>차량: <strong style={{ color: "#2563eb" }}>{r.car_number || "없음"}</strong></div>
                <div style={{ gridColumn: "span 2", padding: "8px 0", borderTop: "1px dashed #f1f5f9", marginTop: "5px" }}>
                  방문 대상자: <strong style={{ color: "#1e40af" }}>{r.host_name || "-"}</strong>
                </div>
                {/* 방문 완료 시각 표시 로직 추가 */}
                {r.status === "방문 완료" && r.checkout_time && (
                   <div style={{ gridColumn: "span 2", fontSize: "12px", color: "#94a3b8", textAlign: "right" }}>
                   방문종료 시각: {new Date(r.checkout_time).toLocaleString()}
                 </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                {(!r.status || r.status === "대기") && (
                  <>
                    <button onClick={() => updateStatus(r.id, "승인")} style={{ flex: 1, padding: "12px", backgroundColor: "#166534", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>승인</button>
                    <button onClick={() => updateStatus(r.id, "반려")} style={{ flex: 1, padding: "12px", backgroundColor: "#991b1b", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>반려</button>
                  </>
                )}
                
                {r.status === "승인" && (
                  <button onClick={() => updateStatus(r.id, "방문 완료")} style={{ flex: 1, padding: "12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>방문 완료 (출문)</button>
                )}
                
                {(r.status === "방문 완료" || r.status === "반려") && (
                  <div style={{ flex: 1, textAlign: "center", color: "#94a3b8", fontSize: "14px", padding: "10px" }}>처리가 완료된 방문입니다.</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}