// app/reporting/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeaderBar from "@/components/HeaderBar";
import {
  BarChart3,
  PieChart,
  LineChart,
  FileSpreadsheet,
  Users,
  Banknote,
  ShieldCheck,
  CalendarClock,
  Download,
  Filter,
} from "lucide-react";

type ReportTag = "HR" | "Payroll" | "Compliance" | "Time";

type Report = {
  slug: string;
  title: string;
  desc: string;
  href: string;
  icon:
    | typeof BarChart3
    | typeof PieChart
    | typeof LineChart
    | typeof FileSpreadsheet
    | typeof Users
    | typeof Banknote
    | typeof ShieldCheck
    | typeof CalendarClock;
  tags: ReportTag[];
  schedule?: "Ad hoc" | "Daily" | "Weekly" | "Monthly";
};

export default function ReportingPage() {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<ReportTag | "All">("All");

  const REPORTS: Report[] = useMemo(
    () => [
      {
        slug: "headcount-by-dept",
        title: "Headcount by Department",
        desc: "Active employees, FTE, and joiners/leavers by org unit.",
        href: "/reporting/headcount-by-dept",
        icon: Users,
        tags: ["HR"],
        schedule: "Monthly",
      },
      {
        slug: "leave-balances",
        title: "Leave Balances",
        desc: "Accruals, taken, and remaining leave by employee.",
        href: "/reporting/leave-balances",
        icon: CalendarClock,
        tags: ["HR", "Time"],
        schedule: "Weekly",
      },
      {
        slug: "compliance-expiries",
        title: "Compliance Expiries",
        desc: "Visas, IDs, and mandatory training due/overdue.",
        href: "/reporting/compliance-expiries",
        icon: ShieldCheck,
        tags: ["Compliance", "HR"],
        schedule: "Daily",
      },
      {
        slug: "payroll-summary",
        title: "Payroll Summary",
        desc: "Gross, net, deductions, and employer costs by period.",
        href: "/reporting/payroll-summary",
        icon: Banknote,
        tags: ["Payroll"],
        schedule: "Monthly",
      },
      {
        slug: "overtime-trends",
        title: "Overtime Trends",
        desc: "Hours and cost trend lines by team and month.",
        href: "/reporting/overtime-trends",
        icon: LineChart,
        tags: ["Time", "Payroll"],
        schedule: "Monthly",
      },
      {
        slug: "diversity-snapshot",
        title: "Diversity Snapshot",
        desc: "High-level workforce composition view.",
        href: "/reporting/diversity-snapshot",
        icon: PieChart,
        tags: ["HR"],
        schedule: "Ad hoc",
      },
      {
        slug: "data-quality-issues",
        title: "Data Quality Issues",
        desc: "Missing fields, invalid codes, and orphan records.",
        href: "/reporting/data-quality-issues",
        icon: FileSpreadsheet,
        tags: ["HR", "Compliance"],
        schedule: "Weekly",
      },
      {
        slug: "headcount-trend",
        title: "Headcount Trend",
        desc: "12-month movement with hires and exits.",
        href: "/reporting/headcount-trend",
        icon: BarChart3,
        tags: ["HR"],
        schedule: "Monthly",
      },
    ],
    []
  );

  const TAGS: (ReportTag | "All")[] = ["All", "HR", "Payroll", "Compliance", "Time"];

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return REPORTS.filter((r) => {
      const textMatch =
        !t ||
        [r.title, r.desc, r.tags.join(" "), r.schedule ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(t);
      const tagMatch = activeTag === "All" || r.tags.includes(activeTag);
      return textMatch && tagMatch;
    });
  }, [q, activeTag, REPORTS]);

  const RECENT_RUNS = [
    { id: 1, name: "Compliance Expiries", when: "Today 08:10", status: "ok" as const, format: "CSV", by: "Scheduler" },
    { id: 2, name: "Payroll Summary", when: "Yesterday 18:02", status: "warn" as const, format: "XLSX", by: "Finance Ops" },
    { id: 3, name: "Leave Balances", when: "Yesterday 09:31", status: "ok" as const, format: "CSV", by: "Scheduler" },
    { id: 4, name: "Data Quality Issues", when: "Mon 11:47", status: "fail" as const, format: "CSV", by: "HR Admin" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0a1a3a] flex flex-col">
      <HeaderBar />

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Reporting</h1>
              <p className="text-gray-600">
                Run ad-hoc reports, view scheduled outputs, and export data.
              </p>
            </div>

            {/* Search */}
            <div className="w-full sm:w-96">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="report-search">
                Search
              </label>
              <div className="relative">
                <input
                  id="report-search"
                  type="search"
                  placeholder="Search reports…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f6fed]"
                />
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden />
              </div>
            </div>
          </div>

          {/* Tag filter chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const active = activeTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTag(t)}
                  className={[
                    "rounded-full border px-3 py-1 text-sm transition",
                    active
                      ? "border-[#2f6fed] text-[#2f6fed] bg-[#2f6fed]/5"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link
              href="/reporting/new"
              className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-[#2f6fed]/20"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#335784]/10 text-[#335784]">
                  <FileSpreadsheet className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-semibold">New ad-hoc export</div>
                  <div className="text-xs text-gray-600">Pick fields, filters, and format.</div>
                </div>
              </div>
            </Link>

            <Link
              href="/reporting/schedules"
              className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-[#2f6fed]/20"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#335784]/10 text-[#335784]">
                  <CalendarClock className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-semibold">Schedules</div>
                  <div className="text-xs text-gray-600">Manage automated report runs.</div>
                </div>
              </div>
            </Link>

            <Link
              href="/reporting/data-dictionary"
              className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 focus-visible:ring-4 focus-visible:ring-[#2f6fed]/20"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#335784]/10 text-[#335784]">
                  <Download className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <div className="text-sm font-semibold">Data dictionary</div>
                  <div className="text-xs text-gray-600">Fields, tables, and definitions.</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Report catalog */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <Link
                key={r.slug}
                href={r.href}
                className="group rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2f6fed]/20"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784] shrink-0">
                    <r.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-semibold truncate">{r.title}</div>
                    <div className="text-sm text-gray-600">{r.desc}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {t}
                        </span>
                      ))}
                      {r.schedule && (
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700">
                          {r.schedule}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent runs */}
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Recent runs</h2>
              <Link
                href="/reporting/history"
                className="text-sm text-[#2f6fed] hover:underline"
              >
                View history
              </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">Report</th>
                    <th className="text-left font-medium px-4 py-3">When</th>
                    <th className="text-left font-medium px-4 py-3">By</th>
                    <th className="text-left font-medium px-4 py-3">Format</th>
                    <th className="text-left font-medium px-4 py-3">Status</th>
                    <th className="text-right font-medium px-4 py-3">Output</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {RECENT_RUNS.map((r) => (
                    <tr key={r.id} className="bg-white">
                      <td className="px-4 py-3">{r.name}</td>
                      <td className="px-4 py-3 text-gray-700">{r.when}</td>
                      <td className="px-4 py-3 text-gray-700">{r.by}</td>
                      <td className="px-4 py-3 text-gray-700">{r.format}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={[
                              "inline-block h-2.5 w-2.5 rounded-full",
                              r.status === "ok"
                                ? "bg-emerald-500"
                                : r.status === "warn"
                                ? "bg-amber-500"
                                : "bg-rose-500",
                            ].join(" ")}
                            aria-hidden
                          />
                          <span className="text-gray-700">
                            {r.status === "ok" ? "Success" : r.status === "warn" ? "Warnings" : "Failed"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href="#"
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4" aria-hidden />
                          Download
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer tagline */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium">Human. Innovation. Simplicity.</p>
            <p className="text-xs text-gray-600 mt-1">
              © 2025 insanONE. No unauthorised access.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
