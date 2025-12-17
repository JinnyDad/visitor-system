"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

/* ===============================
   CSV 유틸
================================ */
function toCSV(rows) {
  if (!rows || rows.length === 0) return "";

  const header = Object.keys(rows[0]).join(",");
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((v) =>
          v === null || v === undefined
            ? ""
            : `"${String(v).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  return header + "\n" + body;
}

function downloadCSVFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ===============================
   메인 페이지
================================ */
export default function VisitorsListPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterToday, setFilterToday] = useState(false);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  /* ===============================
     초기 진입
  ================================ */
  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);

    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const email = data.session.user.email;
    await checkAdmin(email);
    await loadRows();
  }

  /* ===============================
     관리자 여부 확인
  ================================ */
  async function checkAdmin(email) {
    const { data, error } = await supabase
      .from("visitors")
      .select("is_admin")
      .eq("email", email)
      .single();

    if (!error && data?.is_admin === true) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  /* ===============================
     방문자 목록 로드
  ================================ */
  async function loadRows() {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("visitors")
      .select(
        "id, name, company, phone, purpose, visit_time, created_at, status"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setRows([]);
    } else {
      setRows(data ?? []);
    }

    setLoading(false);
  }

  /* ===============================
     액션들
  ================================ */
  async function handleDelete(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setLoading(true);
    await supabase.from("visitors").delete().eq("id", id);
    await loadRows();
  }

  async function handleApprove(id) {
    setLoading(true);
    await supabase.from("visitors").update({ status: "approved" }).eq("id", id);
    await loadRows();
  }

  async function handleReject(id) {
    setLoading(true);
    await supabase.from("visitors").update({ status: "rejected" }).eq("id", id);
    await loadRows();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleDownloadCSV() {
    if (rowsToShow.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const csv = toCSV(rowsToShow);
    downloadCSVFile("visitors.csv", csv);
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

  function StatusBadge({ status }) {
    if (status === "approved")
      return <span style={{ color: "green" }}>승인</span>;
    if (status === "rejected")
      return <span style={{ color: "red" }}>반려</span>;
    return <span style={{ color: "#999" }}>대기</span>;
  }

  /* ===============================
     화면
  ================================ */
  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleLogout} style={{ marginBottom: 12 }}>
        로그아웃
      </button>

      <h1>방문자 목록</h1>

      <div style={{ marginBottom: 12 }}>
        <button onClick={loadRows} disabled={loading}>
          새로고침
        </button>{" "}
        <button onClick={handleDownloadCSV}>CSV 다운로드</button>{" "}
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
        <p style={{ marginTop: 20 }}>등록된 방문자가 없습니다.</p>
      )}

      {!loading && rowsToShow.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>이름</th>
              <th>회사</th>
              <th>연락처</th>
              <th>목적</th>
              <th>예정일</th>
              <th>상태</th>
              <th>담당자 확인</th>
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
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleApprove(r.id)}>승인</button>{" "}
                      <button onClick={() => handleReject(r.id)}>반려</button>{" "}
                      <button onClick={() => handleDelete(r.id)}>삭제</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
