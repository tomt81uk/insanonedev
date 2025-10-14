// app/payroll/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeaderBar from "@/components/HeaderBar";
import {
  Users,
  Calculator,
  FileText,
  CalendarDays,
  Banknote,
  Percent,
  PiggyBank,
  Landmark,
  Upload,
  ScrollText,
  BarChart3,
  ShieldCheck,
  Timer,
  Settings,
  ChevronRight,
  Search,
} from "lucide-react";

type Item = {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  {
    title: "Run Payroll",
    desc: "Review, validate, and calculate payroll.",
    href: "/payroll/run",
    icon: Calculator,
  },
  {
    title: "Payslips",
    desc: "Generate and publish employee payslips.",
    href: "/payroll/payslips",
    icon: FileText,
  },
  {
    title: "Pay Periods",
    desc: "Manage open/closed payroll periods.",
    href: "/payroll/pay-periods",
    icon: CalendarDays,
  },
  {
    title: "Payroll Calendar",
    desc: "Cutoffs, approvals, and pay dates.",
    href: "/payroll/calendar",
    icon: CalendarDays,
  },
  {
    title: "Allowances & Deductions",
    desc: "Recurring and one-off pay elements.",
    href: "/payroll/elements",
    icon: Banknote,
  },
  {
    title: "Tax & NI",
    desc: "Tax codes, NI categories, thresholds.",
    href: "/payroll/tax",
    icon: Percent,
  },
  {
    title: "Pension & Benefits",
    desc: "Schemes, auto-enrolment, contributions.",
    href: "/payroll/benefits",
    icon: PiggyBank,
  },
  {
    title: "Bank Files (BACS/SEPA)",
    desc: "Create and track payment files.",
    href: "/payroll/bank-files",
    icon: Landmark,
  },
  {
    title: "HMRC RTI",
    desc: "FPS/EPS submissions & responses.",
    href: "/payroll/hmrc",
    icon: Upload,
  },
  {
    title: "Journal Export (GL)",
    desc: "Post payroll costs to finance.",
    href: "/payroll/journals",
    icon: ScrollText,
  },
  {
    title: "Reports",
    desc: "KPIs, audits, and statutory reports.",
    href: "/payroll/reports",
    icon: BarChart3,
  },
  {
    title: "Audit & Approvals",
    desc: "Who changed what, and when.",
    href: "/payroll/audit",
    icon: ShieldCheck,
  },
  {
    title: "Overtime & Bonuses",
    desc: "Variable pay & uplifts.",
    href: "/payroll/variations",
    icon: Timer,
  },
  {
    title: "Pay Groups",
    desc: "Group employees & schedules.",
    href: "/payroll/pay-groups",
    icon: Users,
  },
  {
    title: "Settings",
    desc: "Pay rules, rounding, calendars.",
    href: "/payroll/settings",
    icon: Settings,
  },
];

export default function PayrollMenuPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(query) ||
        i.desc.toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      {/* Top bar with nav: Dashboard / HR / Payroll / Actions */}
      <HeaderBar active="Payroll" />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Payroll
          </h1>
          <p className="mt-2 text-slate-600">
            One Platform. One Workforce. One Future.
          </p>
        </header>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search payroll tools
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search payroll…"
              className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-base text-slate-900 placeholder-slate-500 outline-none focus:ring-4 focus:ring-[#335784]/20 focus:border-[#335784]"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-slate-600">
            No payroll tools match “{q}”.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-[#335784]/20"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784]">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-semibold">
                          {item.title}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
