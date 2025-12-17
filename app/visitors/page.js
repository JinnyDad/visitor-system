"use client";

console.log("### VISITORS PAGE NEW VERSION ###");

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

  /* ===============================
     최초 진입
  ================================ */
  useEffect(() => {
    checkSessionAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkSessionAndLoad() {
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.getSession();

      // 로그인 안 돼 있으면 바로 이동
      if (error || !data?.session) {
        router.replace("/temp-login");
        return;
      }

      // 방문자 데이터 로드
      await loadRows();
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      // ⭐⭐⭐ 이게 제일 중요
      setLoading(false);
    }
  }

  /* ===============================
     방문자 목록 로드
  ================================ */
  async function loadRows() {
    const { data, error } = await supabase
      .from("visitors")
      .select("id, name, company, phone, purpose, visit_time, status")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setRows([]);
    } else {
      // 👉 데이터가 없어도 [] 로 들어가고, 로딩 종료됨
      setRows(data ?? []);
    }
  }

  /* ===============================
     로그아웃
  ================================ */
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/temp-login");
  }

  /* ===============================
     필터 / 검색
  ================================ */
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
        (r.purpose || "").toLowerCase().includes(s)
      );
    });

  function formatDate(val) {
    if (!val) return "-";
    return new Date(val).toLocaleString("ko-KR");
  }

  /* ===============================
     UI
  ================================ */
  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleLogout} style={{ marginBottom: 12 }}>
        로그아웃
      </button>

      <h1>방문자 목록</h1>

      <div style={{ marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={filterToday}
            onChange={(e) => setFilterToday(e.target.checked)}
          />{" "}
          오늘 방문만
        </label>{" "}
        <input
          placeholder="이름/회사/연락처/목적 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>로딩 중...</p>}

      {!loading && errorMsg && (
        <p style={{ color: "red" }}>{errorMsg}</p>
      )}

      {!loading && rowsToShow.length === 0 && (
        <p>등록된 방문자가 없습니다.</p>
      )}

      {!loading && rowsToShow.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>이름</th>
              <th>회사</th>
              <th>연락처</th>
              <th>목적</th>
              <th>예정일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {rowsToShow.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.company}</td>
                <td>{r.phone}</td>
                <td>{r.purpose}</td>
                <td>{formatDate(r.visit_time)}</td>
                <td>{r.status || "대기"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
