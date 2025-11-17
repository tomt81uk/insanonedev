// app/admin/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HeaderBar from "@/components/HeaderBar";
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
    <div className="min-h-screen bg-white text-[#0a1a3a] flex flex-col">
      <HeaderBar />

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Admin Setup / Background
              </h1>
              <p className="text-gray-600">
                Configure reference data, workflows, and system behavior.
              </p>
            </div>

            {/* Search */}
            <div className="w-full sm:w-80">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f6fed]"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group rounded-2xl border border-gray-200 p-5 hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2f6fed]/20"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#335784]/10 text-[#335784]">
                    <c.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <div className="text-base font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-600">{c.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
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
