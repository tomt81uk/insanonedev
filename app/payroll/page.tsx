// app/payroll/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
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
  icon: LucideIcon;
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
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Heading */}
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Payroll
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          One Platform. One Workforce. One Future.
        </p>
      </header>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="sr-only">
          Search payroll tools
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted)]" />
          <input
            id="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search payroll…"
            className="
              w-full rounded-2xl pl-10 pr-4 py-2.5 text-base
              bg-[var(--background)] text-[var(--foreground)]
              border border-[var(--border)]
              placeholder-[var(--muted)]
              outline-none focus:ring-2 focus:ring-[var(--focus)]
            "
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">
          No payroll tools match “{q}”.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          {filtered.map((item) => (
            <li key={item.href} className="h-full">
              <Link
                href={item.href}
                className="
                  group block h-full rounded-2xl border border-[var(--border)]
                  bg-[var(--background-alt)] p-5 shadow-sm
                  transition hover:shadow-md hover:border-[var(--focus)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]
                "
              >
                <div className="flex items-start gap-4">
                  <span
                    className="
                      inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
                      border border-[var(--brand)] text-[var(--brand)]
                      bg-[var(--background)]
                    "
                  >
                    <item.icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-lg font-semibold">
                        {item.title}
                      </h3>
                      <ChevronRight
                        className="
                          h-4 w-4 text-[var(--muted)]
                          opacity-0 transition group-hover:opacity-100
                        "
                      />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
