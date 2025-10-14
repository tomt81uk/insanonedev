// app/app/actions/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeaderBar from "@/components/HeaderBar";
import type { LucideIcon } from "lucide-react";
import {
  PlayCircle, CheckCircle2, UserPlus, FileSignature, Banknote, LogOut,
  Megaphone, BarChart3, Settings, ClipboardList, Wallet, ChevronRight
} from "lucide-react";

type ActionCard = { title: string; desc: string; href: string; icon: LucideIcon };

export default function ActionsPage() {
  const [q, setQ] = useState("");

  const ACTIONS: ActionCard[] = useMemo(
    () => [
      { title: "Run Payroll", desc: "Start a new payroll run", href: "/app/payroll/run", icon: PlayCircle },
      { title: "Approve Payroll", desc: "Review & approve this month", href: "/app/payroll/approve", icon: CheckCircle2 },
      { title: "Add Employee", desc: "Create a new hire record", href: "/app/hr/people/new", icon: UserPlus },
      { title: "Issue Contract", desc: "Generate & send offer/contract", href: "/app/hr/documents/contract", icon: FileSignature },
      { title: "Approve Leave", desc: "Requests waiting for your decision", href: "/app/hr/leave/approvals", icon: ClipboardList },
      { title: "Expense Reimbursements", desc: "Review and pay claims", href: "/app/payroll/expenses", icon: Wallet },
      { title: "Bank Change Requests", desc: "Approve IBAN/account updates", href: "/app/hr/bank-changes", icon: Banknote },
      { title: "Process Leaver", desc: "Offboarding & final pay", href: "/app/hr/leavers/new", icon: LogOut },
      { title: "Announcement", desc: "Post a company-wide update", href: "/app/actions/announcement", icon: Megaphone },
      { title: "Reports", desc: "Headcount, leave, payroll", href: "/app/reports", icon: BarChart3 },
      { title: "Settings", desc: "Payroll & HR configurations", href: "/app/settings", icon: Settings },
    ],
    []
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ACTIONS;
    return ACTIONS.filter(a => [a.title, a.desc].some(v => v.toLowerCase().includes(t)));
  }, [q, ACTIONS]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <HeaderBar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Heading + search */}
        <header className="mb-6 md:mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Actions</h1>
            <p className="text-slate-600">Quick tasks across HR & Payroll.</p>
          </div>

          <div className="w-full sm:w-80">
            <label htmlFor="actions-search" className="block text-sm font-medium text-slate-700 mb-1">
              Search
            </label>
            <input
              id="actions-search"
              type="search"
              placeholder="Search actions…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#335784]"
            />
          </div>
        </header>

        {/* Cards grid */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <li key={a.title}>
              <Link
                href={a.href}
                className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition
                           hover:shadow-md hover:border-slate-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#335784]/20"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                               bg-[#335784]/10 text-[#335784] ring-1 ring-[#335784]/20
                               transition group-hover:ring-[#335784]/30"
                    aria-hidden
                  >
                    <a.icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold">{a.title}</div>
                    <div className="text-sm text-slate-600 line-clamp-1">{a.desc}</div>
                  </div>

                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-slate-400 opacity-0 -translate-x-1 transition
                               group-hover:opacity-100 group-hover:translate-x-0"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium">Human. Innovation. Simplicity.</p>
          <p className="mt-1 text-xs text-slate-600">© 2025 insanONE. No unauthorised access.</p>
        </div>
      </main>
    </div>
  );
}
