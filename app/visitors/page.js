"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// CSV 변환 함수
function toCSV(rows) {
  if (!rows || rows.length === 0) return "";
  
  const header = Object.keys(rows[0]).join(",");
  const body = rows
    .map((row) =>
      Object.values(row)
        .map((v) =>
          v === null || v === undefined ? "" : `"${String(v).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  return header + "\n" + body;
}

// CSV 다운로드
function downloadCSVFile(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function VisitorsListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterToday, setFilterToday] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

async function checkAdmin(email) {
  console.log("관리자 체크 이메일:", email);

  const { data, error } = await supabase
    .from("visitors")
    .select("is_admin")
    .eq("email", email)
    .single();

  console.log("관리자 조회 결과:", data, error);

  if (!error && data?.is_admin === true) {
    console.log("관리자 확인됨");
    setIsAdmin(true);
  } else {
    console.log("관리자 아님");
    setIsAdmin(false);
  }
}

  useEffect(() => {
  checkSession();
}, []);

async function checkSession() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    router.push("/login");
    return;
  }

  const email = data.session.user.email;
  await checkAdmin(email);
  loadRows();
}

  async function loadRows() {
    setLoading(true);
    setErrorMsg("");

    try {
      let query = supabase
        .from("visitors")
        .select("id, name, company, phone, purpose, visit_time, created_at")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        setErrorMsg(error.message);
        setRows([]);
      } else {
        setRows(data || []);
      }
    } catch (e) {
      setErrorMsg(String(e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setLoading(true);
    const { error } = await supabase.from("visitors").delete().eq("id", id);

    if (error) {
      setErrorMsg("삭제 오류: " + error.message);
    } else {
      await loadRows();
    }

    setLoading(false);
  }

  async function handleApprove(id) {
  setLoading(true);
  const { error } = await supabase
    .from("visitors")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    setErrorMsg("승인 오류: " + error.message);
  } else {
    await loadRows();
  }
  setLoading(false);
}

async function handleReject(id) {
  setLoading(true);
  const { error } = await supabase
    .from("visitors")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    setErrorMsg("반려 오류: " + error.message);
  } else {
    await loadRows();
  }
  setLoading(false);
}
  
  // 검색 + 오늘 필터 적용
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

  function formatDateTime(val) {
    if (!val) return "-";
    try {
      const d = new Date(val);
      return d.toLocaleString("ko-KR");
    } catch {
      return val;
    }
  }

  function StatusBadge({ status }) {
  let text = "대기";
  let bg = "#facc15"; // 노랑
  let color = "#000";

  if (status === "approved") {
    text = "승인";
    bg = "#22c55e"; // 초록
    color = "#fff";
  } else if (status === "rejected") {
    text = "반려";
    bg = "#ef4444"; // 빨강
    color = "#fff";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 12,
        backgroundColor: bg,
        color,
        fontSize: 12,
        fontWeight: "bold",
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}

  // CSV 다운로드 버튼 핸들러
  function handleDownloadCSV() {
    if (!rowsToShow || rowsToShow.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const csv = toCSV(rowsToShow);
    downloadCSVFile("visitors.csv", csv);
  }

  return (
    <div style={{ padding: 20 }}>
      <button
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }}
  style={{ marginBottom: 16 }}
>
  로그아웃
</button>

      <h1>방문자 목록</h1>

      <div style={{ marginBottom: 12 }}>
        <button onClick={loadRows} disabled={loading} style={{ marginRight: 8 }}>
          새로고침
        </button>

        <button onClick={handleDownloadCSV} style={{ marginRight: 12 }}>
          CSV 다운로드
        </button>

        <label style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            checked={filterToday}
            onChange={(e) => setFilterToday(e.target.checked)}
          />{" "}
          오늘 방문만
        </label>

        <input
          placeholder="이름/회사/연락처/목적 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 8 }}
        />
      </div>

      {loading && <p>로딩 중...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>이름</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>회사</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>연락처</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>목적</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>예정일시</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>등록일</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>담당자 확인</th>
          </tr>
        </thead>
        <tbody>
          {rowsToShow.length === 0 && !loading && (
            <tr>
              <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}

          {rowsToShow.map((r) => (
            <tr key={r.id}>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{r.name}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{r.company}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{r.phone}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>{r.purpose}</td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>
                {formatDateTime(r.visit_time)}
              </td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>
                {formatDateTime(r.created_at)}
              </td>
              <td style={{ border: "1px solid #eee", padding: 8 }}>
                {isAdmin && (
  <div style={{ display: "flex", gap: 6 }}>
    {r.status !== "approved" && (
      <button onClick={() => handleApprove(r.id)} disabled={loading}>
        승인
      </button>
    )}

    {r.status !== "rejected" && (
      <button onClick={() => handleReject(r.id)} disabled={loading}>
        반려
      </button>
    )}

    <button onClick={() => handleDelete(r.id)} disabled={loading}>
      삭제
    </button>
  </div>
)}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
