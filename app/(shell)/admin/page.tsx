"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Settings,
  SlidersHorizontal,
  Database,
  Layers,
  Calendar,
  ClipboardCheck,
  GitBranch,
  CheckCircle2,
  Bell,
  Plug,
  Shield,
  History,
  Upload,
  Download,
  Archive,
  KeyRound,
  Palette,
  Building2,
  FileText,
  IdCard,
  Banknote,
} from "lucide-react";

export default function AdminSetupMenuPage() {
  const [q, setQ] = useState("");

  const CARDS = useMemo(
    () => [
      {
        title: "System Settings",
        desc: "Global configuration for insanONE.",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Reference Data",
        desc: "Core lists: countries, currencies, reasons.",
        href: "/admin/reference",
        icon: Database,
      },
      {
        title: "Lookups",
        desc: "Statuses, categories, and picklists.",
        href: "/admin/lookups",
        icon: Layers,
      },
      {
        title: "Work Patterns",
        desc: "Calendars, public holidays, working days.",
        href: "/admin/work-patterns",
        icon: Calendar,
      },
      {
        title: "Grades & Bands",
        desc: "Job grades, salary bands, progression.",
        href: "/admin/grades",
        icon: ClipboardCheck,
      },
      {
        title: "Pay Codes",
        desc: "Earnings, deductions, and GL mapping.",
        href: "/admin/pay-codes",
        icon: Banknote,
      },
      {
        title: "Cost Centres",
        desc: "Departments, projects, and structure.",
        href: "/admin/cost-centres",
        icon: Building2,
      },
      {
        title: "Banks & IBAN Rules",
        desc: "Bank formats, validation, routing.",
        href: "/admin/banks",
        icon: IdCard,
      },
      {
        title: "Document Templates",
        desc: "Contracts, letters, policy files.",
        href: "/admin/document-templates",
        icon: FileText,
      },
      {
        title: "Workflow Builder",
        desc: "Steps, transitions, SLAs.",
        href: "/admin/workflows",
        icon: GitBranch,
      },
      {
        title: "Approval Rules",
        desc: "Routing by role, value, and scope.",
        href: "/admin/approvals",
        icon: CheckCircle2,
      },
      {
        title: "Notifications",
        desc: "Email/SMS templates and triggers.",
        href: "/admin/notifications",
        icon: Bell,
      },
      {
        title: "Integrations",
        desc: "Exports, webhooks, connectors.",
        href: "/admin/integrations",
        icon: Plug,
      },
      {
        title: "Security & Roles",
        desc: "Permissions, roles, and access.",
        href: "/admin/security",
        icon: Shield,
      },
      {
        title: "Audit Logs",
        desc: "Who changed what and when.",
        href: "/admin/audit",
        icon: History,
      },
      {
        title: "Data Import",
        desc: "CSV/XLSX loaders with mapping.",
        href: "/admin/import",
        icon: Upload,
      },
      {
        title: "Data Export",
        desc: "On-demand extracts and schedules.",
        href: "/admin/export",
        icon: Download,
      },
      {
        title: "Backups",
        desc: "Snapshots and retention policies.",
        href: "/admin/backups",
        icon: Archive,
      },
      {
        title: "API Keys",
        desc: "Programmatic access tokens.",
        href: "/admin/api-keys",
        icon: KeyRound,
      },
      {
        title: "Branding & Themes",
        desc: "Logos, colors, typography.",
        href: "/admin/branding",
        icon: Palette,
      },
      {
        title: "Advanced",
        desc: "Feature flags and fine-tuning.",
        href: "/admin/advanced",
        icon: SlidersHorizontal,
      },
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
    <section className="mx-auto max-w-6xl px-6 py-12">

      {/* Heading + Search */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Admin Setup / Background
          </h1>
          <p className="text-[var(--muted)]">
            Configure reference data, workflows, and system behavior.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <label
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
            htmlFor="admin-search"
          >
            Search
          </label>

          <input
            id="admin-search"
            type="search"
            placeholder="Search setup…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="
              w-full rounded-xl px-4 py-3
              bg-[var(--background)] text-[var(--foreground)]
              border border-[var(--border)]
              placeholder-[var(--muted)]
              focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
            "
          />
        </div>
      </div>

      {/* Cards grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {filtered.map((c) => (
          <Link
            key={c.title}
            href={c.href}
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
                  border border-[var(--brand)] text-[var(--brand)]
                  bg-[var(--background)]
                  transition group-hover:border-[var(--brand-strong)]
                "
              >
                <c.icon className="h-5 w-5" aria-hidden />
              </span>

              <div>
                <div className="text-base font-semibold">{c.title}</div>
                <div className="text-sm text-[var(--muted)]">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No footer tagline — real footer handled by RootLayout */}
    </section>
  );
}
