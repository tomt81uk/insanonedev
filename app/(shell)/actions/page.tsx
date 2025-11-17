"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">

      {/* Heading + Search */}
      <header className="mb-6 md:mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Actions
          </h1>
          <p className="text-[var(--muted)]">
            Quick tasks across HR & Payroll.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-80">
          <label
            htmlFor="actions-search"
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
          >
            Search
          </label>

          <input
            id="actions-search"
            type="search"
            placeholder="Search actions…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="
              w-full rounded-xl px-4 py-2.5
              bg-[var(--background)] text-[var(--foreground)]
              border border-[var(--border)]
              placeholder-[var(--muted)]
              focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
            "
          />
        </div>
      </header>

      {/* Cards grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {filtered.map((a) => (
          <li key={a.title} className="h-full">
            <Link
              href={a.href}
              className="
                group block h-full rounded-2xl border border-[var(--border)]
                bg-[var(--background-alt)] p-5 shadow-sm
                transition hover:shadow-md hover:border-[var(--focus)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]
              "
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    inline-flex h-10 w-10 items-center justify-center rounded-xl
                    border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]
                    transition group-hover:border-[var(--brand-strong)]
                  "
                  aria-hidden
                >
                  <a.icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold">{a.title}</div>
                  <div className="text-sm text-[var(--muted)] line-clamp-1">
                    {a.desc}
                  </div>
                </div>

                <ChevronRight
                  className="
                    h-5 w-5 shrink-0 text-[var(--muted)]
                    opacity-0 -translate-x-1 transition
                    group-hover:opacity-100 group-hover:translate-x-0
                  "
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* No footer — layout includes global footer */}
    </section>
  );
}
