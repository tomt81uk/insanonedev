// app/landing/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import InsanOneWordmark from "@/components/InsanOneWordmark";
import { getDict } from "@/lib/i18n";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  BarChart3,
  Settings,
  LayoutDashboard,
  UserCheck,
  Users,
  Banknote,
  ClipboardCheck,
  LineChart,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Landing | insanONE",
  description: "Welcome to insanONE",
  alternates: { canonical: "/landing" },
};

// Placeholder RAG values
const rag = {
  actions: { red: 3, amber: 5, green: 12 },
  workflows: { red: 1, amber: 2, green: 6 },
  processes: { red: 0, amber: 3, green: 4 },
};

const sum = (key: "red" | "amber" | "green") =>
  rag.actions[key] + rag.workflows[key] + rag.processes[key];

export default async function LandingPage() {
  const env = process.env.NEXT_PUBLIC_ENV;

  // Locale logic identical to /page.tsx
  const hdrs = await headers();
  const hdrLocale = hdrs.get("x-locale");
  const locale: "en" | "ar" = hdrLocale === "ar" ? "ar" : "en";
  const dict: any = getDict(locale);
  const base = locale === "ar" ? "/ar" : "/";

  const withBase = (href?: string) => {
    if (!href) return "#";
    if (href.startsWith("http")) return href;
    const path = href.startsWith("/") ? href : `/${href}`;
    return base === "/" ? path : `${base}${path}`;
  };

  return (
    <div
      className="min-h-screen bg-white text-[#0a1a3a] flex flex-col"
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      {/* Non-prod banner */}
      {env && env !== "prod" && (
        <div className="text-center text-xs py-1 bg-black/5">
          {env.toUpperCase()} ENVIRONMENT
        </div>
      )}

      {/* No HeaderBar here */}

      <main className="flex-1">
        <section className="px-4 sm:px-6 py-14 sm:py-20 content-reset">
          <div className="mx-auto max-w-5xl">

            {/* Brand lockup – aligned with /page.tsx */}
            <div className="text-center space-y-5">
              <Link
                href={base}
                aria-label={
                  dict?.site?.site
                    ? `${dict.site.site} Home`
                    : "insanONE Home"
                }
                className="inline-flex items-center gap-3 text-5xl sm:text-6xl font-semibold leading-none tracking-tight no-underline"
              >
                <InsanOneWordmark />
              </Link>
              <p className="text-xl text-gray-600">Welcome</p>
              <p className="text-gray-600">
                One Platform. One Workforce. One Future.
              </p>
            </div>

            {/* RAG Summary */}
            <div className="mt-10">
              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-base font-semibold">Attention</h2>
                  <div className="text-sm text-gray-600">
                    Items requiring review or action
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {/* RED */}
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="text-sm font-semibold">
                        Overdue / Blocking
                      </div>
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-2 text-xs font-medium text-red-700">
                        {sum("red")}
                      </span>
                    </div>

                    <ul className="mt-3 text-sm text-gray-700 space-y-2">
                      <li className="flex items-center justify-between">
                        <span>Actions</span>
                        <Link
                          href={withBase("/actions?status=red")}
                          className="underline"
                        >
                          {rag.actions.red}
                        </Link>
                      </li>

                      <li className="flex items-center justify-between">
                        <span>Workflows</span>
                        <Link
                          href={withBase("/workflows?status=red")}
                          className="underline"
                        >
                          {rag.workflows.red}
                        </Link>
                      </li>

                      <li className="flex items-center justify-between">
                        <span>Processes</span>
                        <Link
                          href={withBase("/processes?status=red")}
                          className="underline"
                        >
                          {rag.processes.red}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* AMBER */}
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div className="text-sm font-semibold">
                        Due Soon / In Progress
                      </div>
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-medium text-amber-800">
                        {sum("amber")}
                      </span>
                    </div>

                    <ul className="mt-3 text-sm text-gray-700 space-y-2">
                      <li className="flex items-center justify-between">
                        <span>Actions</span>
                        <Link
                          href={withBase("/actions?status=amber")}
                          className="underline"
                        >
                          {rag.actions.amber}
                        </Link>
                      </li>

                      <li className="flex items-center justify-between">
                        <span>Workflows</span>
                        <Link
                          href={withBase("/workflows?status=amber")}
                          className="underline"
                        >
                          {rag.workflows.amber}
                        </Link>
                      </li>

                      <li className="flex items-center justify-between">
                        <span>Processes</span>
                        <Link
                          href={withBase("/processes?status=amber")}
                          className="underline"
                        >
                          {rag.processes.amber}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* GREEN */}
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div className="text-sm font-semibold">All Good</div>
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-100 px-2 text-xs font-medium text-emerald-800">
                        {sum("green")}
                      </span>
                    </div>

                    <ul className="mt-3 text-sm text-gray-700 space-y-2">
                      <li className="flex items-center justify-between">
                        <span>Actions</span>
                        <Link
                          href={withBase("/actions?status=green")}
                          className="underline"
                        >
                          {rag.actions.green}
                        </Link>
                      </li>

                      <li className="flex items-center justify-between">
                        <span>Workflows</span>
                        <Link
                          href={withBase("/workflows?status=green")}
                          className="underline"
                        >
                          {rag.workflows.green}
                        </Link>
                      </li>

                      <li className="flex items-center justify-between">
                        <span>Processes</span>
                        <Link
                          href={withBase("/processes?status=green")}
                          className="underline"
                        >
                          {rag.processes.green}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <Link
                href={withBase("/dashboard")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <div className="text-base font-semibold">Dashboard</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Your overview of KPIs and recent activity.
                </div>
              </Link>

              <Link
                href={withBase("/myhr")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  <div className="text-base font-semibold">MyHR</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Request leave, payslips, approvals, personal details.
                </div>
              </Link>

              <Link
                href={withBase("/hr")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <div className="text-base font-semibold">HR</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  People, positions, leave & compliance.
                </div>
              </Link>

              <Link
                href={withBase("/payroll")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  <div className="text-base font-semibold">Payroll</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Run, review and export payroll & WPS.
                </div>
              </Link>

              <Link
                href={withBase("/reports")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <div className="text-base font-semibold">Reporting</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Access reports & exports.
                </div>
              </Link>

              <Link
                href={withBase("/powerbi")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  <div className="text-base font-semibold">
                    Analytics (Power BI)
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Interactive dashboards for headcount, absence, pay.
                </div>
              </Link>

              <Link
                href={withBase("/actions")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  <div className="text-base font-semibold">Actions</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Approvals, tasks, and to-dos.
                </div>
              </Link>

              <Link
                href={withBase("/admin")}
                className="group rounded-2xl border border-gray-200 p-6 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <div className="text-base font-semibold">
                    Admin Setup / Background
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Reference data, lookups, workflows & settings.
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-14 text-center">
              <p className="text-sm font-medium">
                Human. Innovation. Simplicity.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                © 2025 insanONE. No unauthorised access.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
