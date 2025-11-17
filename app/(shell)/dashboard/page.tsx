// app/app/dashboard/page.tsx
import { headers } from "next/headers";
import Link from "next/link";

import type { LucideIcon } from "lucide-react";
import {
  Users,
  CalendarCheck2,
  Banknote,
  ClipboardList,
  FileText,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  IdCard,
  Megaphone,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Metric = {
  title: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "flat";
  icon: LucideIcon;
  href: string;
};

type Quick = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
};

const METRICS: Metric[] = [
  {
    title: "Headcount",
    value: "148",
    sub: "+2 this month",
    trend: "up",
    icon: Users,
    href: "/app/hr/people",
  },
  {
    title: "On Leave Today",
    value: "6",
    sub: "12 upcoming",
    trend: "flat",
    icon: CalendarCheck2,
    href: "/app/hr/leave",
  },
  {
    title: "Payroll Status",
    value: "Draft",
    sub: "Due in 4 days",
    trend: "flat",
    icon: Banknote,
    href: "/app/payroll",
  },
  {
    title: "Pending Approvals",
    value: "9",
    sub: "Leave • Bank • Docs",
    trend: "down",
    icon: ClipboardList,
    href: "/app/hr/leave/approvals",
  },
];

const QUICK: Quick[] = [
  {
    title: "Run Payroll",
    desc: "Start the monthly run",
    href: "/app/payroll/run",
    icon: Banknote,
  },
  {
    title: "Approve Leave",
    desc: "Requests awaiting you",
    href: "/app/hr/leave/approvals",
    icon: ClipboardList,
  },
  {
    title: "Add Employee",
    desc: "Create a new hire",
    href: "/app/hr/people/new",
    icon: Users,
  },
  {
    title: "Contracts",
    desc: "Generate & send",
    href: "/app/hr/documents/contract",
    icon: FileText,
  },
  {
    title: "Visas & IDs",
    desc: "Expiries & checks",
    href: "/app/hr/visas",
    icon: IdCard,
  },
  {
    title: "Announcement",
    desc: "Notify your teams",
    href: "/app/actions/announcement",
    icon: Megaphone,
  },
];

const APPROVALS = [
  {
    id: "A-1029",
    what: "Annual leave request",
    who: "Zara Malik",
    when: "Today",
    href: "/app/hr/leave/approvals/A-1029",
  },
  {
    id: "B-331",
    what: "Bank account change",
    who: "Leo Wang",
    when: "2h ago",
    href: "/app/hr/bank-changes/B-331",
  },
  {
    id: "D-87",
    what: "Contract signature",
    who: "Maya Ortega",
    when: "Yesterday",
    href: "/app/hr/documents/D-87",
  },
];

const ALERTS = [
  {
    id: "al1",
    text: "3 visas expiring within 30 days.",
    href: "/app/hr/visas",
  },
  {
    id: "al2",
    text: "Payroll cutoff in 4 days — unapproved changes found.",
    href: "/app/payroll/approve",
  },
  {
    id: "al3",
    text: "2 compliance trainings overdue.",
    href: "/app/hr/compliance",
  },
];

export default async function DashboardPage() {
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const base = locale === "ar" ? "/ar" : "/";

  const withBase = (href?: string) => {
    if (!href) return "#";
    if (href.startsWith("http")) return href;
    const path = href.startsWith("/") ? href : `/${href}`;
    return base === "/" ? path : `${base}${path}`;
  };

  return (
    // ⬅ no more content-reset here
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">

      {/* Heading */}
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          At a glance across HR &amp; Payroll.
        </p>
      </header>

      {/* Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <Link
            key={m.title}
            href={withBase(m.href)}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5 shadow-sm transition hover:shadow-md hover:border-[var(--focus)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]">
                <m.icon className="h-5 w-5" aria-hidden />
              </div>

              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border",
                  m.trend === "up" &&
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                  m.trend === "down" &&
                    "bg-red-50 text-red-700 border-red-200",
                  m.trend === "flat" &&
                    "bg-[var(--background)] text-[var(--muted)] border-[var(--border)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {m.trend === "up" && (
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                )}
                {m.trend === "down" && (
                  <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />
                )}
                {m.sub}
              </span>
            </div>

            <div className="mt-4 text-3xl font-semibold">{m.value}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">{m.title}</div>

            <ChevronRight
              className="mt-4 h-5 w-5 text-[var(--muted)] opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0"
            />
          </Link>
        ))}
      </section>

      {/* Payroll + Approvals */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">

        {/* Payroll */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]">
                <Banknote className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">This Month’s Payroll</h2>
                <p className="text-sm text-[var(--muted)]">
                  Cycle: Jan 2025 — Status:{" "}
                  <span className="font-medium">Draft</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={withBase("/app/payroll")}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm hover:bg-[var(--background-alt)]"
              >
                Open payroll
              </Link>
              <Link
                href={withBase("/app/reports")}
                className="rounded-xl bg-[var(--brand)] px-3 py-2 text-sm font-medium text-[var(--on-brand)] hover:opacity-90"
              >
                View reports
              </Link>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--muted)]">
              <span>Preparation</span>
              <span>68%</span>
            </div>

            <div className="mt-1 h-2 w-full rounded-full bg-[var(--background)]">
              <div className="h-2 w-[68%] rounded-full bg-[var(--brand)]" />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                <dt className="text-[var(--muted)]">Employees</dt>
                <dd className="mt-0.5 text-base font-semibold">148</dd>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                <dt className="text-[var(--muted)]">Forecast Cost</dt>
                <dd className="mt-0.5 text-base font-semibold">£612,450</dd>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                <dt className="text-[var(--muted)]">Cutoff</dt>
                <dd className="mt-0.5 text-base font-semibold">in 4 days</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Approvals */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Approvals</h2>
              <p className="text-sm text-[var(--muted)]">
                Items needing your decision
              </p>
            </div>
          </div>

          <ul className="mt-4 divide-y divide-[var(--border)]">
            {APPROVALS.map((a) => (
              <li key={a.id}>
                <Link
                  href={withBase(a.href)}
                  className="group flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.what}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {a.who} • {a.when}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[var(--muted)] opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 text-right">
            <Link
              href={withBase("/app/hr/leave/approvals")}
              className="text-sm text-[var(--link)] hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {QUICK.map((q) => (
            <li key={q.title} className="h-full">
              <Link
                href={withBase(q.href)}
                className="group block h-full rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5 shadow-sm transition hover:shadow-md hover:border-[var(--focus)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]">
                    <q.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold">{q.title}</div>
                    <div className="text-sm text-[var(--muted)] line-clamp-1">
                      {q.desc}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[var(--muted)] opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Alerts & Activity */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">

        {/* Alerts */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Alerts</h2>
              <p className="text-sm text-[var(--muted)]">Things to watch</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {ALERTS.map((al) => (
              <li key={al.id}>
                <Link
                  href={withBase(al.href)}
                  className="block rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm hover:bg-[var(--background-alt)]"
                >
                  {al.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--brand)] text-[var(--brand)] bg-[var(--background)]">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="text-sm text-[var(--muted)]">
                Latest changes across the system
              </p>
            </div>
          </div>

          <ul className="mt-4 divide-y divide-[var(--border)] text-sm">
            <li className="flex items-center justify-between py-3">
              <span>
                <span className="font-medium">Payroll draft</span> created for
                Jan 2025.
              </span>
              <span className="text-[var(--muted)]">10:24</span>
            </li>

            <li className="flex items-center justify-between py-3">
              <span>
                <span className="font-medium">Bank change</span> submitted by
                Leo Wang.
              </span>
              <span className="text-[var(--muted)]">09:40</span>
            </li>

            <li className="flex items-center justify-between py-3">
              <span>
                <span className="font-medium">Leave approved</span> for Zara
                Malik (2 days).
              </span>
              <span className="text-[var(--muted)]">Yesterday</span>
            </li>

            <li className="flex items-center justify-between py-3">
              <span>
                <span className="font-medium">Contract issued</span> to Maya
                Ortega.
              </span>
              <span className="text-[var(--muted)]">Mon</span>
            </li>
          </ul>
        </div>
      </section>
    </section>
  );
}
