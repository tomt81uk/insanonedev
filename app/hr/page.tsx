"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeaderBar from "@/components/HeaderBar";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Briefcase,
  CalendarCheck2,
  FileText,
  ShieldCheck,
  IdCard,
  Banknote,
  Bug,
  ClipboardCheck,
  Rocket,
  LogOut,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";

type Card = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
};

export default function HRMenuPage() {
  const [q, setQ] = useState("");

  const CARDS: Card[] = useMemo(
    () => [
      { title: "People", desc: "Employees, profiles, contacts, IDs", href: "/workers", icon: Users },
      { title: "Positions", desc: "Jobs, grades, posts & structure", href: "/app/hr/positions", icon: Briefcase },
      { title: "Leave & Absence", desc: "Annual leave, sickness, balances", href: "/app/hr/leave", icon: CalendarCheck2 },
      { title: "Documents", desc: "Contracts, policies, attachments", href: "/app/hr/documents", icon: FileText },
      { title: "Compliance", desc: "Right-to-work, expiries, training", href: "/app/hr/compliance", icon: ShieldCheck },
      { title: "Visas & IDs", desc: "Residency, work permits, EID", href: "/app/hr/visas", icon: IdCard },
      { title: "Bank Changes", desc: "IBAN updates & approvals", href: "/app/hr/bank-changes", icon: Banknote },
      { title: "Data Quality", desc: "Validation issues and fixes", href: "/app/hr/data-quality", icon: Bug },
      { title: "Background Checks", desc: "Clearance & onboarding evidence", href: "/app/hr/background-checks", icon: ClipboardCheck },
      { title: "Probation", desc: "Reviews & outcomes", href: "/app/hr/probation", icon: Rocket },
      { title: "Leavers", desc: "Offboarding & exit tasks", href: "/app/hr/leavers", icon: LogOut },
      { title: "Reports", desc: "Headcount, leave, compliance", href: "/app/hr/reports", icon: BarChart3 },
      { title: "Settings", desc: "Grades, work patterns, lookups", href: "/app/hr/settings", icon: Settings },
    ],
    []
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return CARDS;
    return CARDS.filter((c) =>
      [c.title, c.desc].some((v) => v.toLowerCase().includes(t))
    );
  }, [q, CARDS]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <HeaderBar active="HR" />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Heading + search */}
        <header className="mb-6 md:mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">HR</h1>
            <p className="text-slate-600">Pick an area to manage.</p>
          </div>

          <div className="w-full sm:w-80">
            <label
              htmlFor="hr-search"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Search
            </label>
            <input
              id="hr-search"
              type="search"
              placeholder="Search HR…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#335784]"
            />
          </div>
        </header>

        {/* Cards grid */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <li key={c.title}>
              <Link
                href={c.href}
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
                    <c.icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold">{c.title}</div>
                    <div className="text-sm text-slate-600 line-clamp-1">{c.desc}</div>
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

        {/* Footer tagline */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium">Human. Innovation. Simplicity.</p>
          <p className="mt-1 text-xs text-slate-600">
            © 2025 insanONE. No unauthorised access.
          </p>
        </div>
      </main>
    </div>
  );
}
