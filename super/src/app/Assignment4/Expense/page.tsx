"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string; 
}

type Tab = "dashboard" | "add" | "history";

const STORAGE_KEY = "expense-tracker-data";

const EXPENSE_CATEGORIES = [
  { name: "Food & Dining", icon: "🍔", color: "#ef4444" },
  { name: "Transport", icon: "🚗", color: "#f97316" },
  { name: "Shopping", icon: "🛍️", color: "#eab308" },
  { name: "Bills & Utilities", icon: "💡", color: "#22c55e" },
  { name: "Entertainment", icon: "🎬", color: "#3b82f6" },
  { name: "Health", icon: "🏥", color: "#8b5cf6" },
  { name: "Education", icon: "📚", color: "#ec4899" },
  { name: "Other", icon: "📦", color: "#6b7280" },
];

const INCOME_CATEGORIES = [
  { name: "Salary", icon: "💰", color: "#22c55e" },
  { name: "Freelance", icon: "💻", color: "#3b82f6" },
  { name: "Investment", icon: "📈", color: "#8b5cf6" },
  { name: "Gift", icon: "🎁", color: "#ec4899" },
  { name: "Other", icon: "📦", color: "#6b7280" },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatCurrency(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getMonthLabel(yyyy: number, mm: number): string {
  return new Date(yyyy, mm).toLocaleString("default", { month: "long", year: "numeric" });
}

function getCategoryMeta(name: string, type: "income" | "expense") {
  const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return list.find((c) => c.name === name) ?? { name, icon: "📦", color: "#6b7280" };
}

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [formType, setFormType] = useState<"income" | "expense">("expense");
  const [formAmount, setFormAmount] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTransactions(JSON.parse(raw));
    } catch {
      
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  
  const [selYear, selMon] = selectedMonth.split("-").map(Number);

  const monthlyTxns = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === selYear && d.getMonth() + 1 === selMon;
      }),
    [transactions, selYear, selMon]
  );

  const totalIncome = useMemo(
    () => monthlyTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [monthlyTxns]
  );
  const totalExpense = useMemo(
    () => monthlyTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [monthlyTxns]
  );
  const balance = totalIncome - totalExpense;

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyTxns
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount, pct: totalExpense ? (amount / totalExpense) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyTxns, totalExpense]);

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    const now = new Date();
    set.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    transactions.forEach((t) => {
      const d = new Date(t.date);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  const handleAdd = () => {
    const amt = parseFloat(formAmount);
    if (!amt || amt <= 0) return showToast("Enter a valid amount", "error");
    if (!formDesc.trim()) return showToast("Enter a description", "error");

    const txn: Transaction = {
      id: generateId(),
      type: formType,
      amount: amt,
      description: formDesc.trim(),
      category: formCategory,
      date: formDate,
    };
    setTransactions((prev) => [txn, ...prev]);
    setFormAmount("");
    setFormDesc("");
    showToast(`${formType === "income" ? "Income" : "Expense"} added!`);
    setTab("dashboard");
  };

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeleteTarget(null);
    showToast("Transaction deleted");
  };

  useEffect(() => {
    setFormCategory(formType === "income" ? INCOME_CATEGORIES[0].name : EXPENSE_CATEGORIES[0].name);
  }, [formType]);
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all animate-[slideDown_0.3s_ease] ${
            toast.type === "success"
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
          >
            ← Dashboard
          </Link>
          <h1 className="text-lg font-bold tracking-tight">Expense Tracker</h1>
          <div className="w-20" /> {/* spacer */}
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 pb-28 pt-4">
        {tab === "dashboard" && (
          <div className="space-y-6 animate-[fadeIn_0.25s_ease]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{getMonthLabel(selYear, selMon - 1)}</h2>
              <select
                title="Select month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {availableMonths.map((m) => {
                  const [y, mo] = m.split("-").map(Number);
                  return (
                    <option key={m} value={m}>
                      {getMonthLabel(y, mo - 1)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SummaryCard label="Income" amount={totalIncome} color="emerald" />
              <SummaryCard label="Expenses" amount={totalExpense} color="red" />
              <SummaryCard label="Balance" amount={balance} color={balance >= 0 ? "blue" : "orange"} />
            </div>

            {totalIncome > 0 && (
              <div className="bg-gray-900 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Budget Usage</span>
                  <span>
                    {totalExpense > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}% spent
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%`,
                      background:
                        totalExpense / totalIncome > 0.9
                          ? "linear-gradient(90deg, #ef4444, #dc2626)"
                          : totalExpense / totalIncome > 0.7
                          ? "linear-gradient(90deg, #f97316, #ea580c)"
                          : "linear-gradient(90deg, #10b981, #059669)",
                    }}
                  />
                </div>
              </div>
            )}

            {categoryBreakdown.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-5 border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">Expense Breakdown</h3>
                <div className="space-y-4">
                  {categoryBreakdown.map((cat) => {
                    const meta = getCategoryMeta(cat.name, "expense");
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm flex items-center gap-2">
                            <span className="text-base">{meta.icon}</span>
                            {cat.name}
                          </span>
                          <span className="text-sm font-medium text-gray-300">
                            {formatCurrency(cat.amount)}{" "}
                            <span className="text-gray-500 text-xs">({cat.pct.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${cat.pct}%`, backgroundColor: meta.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-400">Recent Transactions</h3>
                {monthlyTxns.length > 5 && (
                  <button
                    onClick={() => setTab("history")}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    View all →
                  </button>
                )}
              </div>

              {monthlyTxns.length === 0 ? (
                <div className="bg-gray-900 rounded-2xl p-10 text-center border border-white/5">
                  <p className="text-3xl mb-3">📭</p>
                  <p className="text-gray-500 text-sm">No transactions this month</p>
                  <button
                    onClick={() => setTab("add")}
                    className="mt-4 text-sm text-emerald-400 hover:underline"
                  >
                    Add your first one →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {monthlyTxns.slice(0, 5).map((txn) => (
                    <TransactionRow
                      key={txn.id}
                      txn={txn}
                      onDelete={() => setDeleteTarget(txn.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "add" && (
          <div className="space-y-5 animate-[fadeIn_0.25s_ease]">
            <h2 className="text-xl font-bold">New Transaction</h2>
            <div className="grid grid-cols-2 bg-gray-900 rounded-xl p-1 border border-white/5">
              {(["expense", "income"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFormType(t)}
                  className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                    formType === t
                      ? t === "expense"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-emerald-500/20 text-emerald-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t === "expense" ? "− Expense" : "+ Income"}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Amount (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3.5 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
              <input
                type="text"
                placeholder="e.g. Grocery shopping"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {(formType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setFormCategory(cat.name)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs border transition-all ${
                      formCategory === cat.name
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-white/5 bg-gray-900 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="truncate w-full text-center leading-tight">{cat.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
              />
            </div>

            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-[0.98] ${
                formType === "expense"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              }`}
            >
              {formType === "expense" ? "Add Expense" : "Add Income"}
            </button>
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Transactions</h2>
              <select
                title="Select month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {availableMonths.map((m) => {
                  const [y, mo] = m.split("-").map(Number);
                  return (
                    <option key={m} value={m}>
                      {getMonthLabel(y, mo - 1)}
                    </option>
                  );
                })}
              </select>
            </div>

            {monthlyTxns.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-10 text-center border border-white/5">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-gray-500 text-sm">No transactions this month</p>
              </div>
            ) : (
              <div className="space-y-2">
                {monthlyTxns
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((txn) => (
                    <TransactionRow
                      key={txn.id}
                      txn={txn}
                      onDelete={() => setDeleteTarget(txn.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
          <div className="bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 border border-white/10 mx-4 mb-0 sm:mb-0">
            <h3 className="text-lg font-bold mb-2">Delete Transaction?</h3>
            <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-medium text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          <NavButton
            active={tab === "dashboard"}
            icon="📊"
            label="Summary"
            onClick={() => setTab("dashboard")}
          />
          <button
            onClick={() => setTab("add")}
            className="relative -top-5 w-14 h-14 rounded-full bg-emerald-500 text-white text-2xl font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 transition-all"
          >
            +
          </button>
          <NavButton
            active={tab === "history"}
            icon="📋"
            label="History"
            onClick={() => setTab("history")}
          />
        </div>
      </nav>

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

function SummaryCard({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color: "emerald" | "red" | "blue" | "orange";
}) {
  const colorMap = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} rounded-2xl p-3.5 border ${c.border}`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-bold ${c.text} truncate`}>{formatCurrency(amount)}</p>
    </div>
  );
}

function TransactionRow({ txn, onDelete }: { txn: Transaction; onDelete: () => void }) {
  const meta = getCategoryMeta(txn.category, txn.type);
  const isIncome = txn.type === "income";
  return (
    <div className="bg-gray-900 rounded-xl px-4 py-3.5 flex items-center gap-3 border border-white/5 hover:border-white/10 transition-colors group">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: meta.color + "18" }}
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{txn.description}</p>
        <p className="text-[11px] text-gray-500">
          {txn.category} · {new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </p>
      </div>
      <div className="text-right shrink-0 flex items-center gap-2">
        <span className={`text-sm font-bold ${isIncome ? "text-emerald-400" : "text-red-400"}`}>
          {isIncome ? "+" : "−"} {formatCurrency(txn.amount)}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-xs p-1"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
        active ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
