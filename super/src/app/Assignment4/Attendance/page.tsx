"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────
interface Student {
  id: string;
  name: string;
  rollNo: string;
}

interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  records: Record<string, "present" | "absent">; // studentId -> status
}

type Tab = "mark" | "records" | "students" | "analytics";

// ─── Constants ───────────────────────────────────────────────────────
const STORAGE_STUDENTS = "attendance-students";
const STORAGE_RECORDS = "attendance-records";

const DEFAULT_STUDENTS: Student[] = [
  { id: "s1", name: "Aarav Sharma", rollNo: "CS-001" },
  { id: "s2", name: "Priya Patel", rollNo: "CS-002" },
  { id: "s3", name: "Rohan Gupta", rollNo: "CS-003" },
  { id: "s4", name: "Ananya Singh", rollNo: "CS-004" },
  { id: "s5", name: "Vikram Reddy", rollNo: "CS-005" },
  { id: "s6", name: "Neha Verma", rollNo: "CS-006" },
  { id: "s7", name: "Arjun Kumar", rollNo: "CS-007" },
  { id: "s8", name: "Kavya Nair", rollNo: "CS-008" },
  { id: "s9", name: "Ishaan Joshi", rollNo: "CS-009" },
  { id: "s10", name: "Diya Mehta", rollNo: "CS-010" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AttendanceSystem() {
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("mark");

  // Mark attendance state
  const [markDate, setMarkDate] = useState(getToday);
  const [currentMarks, setCurrentMarks] = useState<Record<string, "present" | "absent">>({});

  // Add student form
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRoll, setNewRoll] = useState("");

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Confirm dialog
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // ─── LocalStorage Load ──────────────────────────────────────────
  useEffect(() => {
    try {
      const rawStudents = localStorage.getItem(STORAGE_STUDENTS);
      const rawRecords = localStorage.getItem(STORAGE_RECORDS);
      setStudents(rawStudents ? JSON.parse(rawStudents) : DEFAULT_STUDENTS);
      setRecords(rawRecords ? JSON.parse(rawRecords) : []);
    } catch {
      setStudents(DEFAULT_STUDENTS);
      setRecords([]);
    }
    setLoaded(true);
  }, []);

  // ─── LocalStorage Save ──────────────────────────────────────────
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(students));
      localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
    }
  }, [students, records, loaded]);

  // ─── Toast auto-dismiss ─────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // ─── Load existing marks when date changes ──────────────────────
  useEffect(() => {
    const existing = records.find((r) => r.date === markDate);
    if (existing) {
      setCurrentMarks({ ...existing.records });
    } else {
      // Default all to absent
      const defaults: Record<string, "present" | "absent"> = {};
      students.forEach((s) => (defaults[s.id] = "absent"));
      setCurrentMarks(defaults);
    }
  }, [markDate, records, students]);

  // ─── Derived Data ───────────────────────────────────────────────
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date)),
    [records]
  );

  const getStudentStats = useCallback(
    (studentId: string) => {
      let total = 0;
      let present = 0;
      records.forEach((r) => {
        if (r.records[studentId] !== undefined) {
          total++;
          if (r.records[studentId] === "present") present++;
        }
      });
      return { total, present, absent: total - present, pct: total > 0 ? (present / total) * 100 : 0 };
    },
    [records]
  );

  const overallStats = useMemo(() => {
    if (records.length === 0 || students.length === 0) return { avgPct: 0, totalClasses: records.length };
    const pcts = students.map((s) => getStudentStats(s.id).pct);
    return { avgPct: pcts.reduce((a, b) => a + b, 0) / pcts.length, totalClasses: records.length };
  }, [records, students, getStudentStats]);

  // ─── Handlers ───────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  const toggleMark = (studentId: string) => {
    setCurrentMarks((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const markAll = (status: "present" | "absent") => {
    const updated: Record<string, "present" | "absent"> = {};
    students.forEach((s) => (updated[s.id] = status));
    setCurrentMarks(updated);
  };

  const saveAttendance = () => {
    if (students.length === 0) return showToast("Add students first", "error");
    const existingIdx = records.findIndex((r) => r.date === markDate);
    if (existingIdx >= 0) {
      setRecords((prev) => prev.map((r, i) => (i === existingIdx ? { ...r, records: { ...currentMarks } } : r)));
    } else {
      setRecords((prev) => [...prev, { date: markDate, records: { ...currentMarks } }]);
    }
    showToast(`Attendance saved for ${formatDate(markDate)}`);
  };

  const addStudent = () => {
    if (!newName.trim()) return showToast("Enter student name", "error");
    if (!newRoll.trim()) return showToast("Enter roll number", "error");
    if (students.some((s) => s.rollNo.toLowerCase() === newRoll.trim().toLowerCase()))
      return showToast("Roll number already exists", "error");

    const student: Student = { id: generateId(), name: newName.trim(), rollNo: newRoll.trim().toUpperCase() };
    setStudents((prev) => [...prev, student]);
    setNewName("");
    setNewRoll("");
    setShowAddStudent(false);
    showToast(`${student.name} added!`);
  };

  const removeStudent = (id: string) => {
    const s = students.find((st) => st.id === id);
    setConfirmAction({
      title: "Remove Student?",
      message: `Remove ${s?.name ?? "this student"} and all their attendance records?`,
      onConfirm: () => {
        setStudents((prev) => prev.filter((st) => st.id !== id));
        setRecords((prev) =>
          prev.map((r) => {
            const updated = { ...r.records };
            delete updated[id];
            return { ...r, records: updated };
          })
        );
        setConfirmAction(null);
        showToast("Student removed");
      },
    });
  };

  const deleteRecord = (date: string) => {
    setConfirmAction({
      title: "Delete Record?",
      message: `Delete attendance record for ${formatDate(date)}?`,
      onConfirm: () => {
        setRecords((prev) => prev.filter((r) => r.date !== date));
        setConfirmAction(null);
        showToast("Record deleted");
      },
    });
  };

  const getPctColor = (pct: number) => {
    if (pct >= 75) return { text: "text-emerald-400", bg: "bg-emerald-500", bar: "#10b981" };
    if (pct >= 50) return { text: "text-yellow-400", bg: "bg-yellow-500", bar: "#eab308" };
    return { text: "text-red-400", bg: "bg-red-500", bar: "#ef4444" };
  };

  // ─── Loading ────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const existingRecordForDate = records.find((r) => r.date === markDate);
  const presentCount = Object.values(currentMarks).filter((v) => v === "present").length;
  const absentCount = Object.values(currentMarks).filter((v) => v === "absent").length;

  // ─── UI ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all animate-[slideDown_0.3s_ease] ${
            toast.type === "success" ? "bg-violet-500/90 text-white" : "bg-red-500/90 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-5 py-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1">
            ← Dashboard
          </Link>
          <h1 className="text-lg font-bold tracking-tight">📋 Attendance System</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Tab Bar */}
      <div className="sticky top-[61px] z-30 bg-gray-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto flex gap-1 px-5 py-2">
          {(
            [
              { key: "mark", icon: "✅", label: "Mark" },
              { key: "records", icon: "📅", label: "Records" },
              { key: "students", icon: "👥", label: "Students" },
              { key: "analytics", icon: "📊", label: "Analytics" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t.key
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-5 pb-8 pt-4">
        {/* ── MARK ATTENDANCE TAB ────────────────────────────── */}
        {tab === "mark" && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
            {/* Date & Controls */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={markDate}
                    onChange={(e) => setMarkDate(e.target.value)}
                    className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 [color-scheme:dark]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAll("present")}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors"
                  >
                    All Present
                  </button>
                  <button
                    onClick={() => markAll("absent")}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-colors"
                  >
                    All Absent
                  </button>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4 text-xs">
                {existingRecordForDate && (
                  <span className="text-violet-400 bg-violet-500/10 px-2 py-1 rounded-md">
                    ✏️ Editing existing record
                  </span>
                )}
                <span className="text-emerald-400">✓ {presentCount} Present</span>
                <span className="text-red-400">✗ {absentCount} Absent</span>
              </div>
            </div>

            {/* Student List */}
            {students.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-10 text-center border border-white/5">
                <p className="text-3xl mb-3">👥</p>
                <p className="text-gray-500 text-sm">No students added yet</p>
                <button onClick={() => setTab("students")} className="mt-3 text-sm text-violet-400 hover:underline">
                  Add students →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student, idx) => {
                  const isPresent = currentMarks[student.id] === "present";
                  return (
                    <button
                      key={student.id}
                      onClick={() => toggleMark(student.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${
                        isPresent
                          ? "bg-emerald-500/8 border-emerald-500/20 hover:border-emerald-500/40"
                          : "bg-gray-900 border-white/5 hover:border-white/15"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          isPresent ? "bg-emerald-500 border-emerald-500" : "border-gray-600"
                        }`}
                      >
                        {isPresent && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isPresent ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {getInitials(student.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isPresent ? "text-white" : "text-gray-400"}`}>
                          {student.name}
                        </p>
                        <p className="text-[11px] text-gray-600">{student.rollNo}</p>
                      </div>

                      {/* Index */}
                      <span className="text-[11px] text-gray-700 font-mono">{idx + 1}</span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md ${
                          isPresent ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {isPresent ? "PRESENT" : "ABSENT"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Save Button */}
            {students.length > 0 && (
              <button
                onClick={saveAttendance}
                className="w-full py-4 rounded-xl font-bold text-sm tracking-wide bg-violet-500 hover:bg-violet-600 text-white shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98]"
              >
                {existingRecordForDate ? "Update Attendance" : "Save Attendance"}
              </button>
            )}
          </div>
        )}

        {/* ── RECORDS TAB ────────────────────────────────────── */}
        {tab === "records" && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
            <h2 className="text-xl font-bold">Attendance Records</h2>

            {sortedRecords.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-10 text-center border border-white/5">
                <p className="text-3xl mb-3">📅</p>
                <p className="text-gray-500 text-sm">No records yet. Mark attendance to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedRecords.map((rec) => {
                  const p = Object.values(rec.records).filter((v) => v === "present").length;
                  const total = Object.keys(rec.records).length;
                  const pct = total > 0 ? (p / total) * 100 : 0;
                  const colors = getPctColor(pct);

                  return (
                    <div
                      key={rec.date}
                      className="bg-gray-900 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold">{formatDate(rec.date)}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {p}/{total} present · {total - p} absent
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${colors.text}`}>{Math.round(pct)}%</span>
                          <button
                            onClick={() => {
                              setMarkDate(rec.date);
                              setTab("mark");
                            }}
                            className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 hover:text-violet-400 transition-all"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteRecord(rec.date)}
                            className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 hover:text-red-400 transition-all"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      {/* Bar */}
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pct}%`, backgroundColor: colors.bar }}
                        />
                      </div>
                      {/* Students list (compact) */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {students.map((s) => {
                          const status = rec.records[s.id];
                          if (!status) return null;
                          return (
                            <span
                              key={s.id}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                status === "present"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                              title={`${s.name} - ${status}`}
                            >
                              {s.rollNo}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── STUDENTS TAB ───────────────────────────────────── */}
        {tab === "students" && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Students ({students.length})</h2>
              <button
                onClick={() => setShowAddStudent((v) => !v)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/25 transition-colors"
              >
                {showAddStudent ? "Cancel" : "+ Add Student"}
              </button>
            </div>

            {/* Add Student Form */}
            {showAddStudent && (
              <div className="bg-gray-900 rounded-2xl p-5 border border-violet-500/20 space-y-3 animate-[fadeIn_0.2s_ease]">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Mishra"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Roll Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-011"
                    value={newRoll}
                    onChange={(e) => setNewRoll(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-600"
                  />
                </div>
                <button
                  onClick={addStudent}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-violet-500 hover:bg-violet-600 text-white transition-all active:scale-[0.98]"
                >
                  Add Student
                </button>
              </div>
            )}

            {/* Student List */}
            {students.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-10 text-center border border-white/5">
                <p className="text-3xl mb-3">📝</p>
                <p className="text-gray-500 text-sm">No students yet. Add your first student above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student, idx) => {
                  const stats = getStudentStats(student.id);
                  const colors = getPctColor(stats.pct);
                  return (
                    <div
                      key={student.id}
                      className="bg-gray-900 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-white/5 hover:border-white/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-violet-500/15 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-[11px] text-gray-500">{student.rollNo} · #{idx + 1}</p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-3">
                        {stats.total > 0 && (
                          <span className={`text-xs font-bold ${colors.text}`}>{Math.round(stats.pct)}%</span>
                        )}
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs p-1"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ──────────────────────────────────── */}
        {tab === "analytics" && (
          <div className="space-y-5 animate-[fadeIn_0.25s_ease]">
            <h2 className="text-xl font-bold">Attendance Analytics</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-violet-500/10 rounded-2xl p-3.5 border border-violet-500/20">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Total Classes</p>
                <p className="text-xl font-bold text-violet-400">{overallStats.totalClasses}</p>
              </div>
              <div className="bg-blue-500/10 rounded-2xl p-3.5 border border-blue-500/20">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Students</p>
                <p className="text-xl font-bold text-blue-400">{students.length}</p>
              </div>
              <div className={`rounded-2xl p-3.5 border ${getPctColor(overallStats.avgPct).text === "text-emerald-400" ? "bg-emerald-500/10 border-emerald-500/20" : getPctColor(overallStats.avgPct).text === "text-yellow-400" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Avg Attendance</p>
                <p className={`text-xl font-bold ${getPctColor(overallStats.avgPct).text}`}>
                  {overallStats.totalClasses > 0 ? Math.round(overallStats.avgPct) : 0}%
                </p>
              </div>
            </div>

            {/* Per-student breakdown */}
            {students.length > 0 && records.length > 0 ? (
              <div className="bg-gray-900 rounded-2xl p-5 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">Student-wise Attendance</h3>
                <div className="space-y-4">
                  {students
                    .map((s) => ({ student: s, stats: getStudentStats(s.id) }))
                    .sort((a, b) => b.stats.pct - a.stats.pct)
                    .map(({ student, stats }) => {
                      const colors = getPctColor(stats.pct);
                      return (
                        <div key={student.id}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                {getInitials(student.name)}
                              </span>
                              <span>
                                {student.name}
                                <span className="text-gray-600 text-[11px] ml-1.5">{student.rollNo}</span>
                              </span>
                            </span>
                            <span className="text-sm font-medium">
                              <span className={`font-bold ${colors.text}`}>{Math.round(stats.pct)}%</span>
                              <span className="text-gray-600 text-[11px] ml-1.5">
                                ({stats.present}/{stats.total})
                              </span>
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${stats.pct}%`, backgroundColor: colors.bar }}
                            />
                          </div>
                          {stats.pct < 75 && stats.total > 0 && (
                            <p className="text-[10px] text-red-400/80 mt-1">
                              ⚠ Below 75% minimum attendance requirement
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl p-10 text-center border border-white/5">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-gray-500 text-sm">Mark attendance to see analytics here.</p>
              </div>
            )}

            {/* Attendance Legend */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-white/5">
              <h3 className="text-xs font-semibold text-gray-500 mb-3">Attendance Legend</h3>
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  ≥ 75% — Good
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  50–74% — Warning
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  &lt; 50% — Critical
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirm Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
          <div className="bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 border border-white/10 mx-4">
            <h3 className="text-lg font-bold mb-2">{confirmAction.title}</h3>
            <p className="text-sm text-gray-400 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction.onConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
