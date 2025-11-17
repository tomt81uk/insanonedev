// app/myhr/page.tsx

/** -------------------------------
 *  Types (keep small & practical)
 *  ------------------------------- */
type Employee = {
  employee_id: number;
  employee_no: string;
  name: string;
  gender?: string;
  nationality?: string;
  legal_entity: string;
  department: string;
  position_title: string;
  grade?: string;
  status: "active" | "terminated" | "on_leave";
  hire_date: string; // ISO
  original_hire_date?: string;
  end_date?: string | null; // ISO or null
  fte: number; // 1.0, 0.8, etc
};

type LeaveRequest = {
  id: number;
  employee_id: number;
  type: "annual" | "sick" | "unpaid";
  start_date: string; // ISO
  end_date: string; // ISO
  units_hours?: number;
  approval_status: "pending" | "approved" | "rejected";
};

type Payslip = {
  id: number;
  employee_id: number;
  period: string; // e.g., "2025-08"
  gross: number;
  net: number;
  currency: "AED";
  pay_date: string; // ISO
};

type Workflow = {
  id: number;
  kind:
    | "bank_change"
    | "address_change"
    | "leave_request"
    | "onboarding"
    | "rtw_check";
  employee_id: number;
  status:
    | "pending_hr"
    | "pending_manager"
    | "pending_employee"
    | "approved"
    | "rejected";
  created_at: string; // ISO
};

/** -----------------------------------------
 *  Mock “server” data aligned to your schema
 *  (You can later replace getData() with an API)
 *  ----------------------------------------- */
async function getData() {
  // Employees (subset of fields inspired by hr_schema_full.sql / data dictionary)
  const employees: Employee[] = [
    {
      employee_id: 101,
      employee_no: "E000101",
      name: "Aisha Al Mansoori",
      gender: "F",
      nationality: "AE",
      legal_entity: "insanONE LLC",
      department: "Engineering",
      position_title: "Senior Software Engineer",
      grade: "G4",
      status: "active",
      hire_date: "2024-11-18",
      original_hire_date: "2024-11-18",
      end_date: null,
      fte: 1.0,
    },
    {
      employee_id: 102,
      employee_no: "E000102",
      name: "Omar Khan",
      gender: "M",
      nationality: "PK",
      legal_entity: "insanONE LLC",
      department: "Engineering",
      position_title: "Software Engineer",
      grade: "G3",
      status: "active",
      hire_date: "2025-08-05",
      original_hire_date: "2025-08-05",
      end_date: null,
      fte: 1.0,
    },
    {
      employee_id: 103,
      employee_no: "E000103",
      name: "Sara Ahmed",
      gender: "F",
      nationality: "EG",
      legal_entity: "insanONE LLC",
      department: "People Ops",
      position_title: "HR Generalist",
      grade: "G3",
      status: "active",
      hire_date: "2025-07-15",
      original_hire_date: "2025-07-15",
      end_date: null,
      fte: 1.0,
    },
    {
      employee_id: 104,
      employee_no: "E000104",
      name: "James Taylor",
      gender: "M",
      nationality: "GB",
      legal_entity: "insanONE LLC",
      department: "Engineering",
      position_title: "DevOps Engineer",
      grade: "G4",
      status: "on_leave",
      hire_date: "2023-09-20",
      original_hire_date: "2023-09-20",
      end_date: null,
      fte: 1.0,
    },
    {
      employee_id: 105,
      employee_no: "E000105",
      name: "Fatima Al Suwaidi",
      gender: "F",
      nationality: "AE",
      legal_entity: "insanONE LLC",
      department: "Finance",
      position_title: "Finance Officer",
      grade: "G3",
      status: "terminated",
      hire_date: "2024-03-01",
      original_hire_date: "2024-03-01",
      end_date: "2025-08-28",
      fte: 1.0,
    },
  ];

  // Leave requests (hour-based annual leave aligns with UAE approach)
  const leave_requests: LeaveRequest[] = [
    {
      id: 9001,
      employee_id: 104,
      type: "annual",
      start_date: "2025-09-08",
      end_date: "2025-09-19",
      units_hours: 80,
      approval_status: "approved",
    },
    {
      id: 9002,
      employee_id: 102,
      type: "annual",
      start_date: "2025-09-23",
      end_date: "2025-09-24",
      units_hours: 16,
      approval_status: "pending",
    },
    {
      id: 9003,
      employee_id: 101,
      type: "sick",
      start_date: "2025-09-02",
      end_date: "2025-09-03",
      units_hours: 16,
      approval_status: "approved",
    },
  ];

  // Payslips (latest period + recent months)
  const payslips: Payslip[] = [
    {
      id: 7001,
      employee_id: 101,
      period: "2025-08",
      gross: 42000,
      net: 40000,
      currency: "AED",
      pay_date: "2025-08-29",
    },
    {
      id: 7002,
      employee_id: 102,
      period: "2025-08",
      gross: 26000,
      net: 24500,
      currency: "AED",
      pay_date: "2025-08-29",
    },
    {
      id: 7003,
      employee_id: 103,
      period: "2025-08",
      gross: 22000,
      net: 21000,
      currency: "AED",
      pay_date: "2025-08-29",
    },
    {
      id: 7004,
      employee_id: 104,
      period: "2025-08",
      gross: 32000,
      net: 30500,
      currency: "AED",
      pay_date: "2025-08-29",
    },
    // A prior month to show trend
    {
      id: 7101,
      employee_id: 101,
      period: "2025-07",
      gross: 42000,
      net: 40000,
      currency: "AED",
      pay_date: "2025-07-31",
    },
    {
      id: 7102,
      employee_id: 102,
      period: "2025-07",
      gross: 26000,
      net: 24500,
      currency: "AED",
      pay_date: "2025-07-31",
    },
    {
      id: 7103,
      employee_id: 103,
      period: "2025-07",
      gross: 22000,
      net: 21000,
      currency: "AED",
      pay_date: "2025-07-31",
    },
    {
      id: 7104,
      employee_id: 104,
      period: "2025-07",
      gross: 32000,
      net: 30500,
      currency: "AED",
      pay_date: "2025-07-31",
    },
  ];

  // Governance workflows (e.g., bank change approvals)
  const workflows: Workflow[] = [
    {
      id: 5001,
      kind: "bank_change",
      employee_id: 101,
      status: "pending_hr",
      created_at: "2025-09-10T10:00:00Z",
    },
    {
      id: 5002,
      kind: "address_change",
      employee_id: 103,
      status: "pending_manager",
      created_at: "2025-09-09T09:40:00Z",
    },
    {
      id: 5003,
      kind: "leave_request",
      employee_id: 102,
      status: "pending_manager",
      created_at: "2025-09-07T08:10:00Z",
    },
    {
      id: 5004,
      kind: "rtw_check",
      employee_id: 104,
      status: "approved",
      created_at: "2025-08-30T12:00:00Z",
    },
    {
      id: 5005,
      kind: "onboarding",
      employee_id: 102,
      status: "pending_employee",
      created_at: "2025-08-05T09:00:00Z",
    },
  ];

  return { employees, leave_requests, payslips, workflows };
}

/** -------------------------------
 *  Helpers
 *  ------------------------------- */
function yyyymm(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function withinMonth(dateISO: string, y: number, m: number) {
  const d = new Date(dateISO + (dateISO.length === 10 ? "T00:00:00Z" : ""));
  return d.getUTCFullYear() === y && d.getUTCMonth() === m;
}

function sum<T>(items: T[], pick: (x: T) => number) {
  return items.reduce((acc, x) => acc + (pick(x) || 0), 0);
}

/** -------------------------------
 *  Server component page
 *  ------------------------------- */
export const metadata = {
  title: "HR | insanONE",
  description: "HR dashboard with KPIs, leave, payslips, and workflows",
  alternates: { canonical: "/myhr" },
};

export default async function HRPage() {
  const { employees, leave_requests, payslips, workflows } = await getData();

  // Time context (use UTC; your prod can localise per-tenant)
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const thisPeriod = yyyymm(now);

  // Core sets
  const activeEmployees = employees.filter(
    (e) => e.status === "active" || e.status === "on_leave"
  );
  const headcount = activeEmployees.length;
  const fteTotal = sum(activeEmployees, (e) => e.fte);

  // Starters/leavers in current month
  const startersThisMonth = employees.filter((e) =>
    withinMonth(e.hire_date, y, m)
  );
  const leaversThisMonth = employees.filter(
    (e) => e.end_date && withinMonth(e.end_date, y, m)
  );

  // Absence approximation (count of approved leave days overlapping this month)
  const approvedLeave = leave_requests.filter(
    (lr) => lr.approval_status === "approved"
  );
  const absenceRecordsThisMonth = approvedLeave.filter((lr) => {
    const s = new Date(lr.start_date + "T00:00:00Z");
    const e = new Date(lr.end_date + "T23:59:59Z");
    return (
      s.getUTCFullYear() <= y &&
      e.getUTCFullYear() >= y &&
      s.getUTCMonth() <= m &&
      e.getUTCMonth() >= m
    );
  });
  const absenceRatePct =
    headcount > 0
      ? Math.min(100, (absenceRecordsThisMonth.length / headcount) * 100)
      : 0;

  // Payroll cost: sum latest period’s net by employee (for the latest month found)
  const periods = Array.from(new Set(payslips.map((p) => p.period)))
    .sort()
    .reverse();
  const latestPeriod = periods[0] || thisPeriod;
  const payslipsLatest = payslips.filter((p) => p.period === latestPeriod);
  const monthlyNetAED = sum(payslipsLatest, (p) => p.net);

  // Workflows — derive RAG
  const urgent = workflows.filter((w) => ["pending_hr"].includes(w.status)); // red
  const inProgress = workflows.filter((w) =>
    ["pending_manager", "pending_employee"].includes(w.status)
  ); // amber
  const good = workflows.filter((w) => w.status === "approved"); // green

  // Upcoming leave (next 14 days)
  const in14 = new Date(now.getTime() + 14 * 24 * 3600 * 1000);
  const upcomingLeave = leave_requests
    .filter(
      (lr) =>
        new Date(lr.start_date + "T00:00:00Z") >= now &&
        new Date(lr.start_date + "T00:00:00Z") <= in14
    )
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 6);

  // Helper lookups
  const byId = new Map(activeEmployees.map((e) => [e.employee_id, e]));
  const nameOf = (id: number) => byId.get(id)?.name ?? `#${id}`;

  return (
    <section className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      {/* Header + quick actions */}
      <header className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">HR Dashboard</h1>
          <p className="mt-1 text-[var(--muted)]">
            KPIs for {thisPeriod} · {headcount} active workers ·{" "}
            {fteTotal.toFixed(1)} FTE
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/reporting"
            className="
              rounded-xl border border-[var(--border)]
              bg-[var(--background)] px-4 py-2 text-sm
              hover:bg-[var(--background-alt)]
            "
          >
            Open Reporting
          </a>
          <a
            href="/admin"
            className="
              rounded-xl border border-[var(--border)]
              bg-[var(--background)] px-4 py-2 text-sm
              hover:bg-[var(--background-alt)]
            "
          >
            Admin Setup
          </a>
        </div>
      </header>

      {/* KPI cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Headcount"
            value={headcount.toString()}
            hint={`${fteTotal.toFixed(1)} FTE`}
          />
          <KpiCard
            label="Starters (month)"
            value={startersThisMonth.length.toString()}
            hint={
              startersThisMonth
                .map((s) => s.name)
                .slice(0, 2)
                .join(", ") || "—"
            }
          />
          <KpiCard
            label="Leavers (month)"
            value={leaversThisMonth.length.toString()}
            hint={
              leaversThisMonth
                .map((s) => s.name)
                .slice(0, 2)
                .join(", ") || "—"
            }
          />
          <KpiCard
            label="Monthly Net Pay"
            value={`AED ${monthlyNetAED.toLocaleString()}`}
            hint={`Period ${latestPeriod}`}
          />
        </div>
      </section>

      {/* RAG Overview */}
      <section className="mt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <RagCard
            title="Requires Immediate Attention"
            dotClass="bg-red-500"
            items={urgent.map((w) => ({
              label: labelWorkflow(w),
              href: "/approvals",
              action: "Review",
            }))}
            emptyText="No urgent items"
          />
          <RagCard
            title="Workflows In Progress"
            dotClass="bg-amber-400"
            items={inProgress.map((w) => ({
              label: labelWorkflow(w),
              href: "/workflows",
              action: "Track",
            }))}
            emptyText="No items in progress"
          />
          <RagCard
            title="All Good"
            dotClass="bg-green-500"
            items={good.map((w) => ({
              label: labelWorkflow(w),
              href: "/workflows",
              action: "Open",
            }))}
            emptyText="No recently approved items"
          />
        </div>
      </section>

      {/* Tables: Upcoming Leave | Latest Payslips | Open Workflows */}
      <section className="mt-8 pb-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <TableCard title="Upcoming Leave (14 days)">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--muted)]">
                <tr>
                  <th className="py-2">Employee</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Start</th>
                  <th className="py-2">End</th>
                </tr>
              </thead>
              <tbody>
                {upcomingLeave.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-[var(--muted)] text-center"
                    >
                      No upcoming leave
                    </td>
                  </tr>
                ) : (
                  upcomingLeave.map((lr) => (
                    <tr key={lr.id} className="border-t border-[var(--border)]">
                      <td className="py-2">{nameOf(lr.employee_id)}</td>
                      <td className="py-2 capitalize">{lr.type}</td>
                      <td className="py-2">{lr.start_date}</td>
                      <td className="py-2">{lr.end_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TableCard>

          <TableCard title={`Latest Payslips (${latestPeriod})`}>
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--muted)]">
                <tr>
                  <th className="py-2">Employee</th>
                  <th className="py-2">Net (AED)</th>
                  <th className="py-2">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {payslipsLatest
                  .sort((a, b) => b.net - a.net)
                  .slice(0, 6)
                  .map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="py-2">{nameOf(p.employee_id)}</td>
                      <td className="py-2">{p.net.toLocaleString()}</td>
                      <td className="py-2">{p.pay_date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </TableCard>

          <TableCard title="Open Workflows">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--muted)]">
                <tr>
                  <th className="py-2">Workflow</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {workflows
                  .filter((w) => !["approved", "rejected"].includes(w.status))
                  .sort((a, b) => a.created_at.localeCompare(b.created_at))
                  .slice(0, 6)
                  .map((w) => (
                    <tr
                      key={w.id}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="py-2">{labelWorkflow(w)}</td>
                      <td className="py-2 capitalize">
                        {w.status.replace("_", " ")}
                      </td>
                      <td className="py-2">
                        {w.created_at.substring(0, 10)}
                      </td>
                    </tr>
                  ))}
                {workflows.filter(
                  (w) => !["approved", "rejected"].includes(w.status)
                ).length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-4 text-[var(--muted)] text-center"
                    >
                      No open workflows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableCard>
        </div>
      </section>
    </section>
  );

  // local helpers
  function labelWorkflow(w: Workflow) {
    const who = nameOf(w.employee_id);
    const kind =
      {
        bank_change: "Bank Change",
        address_change: "Address Change",
        leave_request: "Leave Request",
        onboarding: "Onboarding",
        rtw_check: "RTW Check",
      }[w.kind] ?? "Workflow";
    return `${kind} – ${who}`;
  }
}

/** ---------------------------------
 *  Small presentational components
 *  --------------------------------- */
function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-4">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>
      ) : null}
    </div>
  );
}

function RagCard({
  title,
  dotClass,
  items,
  emptyText,
}: {
  title: string;
  dotClass: string;
  items: { label: string; href: string; action: string }[];
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <span
          className={`inline-flex h-3 w-3 rounded-full ${dotClass}`}
          aria-hidden
        />
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.length === 0 ? (
          <li className="text-[var(--muted)]">{emptyText}</li>
        ) : (
          items.slice(0, 6).map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span className="truncate">{it.label}</span>
              <a
                href={it.href}
                className="underline underline-offset-2 text-[var(--foreground)]"
              >
                {it.action}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function TableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] p-4">
      <header className="mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
      </header>
      <div className="overflow-x-auto">{children}</div>
    </article>
  );
}
