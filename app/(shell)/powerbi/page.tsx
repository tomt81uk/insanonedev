// app/dashboard/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Banknote,
  BarChart3,
  Percent,
  Filter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ---------- Helpers ----------
const currency = (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  });

const pct = (n: number) => `${n.toFixed(1)}%`;

// Generate the last 12 months labels like "Mar 2025"
function last12Months(): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = d.toLocaleString(undefined, {
      month: "short",
      year: "numeric",
    });
    out.push({ key, label });
  }
  return out;
}

// ---------- Fake model ----------
type Dept = "Engineering" | "Operations" | "Sales" | "Finance" | "HR";
const ALL_DEPTS: Dept[] = [
  "Engineering",
  "Operations",
  "Sales",
  "Finance",
  "HR",
];

// Seed “realistic-ish” metrics for the last 12 months
function makeData() {
  const months = last12Months();
  const baseHeadcount = 120;
  const headcount = months.map((_, i) =>
    Math.round(baseHeadcount + i * 2 - (i % 3 === 0 ? 3 : 0))
  );
  const pay = months.map(
    (_, i) =>
      baseHeadcount * 10000 +
      i * 150000 +
      (i % 4 ? 80000 : -40000)
  );
  const turnover = months.map(
    (_, i) =>
      1.2 + ((i % 5) - 2) * 0.25 + (i % 3 === 0 ? 0.4 : 0)
  ); // %
  const absence = months.map(
    (_, i) =>
      2.5 + ((i % 4) - 2) * 0.4 + (i % 6 === 0 ? 0.8 : 0)
  ); // %
  // department split of headcount (sums ~ 1)
  const split: Record<Dept, number> = {
    Engineering: 0.34,
    Operations: 0.28,
    Sales: 0.16,
    Finance: 0.12,
    HR: 0.1,
  };

  return { months, headcount, pay, turnover, absence, split };
}

export default function DashboardBI() {
  const { months, headcount, pay, turnover, absence, split } = useMemo(
    makeData,
    []
  );
  const [yearFilter, setYearFilter] = useState<"All" | string>("All");
  const [deptFilter, setDeptFilter] = useState<Dept[] | "All">("All");

  // Filter by year (from month labels) — simple demo filter
  const byYearIdx = months
    .map((m, idx) => ({ idx, year: m.label.split(" ")[1] }))
    .filter((m) => yearFilter === "All" || m.year === yearFilter)
    .map((m) => m.idx);

  const fMonths = byYearIdx.map((i) => months[i]);
  const fHeadcount = byYearIdx.map((i) => headcount[i]);
  const fPay = byYearIdx.map((i) => pay[i]);
  const fTurnover = byYearIdx.map((i) => turnover[i]);
  const fAbsence = byYearIdx.map((i) => absence[i]);

  const currentIdx = fMonths.length - 1;
  const prevIdx = Math.max(0, currentIdx - 1);

  // KPI current values
  const kpi = {
    headcount: fHeadcount[currentIdx],
    turnover: Math.max(0, fTurnover[currentIdx]),
    absence: Math.max(0, fAbsence[currentIdx]),
    pay: Math.max(0, fPay[currentIdx]),
    deltas: {
      headcount: fHeadcount[currentIdx] - fHeadcount[prevIdx],
      turnover: fTurnover[currentIdx] - fTurnover[prevIdx],
      absence: fAbsence[currentIdx] - fAbsence[prevIdx],
      pay: fPay[currentIdx] - fPay[prevIdx],
    },
  };

  // Headcount by dept (affected by dept filter)
  const hcByDeptAll = (val: number) =>
    ALL_DEPTS.map((d) => ({
      dept: d,
      value: Math.round(val * split[d]),
    }));
  const hcCurrentDepts = hcByDeptAll(kpi.headcount);
  const hcByDept =
    deptFilter === "All"
      ? hcCurrentDepts
      : hcCurrentDepts.filter((d) => deptFilter.includes(d.dept));

  const yearsAvailable = Array.from(
    new Set(months.map((m) => m.label.split(" ")[1]))
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-10">
      {/* Title row */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Workforce Analytics
          </h1>
          <p className="text-[var(--muted)]">
            Power BI–style view of key people metrics.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-2">
          <Link
            href="/reporting"
            className="
              rounded-lg border border-[var(--border)]
              bg-[var(--background)] px-3 py-2 text-sm
              hover:bg-[var(--background-alt)]
            "
          >
            Go to Reporting
          </Link>
          <Link
            href="/admin"
            className="
              rounded-lg border border-[var(--border)]
              bg-[var(--background)] px-3 py-2 text-sm
              hover:bg-[var(--background-alt)]
            "
          >
            Admin Setup
          </Link>
        </div>
      </div>

      {/* Slicers */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div
          className="
            inline-flex items-center gap-2 rounded-xl border border-[var(--border)]
            bg-[var(--background-alt)] px-3 py-2
          "
        >
          <Filter className="h-4 w-4 text-[var(--muted)]" />
          <span className="text-sm font-medium">Year</span>
          <div className="relative">
            <select
              className="bg-transparent text-sm focus:outline-none"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as any)}
            >
              <option value="All">All</option>
              {yearsAvailable.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="
            inline-flex items-center gap-2 rounded-xl border border-[var(--border)]
            bg-[var(--background-alt)] px-3 py-2
          "
        >
          <span className="text-sm font-medium">Departments</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDeptFilter("All")}
              className={[
                "rounded-full border px-2 py-0.5 text-xs",
                deptFilter === "All"
                  ? "border-[var(--brand)] text-[var(--brand)] bg-[var(--brand)]/10"
                  : "border-[var(--border)]",
              ].join(" ")}
            >
              All
            </button>
            {ALL_DEPTS.map((d) => {
              const active =
                deptFilter !== "All" && deptFilter.includes(d);
              return (
                <button
                  type="button"
                  key={d}
                  className={[
                    "rounded-full border px-2 py-0.5 text-xs",
                    active
                      ? "border-[var(--brand)] text-[var(--brand)] bg-[var(--brand)]/10"
                      : "border-[var(--border)]",
                  ].join(" ")}
                  onClick={() =>
                    setDeptFilter((prev) => {
                      if (prev === "All") return [d];
                      const set = new Set(prev);
                      if (set.has(d)) set.delete(d);
                      else set.add(d);
                      return Array.from(set) as Dept[];
                    })
                  }
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPI
          label="Headcount"
          value={kpi.headcount.toString()}
          delta={kpi.deltas.headcount}
          icon={Users}
          hint={fMonths[currentIdx]?.label}
        />
        <KPI
          label="Turnover (monthly)"
          value={pct(kpi.turnover)}
          delta={kpi.deltas.turnover}
          icon={Percent}
          hint={fMonths[currentIdx]?.label}
        />
        <KPI
          label="Absence (monthly)"
          value={pct(kpi.absence)}
          delta={kpi.deltas.absence}
          icon={Calendar}
          hint={fMonths[currentIdx]?.label}
        />
        <KPI
          label="Monthly Pay Cost"
          value={currency(kpi.pay)}
          delta={kpi.deltas.pay}
          icon={Banknote}
          hint={fMonths[currentIdx]?.label}
        />
      </section>

      {/* Charts */}
      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        {/* Line trends */}
        <Card
          title="Headcount & Pay (last 12 months)"
          subtitle="Line trend"
        >
          <LineChart
            labels={fMonths.map((m) => m.label)}
            series={[
              { name: "Headcount", data: fHeadcount, unit: "" },
              { name: "Pay (AED)", data: fPay, unit: "" },
            ]}
          />
        </Card>

        {/* Bars: turnover vs absence */}
        <Card title="Turnover vs Absence" subtitle="Monthly bars">
          <BarsTwo
            labels={fMonths.map((m) => m.label)}
            a={{ name: "Turnover %", data: fTurnover }}
            b={{ name: "Absence %", data: fAbsence }}
          />
        </Card>

        {/* Donut: headcount by dept */}
        <Card
          title="Headcount by Department"
          subtitle="Current split"
        >
          <Donut
            data={hcByDept.map((d) => ({
              label: d.dept,
              value: d.value,
            }))}
            totalLabel={`${kpi.headcount}`}
            footnote="Filtered by Dept slicer"
          />
        </Card>
      </section>

      {/* Recent changes table */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent workforce changes
          </h2>
          <Link
            href="/actions"
            className="text-sm text-[var(--brand)] hover:underline"
          >
            Open Actions
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-alt)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--background)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">When</th>
                <th className="px-4 py-2 text-left font-medium">
                  Employee
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Change
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Department
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                {
                  when: "Today 09:14",
                  emp: "A. Rahman",
                  change: "New hire (Software Eng.)",
                  dept: "Engineering",
                  status: "Completed",
                },
                {
                  when: "Yesterday 16:02",
                  emp: "L. Martins",
                  change: "Salary update",
                  dept: "Finance",
                  status: "Approved",
                },
                {
                  when: "Mon 12:21",
                  emp: "S. Khan",
                  change: "Termination",
                  dept: "Operations",
                  status: "Pending",
                },
                {
                  when: "Sun 10:05",
                  emp: "J. Patel",
                  change: "Transfer to Sales",
                  dept: "Sales",
                  status: "Completed",
                },
              ].map((r, i) => (
                <tr key={i} className="bg-[var(--background-alt)]">
                  <td className="px-4 py-2">{r.when}</td>
                  <td className="px-4 py-2">{r.emp}</td>
                  <td className="px-4 py-2">{r.change}</td>
                  <td className="px-4 py-2">{r.dept}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full inline-block",
                          r.status === "Completed"
                            ? "bg-emerald-500"
                            : r.status === "Approved"
                            ? "bg-amber-500"
                            : "bg-rose-500",
                        ].join(" ")}
                      />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

// ---------- UI pieces ----------
function Card(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5">
      <div className="mb-4">
        <div className="text-base font-semibold">{props.title}</div>
        {props.subtitle && (
          <div className="text-xs text-[var(--muted)]">
            {props.subtitle}
          </div>
        )}
      </div>
      {props.children}
    </section>
  );
}

function KPI({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  hint?: string;
}) {
  const up = delta >= 0;
  const isPercentish =
    label.toLowerCase().includes("turnover") ||
    label.toLowerCase().includes("absence") ||
    label.includes("%");
  const isPay = label.toLowerCase().includes("pay");

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--muted)]">{label}</div>
        <span
          className="
            inline-flex h-9 w-9 items-center justify-center rounded-lg
            bg-[var(--brand)]/10 text-[var(--brand)]
          "
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="mt-1 flex items-center gap-1 text-xs">
        {up ? (
          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-rose-600" />
        )}
        <span className={up ? "text-emerald-700" : "text-rose-700"}>
          {isPercentish
            ? `${delta.toFixed(1)} pts`
            : isPay
            ? currency(delta)
            : `${delta}`}
        </span>
        {hint && (
          <span className="text-[var(--muted)]">
            vs prev • {hint}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- Charts (pure SVG, responsive) ----------
function LineChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; data: number[]; unit?: string }[];
}) {
  // Normalize each series to 0..1 and plot; separate scales per series for clarity
  const W = 800,
    H = 220,
    PADL = 30,
    PADR = 10,
    PADT = 10,
    PADB = 24;
  const X = (i: number) =>
    PADL +
    (i * (W - PADL - PADR)) / Math.max(1, labels.length - 1);

  const paths = series.map((s) => {
    const min = Math.min(...s.data);
    const max = Math.max(...s.data);
    const norm = (v: number) =>
      max === min ? 0.5 : (v - min) / (max - min);
    const Y = (v: number) =>
      PADT + (1 - norm(v)) * (H - PADT - PADB);
    const d = s.data
      .map((v, i) => `${i ? "L" : "M"} ${X(i)} ${Y(v)}`)
      .join(" ");
    return { name: s.name, d };
  });

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-56"
        role="img"
        aria-label="Line trends"
      >
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={PADL}
            x2={W - PADR}
            y1={PADT + p * (H - PADT - PADB)}
            y2={PADT + p * (H - PADT - PADB)}
            className="stroke-[var(--border)]"
            strokeWidth="1"
          />
        ))}
        {/* Lines */}
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={i ? "var(--brand-strong)" : "var(--brand)"}
            strokeWidth={2.5}
          />
        ))}
        {/* X labels (sparse) */}
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 6) === 0 ? (
            <text
              key={i}
              x={X(i)}
              y={H - 6}
              textAnchor="middle"
              className="fill-[var(--muted)] text-[10px]"
            >
              {l}
            </text>
          ) : null
        )}
      </svg>
      <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted)]">
        <LegendDot color="var(--brand)" /> {series[0]?.name}
        <LegendDot color="var(--brand-strong)" /> {series[1]?.name}
      </div>
    </div>
  );
}

function BarsTwo({
  labels,
  a,
  b,
}: {
  labels: string[];
  a: { name: string; data: number[] };
  b: { name: string; data: number[] };
}) {
  const W = 800,
    H = 220,
    PADL = 30,
    PADR = 10,
    PADT = 10,
    PADB = 24;
  const bw = 10,
    gap = 6;
  const groups = labels.length;
  const X = (i: number) =>
    PADL +
    (i + 0.5) * ((W - PADL - PADR) / groups);
  const all = [...a.data, ...b.data];
  const max = Math.max(1, Math.max(...all));
  const Y = (v: number) =>
    PADT + (1 - v / max) * (H - PADT - PADB);

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-56"
        role="img"
        aria-label="Bar comparison"
      >
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={PADL}
            x2={W - PADR}
            y1={PADT + p * (H - PADT - PADB)}
            y2={PADT + p * (H - PADT - PADB)}
            className="stroke-[var(--border)]"
            strokeWidth="1"
          />
        ))}
        {/* Bars */}
        {labels.map((_, i) => (
          <g key={i}>
            <rect
              x={X(i) - bw - gap / 2}
              y={Y(a.data[i])}
              width={bw}
              height={H - PADB - Y(a.data[i])}
              fill="var(--brand)"
              rx={2}
            />
            <rect
              x={X(i) + gap / 2}
              y={Y(b.data[i])}
              width={bw}
              height={H - PADB - Y(b.data[i])}
              fill="var(--brand-strong)"
              rx={2}
            />
          </g>
        ))}
        {/* X labels (sparse) */}
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 6) === 0 ? (
            <text
              key={i}
              x={X(i)}
              y={H - 6}
              textAnchor="middle"
              className="fill-[var(--muted)] text-[10px]"
            >
              {l}
            </text>
          ) : null
        )}
      </svg>
      <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted)]">
        <LegendDot color="var(--brand)" /> {a.name}
        <LegendDot color="var(--brand-strong)" /> {b.name}
      </div>
    </div>
  );
}

function Donut({
  data,
  totalLabel,
  footnote,
}: {
  data: { label: string; value: number }[];
  totalLabel?: string;
  footnote?: string;
}) {
  const R = 70;
  const C = 2 * Math.PI * R;
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const colors = [
    "var(--brand)",
    "var(--brand-strong)",
    "#7a94bf",
    "#9fb3d7",
    "#c7d6ee",
  ];

  return (
    <div className="flex items-center gap-6">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40"
        role="img"
        aria-label="Headcount by department"
      >
        <g transform="translate(90, 90)">
          <circle
            r={R}
            fill="none"
            stroke="var(--border)"
            strokeWidth={18}
          />
          {data.map((d, i) => {
            const frac = total === 0 ? 0 : d.value / total;
            const len = frac * C;
            const dash = `${len} ${C - len}`;
            const rotation = (acc / total) * 360 - 90;
            acc += d.value;
            return (
              <circle
                key={d.label}
                r={R}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={18}
                strokeDasharray={dash}
                transform={`rotate(${rotation})`}
                strokeLinecap="butt"
              />
            );
          })}
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--foreground)] text-[18px] font-semibold"
          >
            {totalLabel ?? total}
          </text>
        </g>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="min-w-28">{d.label}</span>
            <span className="tabular-nums text-[var(--foreground)]">
              {d.value}
            </span>
          </div>
        ))}
        {footnote && (
          <div className="text-xs text-[var(--muted)]">
            {footnote}
          </div>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-sm"
      style={{ background: color }}
    />
  );
}
