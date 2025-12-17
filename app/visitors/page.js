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
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [filterToday, setFilterToday] = useState(false);

  /* ===============================
     최초 진입
  ================================ */
  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        router.replace("/login");
        return;
      }

      const email = data.session.user.email;

      await checkAdmin(email);
      await loadRows();
    } catch (err) {
      setErrorMsg(String(err));
    } finally {
      // 🔥 이 줄이 핵심
      setLoading(false);
    }
  }

  /* ===============================
     관리자 확인
  ================================ */
  async function checkAdmin(email) {
    const { data, error } = await supabase
      .from("visitors")
      .select("is_admin")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    setIsAdmin(!error && data?.is_admin === true);
  }

  /* ===============================
     방문자 목록
  ================================ */
  async function loadRows() {
    const { data, error } = await supabase
      .from("visitors")
      .select("id, name, company, phone, purpose, visit_time, created_at, status")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setRows([]);
    } else {
      setRows(data ?? []);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  /* ===============================
     필터
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
      <button onClick={handleLogout}>로그아웃</button>

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
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>로딩 중...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {!loading && rowsToShow.length === 0 && (
        <p>등록된 방문자가 없습니다.</p>
      )}

      {!loading && rowsToShow.length > 0 && (
        <table border="1" cellPadding="8">
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
