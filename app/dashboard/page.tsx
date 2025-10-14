// app/app/dashboard/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import { getDict } from "@/lib/i18n";

import type { LucideIcon } from "lucide-react";
import {
  Users, CalendarCheck2, Banknote, ClipboardList, FileText, ShieldAlert,
  CheckCircle2, ChevronRight, ArrowUpRight, ArrowDownRight, IdCard, Megaphone
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

export default async function DashboardPage() {
  // locale + dict (server)
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);

  const METRICS: Metric[] = [
    { title: "Headcount", value: "148", sub: "+2 this month", trend: "up", icon: Users, href: "/app/hr/people" },
    { title: "On Leave Today", value: "6", sub: "12 upcoming", trend: "flat", icon: CalendarCheck2, href: "/app/hr/leave" },
    { title: "Payroll Status", value: "Draft", sub: "Due in 4 days", trend: "flat", icon: Banknote, href: "/app/payroll" },
    { title: "Pending Approvals", value: "9", sub: "Leave • Bank • Docs", trend: "down", icon: ClipboardList, href: "/app/hr/leave/approvals" },
  ];

  const QUICK: Quick[] = [
    { title: "Run Payroll", desc: "Start the monthly run", href: "/app/payroll/run", icon: Banknote },
    { title: "Approve Leave", desc: "Requests awaiting you", href: "/app/hr/leave/approvals", icon: ClipboardList },
    { title: "Add Employee", desc: "Create a new hire", href: "/app/hr/people/new", icon: Users },
    { title: "Contracts", desc: "Generate & send", href: "/app/hr/documents/contract", icon: FileText },
    { title: "Visas & IDs", desc: "Expiries & checks", href: "/app/hr/visas", icon: IdCard },
    { title: "Announcement", desc: "Notify your teams", href: "/app/actions/announcement", icon: Megaphone },
  ];

  const APPROVALS = [
    { id: "A-1029", what: "Annual leave request", who: "Zara Malik", when: "Today", href: "/app/hr/leave/approvals/A-1029" },
    { id: "B-331", what: "Bank account change", who: "Leo Wang", when: "2h ago", href: "/app/hr/bank-changes/B-331" },
    { id: "D-87", what: "Contract signature", who: "Maya Ortega", when: "Yesterday", href: "/app/hr/documents/D-87" },
  ];

  const ALERTS = [
    { id: "al1", text: "3 visas expiring within 30 days.", href: "/app/hr/visas" },
    { id: "al2", text: "Payroll cutoff in 4 days — unapproved changes found.", href: "/app/payroll/approve" },
    { id: "al3", text: "2 compliance trainings overdue.", href: "/app/hr/compliance" },
  ];

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <HeaderServer />

      <main
        id="main"
        tabIndex={-1}
        className="flex-1"
        style={{ direction: "ltr", overflowX: "clip" }}
      >
        {/* flip only the CONTENT to RTL for Arabic */}
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          <div className="mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-12 text-slate-900">
            {/* Heading */}
            <header className="mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Dashboard</h1>
              <p className="mt-1 text-slate-600">At a glance across HR &amp; Payroll.</p>
            </header>

            {/* Metrics */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {METRICS.map((m) => (
                <Link
                  key={m.title}
                  href={m.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition
                             hover:shadow-md hover:border-slate-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#335784]/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                                    bg-[#335784]/10 text-[#335784] ring-1 ring-[#335784]/20">
                      <m.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                        m.trend === "up" && "bg-green-50 text-green-700 ring-1 ring-green-200",
                        m.trend === "down" && "bg-red-50 text-red-700 ring-1 ring-red-200",
                        m.trend === "flat" && "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
                      ].filter(Boolean).join(" ")}
                    >
                      {m.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
                      {m.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />}
                      {m.sub}
                    </span>
                  </div>
                  <div className="mt-4 text-3xl font-semibold">{m.value}</div>
                  <div className="mt-1 text-sm text-slate-600">{m.title}</div>
                  <ChevronRight
                    className="mt-4 h-5 w-5 text-slate-400 opacity-0 -translate-x-1 transition
                               group-hover:opacity-100 group-hover:translate-x-0"
                    aria-hidden
                  />
                </Link>
              ))}
            </section>

            {/* Main grid */}
            <section className="mt-8 grid gap-4 lg:grid-cols-3">
              {/* Payroll card (span 2) */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784] ring-1 ring-[#335784]/20">
                      <Banknote className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">This Month’s Payroll</h2>
                      <p className="text-sm text-slate-600">Cycle: Jan 2025 — Status: <span className="font-medium">Draft</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/app/payroll" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
                      Open payroll
                    </Link>
                    <Link href="/app/reports" className="rounded-xl bg-[#335784] px-3 py-2 text-sm font-medium text-white hover:opacity-90">
                      View reports
                    </Link>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Preparation</span>
                    <span>68%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 w-[68%] rounded-full bg-[#335784]" />
                  </div>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="rounded-lg border border-slate-200 p-3">
                      <dt className="text-slate-600">Employees</dt>
                      <dd className="mt-0.5 text-base font-semibold">148</dd>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <dt className="text-slate-600">Forecast Cost</dt>
                      <dd className="mt-0.5 text-base font-semibold">£612,450</dd>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <dt className="text-slate-600">Cutoff</dt>
                      <dd className="mt-0.5 text-base font-semibold">in 4 days</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Approvals */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784] ring-1 ring-[#335784]/20">
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">Approvals</h2>
                    <p className="text-sm text-slate-600">Items needing your decision</p>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-slate-200">
                  {APPROVALS.map((a) => (
                    <li key={a.id}>
                      <Link href={a.href} className="group flex items-center justify-between gap-3 py-3 focus:outline-none">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{a.what}</p>
                          <p className="text-xs text-slate-600">{a.who} • {a.when}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 text-right">
                  <Link href="/app/hr/leave/approvals" className="text-sm text-[#335784] hover:underline">
                    View all
                  </Link>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {QUICK.map((q) => (
                  <li key={q.title}>
                    <Link
                      href={q.href}
                      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition
                                 hover:shadow-md hover:border-slate-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#335784]/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784] ring-1 ring-[#335784]/20">
                          <q.icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-base font-semibold">{q.title}</div>
                          <div className="text-sm text-slate-600 line-clamp-1">{q.desc}</div>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Alerts & Activity */}
            <section className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                    <ShieldAlert className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">Alerts</h2>
                    <p className="text-sm text-slate-600">Things to watch</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {ALERTS.map((al) => (
                    <li key={al.id}>
                      <Link
                        href={al.href}
                        className="block rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 hover:bg-amber-100"
                      >
                        {al.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784] ring-1 ring-[#335784]/20">
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                    <p className="text-sm text-slate-600">Latest changes across the system</p>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-slate-200 text-sm">
                  <li className="py-3 flex items-center justify-between">
                    <span><span className="font-medium">Payroll draft</span> created for Jan 2025.</span>
                    <span className="text-slate-500">10:24</span>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <span><span className="font-medium">Bank change</span> submitted by Leo Wang.</span>
                    <span className="text-slate-500">09:40</span>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <span><span className="font-medium">Leave approved</span> for Zara Malik (2 days).</span>
                    <span className="text-slate-500">Yesterday</span>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <span><span className="font-medium">Contract issued</span> to Maya Ortega.</span>
                    <span className="text-slate-500">Mon</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer
        footer1={dict?.site?.footer1}
        footer2={dict?.site?.footer2}
        siteTitle={dict?.site?.title}
      />
    </div>
  );
}
