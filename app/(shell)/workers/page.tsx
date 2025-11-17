// app/workers/page.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Save, X, Pencil } from "lucide-react";
import { toast } from "sonner";

/* ---------------------------- Types & mock data ---------------------------- */

type Worker = {
  id: string;
  personNumber: string;
  fullName: string;
  givenName: string;
  familyName: string;
  preferredName?: string;
  nationality?: string;
  gender?: "Male" | "Female" | "Other" | "Unspecified";
  dateOfBirth?: string;
  emiratesId?: string;
  passport?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  originalStartDate?: string;
  employmentStatus: "Active" | "On Leave" | "Terminated";
  workerType: "Employee" | "Contractor" | "Intern";
  company: string;
  location?: string;
  department?: string;
  jobTitle?: string;
  grade?: string;
  manager?: string;
  payGroup?: string;
  payFrequency?: "Monthly" | "Biweekly" | "Weekly";
  currency?: string;
  baseSalary?: number;
  bankName?: string;
  bankIban?: string;
  bankSwift?: string;
  bankAccountName?: string;
  workPermitValidUntil?: string;
  visaValidUntil?: string;
  annualLeaveBalance?: number;
};

const MOCK_WORKERS: Worker[] = [
  {
    id: "W0001",
    personNumber: "100001",
    fullName: "Aisha Al Zahra",
    givenName: "Aisha",
    familyName: "Al Zahra",
    preferredName: "Aisha",
    nationality: "UAE",
    gender: "Female",
    dateOfBirth: "1991-03-14",
    emiratesId: "784-1991-1234567-1",
    passport: "U1234567",
    email: "aisha.alzahra@example.com",
    phone: "+971501234567",
    hireDate: "2022-08-01",
    originalStartDate: "2022-08-01",
    employmentStatus: "Active",
    workerType: "Employee",
    company: "insanONE LLC",
    location: "Dubai",
    department: "Engineering",
    jobTitle: "Senior Software Engineer",
    grade: "G7",
    manager: "Omar Khan",
    payGroup: "UAE Monthly",
    payFrequency: "Monthly",
    currency: "AED",
    baseSalary: 28000,
    bankName: "Emirates NBD",
    bankIban: "AE07 0331 2345 6789 0123 456",
    bankSwift: "EBILAEAD",
    bankAccountName: "Aisha Al Zahra",
    workPermitValidUntil: "2026-09-30",
    visaValidUntil: "2026-09-30",
    annualLeaveBalance: 17,
  },
  {
    id: "W0002",
    personNumber: "100002",
    fullName: "James Patel",
    givenName: "James",
    familyName: "Patel",
    nationality: "UK",
    gender: "Male",
    dateOfBirth: "1988-11-02",
    emiratesId: "784-1988-9876543-2",
    passport: "UK9876543",
    email: "james.patel@example.com",
    phone: "+971508765432",
    hireDate: "2023-01-15",
    originalStartDate: "2023-01-15",
    employmentStatus: "Active",
    workerType: "Employee",
    company: "insanONE LLC",
    location: "Abu Dhabi",
    department: "People Ops",
    jobTitle: "HR Business Partner",
    grade: "G6",
    manager: "Mary K",
    payGroup: "UAE Monthly",
    payFrequency: "Monthly",
    currency: "AED",
    baseSalary: 22000,
    bankName: "ADCB",
    bankIban: "AE82 0007 1234 5678 9012 345",
    bankSwift: "ADCBAEAA",
    bankAccountName: "James Patel",
    workPermitValidUntil: "2027-01-14",
    visaValidUntil: "2027-01-14",
    annualLeaveBalance: 9,
  },
];

const MOCK_VIEWERS = [
  { id: "u1", name: "Jane Admin", role: "HR" },
  { id: "u2", name: "Omar Payroll", role: "Payroll" },
];

/* -------------------------------- Utilities -------------------------------- */

function deepClone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}
function hasChanges(a: object, b: object) {
  return JSON.stringify(a) !== JSON.stringify(b);
}
function formatMoney(val?: number, currency = "AED") {
  if (val == null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(val);
  } catch {
    return `${currency} ${val.toFixed(2)}`;
  }
}

/* --------------------------------- Page --------------------------------- */

export default function WorkerScreen() {
  const [workers] = useState<Worker[]>(MOCK_WORKERS);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    workers[0]?.id ?? null
  );

  const selectedWorker = useMemo(
    () => workers.find((w) => w.id === selectedId) ?? null,
    [workers, selectedId]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 md:py-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Left pane: Worker selector */}
        <section className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Workers
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <input
                placeholder="Search by name, number, dept…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
              />
              <div className="h-px bg-[var(--border)]" />
              <div className="h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-1">
                  {workers
                    .filter((w) =>
                      (
                        w.fullName +
                        " " +
                        w.personNumber +
                        " " +
                        (w.department ?? "")
                      )
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    )
                    .map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedId(w.id)}
                        className={`w-full text-left rounded-xl border p-3 text-sm transition
                          hover:bg-[var(--background)]
                          ${
                            selectedId === w.id
                              ? "border-[var(--brand)] bg-[var(--brand)]/5"
                              : "border-[var(--border)] bg-[var(--background-alt)]"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-[var(--foreground)]">
                            {w.fullName}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium
                              ${
                                w.employmentStatus === "Active"
                                  ? "bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20"
                                  : "bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]"
                              }`}
                          >
                            {w.employmentStatus}
                          </span>
                        </div>
                        <div className="text-[13px] text-[var(--muted)]">
                          #{w.personNumber} • {w.jobTitle ?? "—"}
                        </div>
                        <div className="text-[11px] text-[var(--muted)]">
                          {w.department ?? "—"} • {w.location ?? "—"}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right pane: Details */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9">
          {selectedWorker ? (
            <WorkerDetails key={selectedWorker.id} worker={selectedWorker} />
          ) : (
            <div className="h-full grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] shadow-sm">
              <p className="text-[var(--muted)]">
                Select a worker to view details.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

/* ----------------------------- Details panel ----------------------------- */

function ViewerChips({
  viewers,
}: {
  viewers: { id: string; name: string; role?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {viewers.map((v) => (
        <span
          key={v.id}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)]"
        >
          <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-[var(--brand)]/15 text-[11px] font-semibold text-[var(--brand)]">
            {v.name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span className="text-sm">{v.name}</span>
          {v.role ? (
            <span className="text-[11px] text-[var(--muted)]">• {v.role}</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function DetailsRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-b last:border-0 border-[var(--border)]">
      <td className="w-[32%] p-3 align-top text-sm text-[var(--muted)]">
        {label}
      </td>
      <td className="p-3 align-top">{children}</td>
    </tr>
  );
}

function ReadField({ value }: { value?: string | number }) {
  return (
    <div className="min-h-6 text-sm text-[var(--foreground)]">
      {value != null && value !== "" ? String(value) : "—"}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
}: {
  value?: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value == null ? "" : String(value)}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)]">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>
      </div>
      <div className="px-4 py-3">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function WorkerDetails({ worker }: { worker: Worker }) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [tab, setTab] = useState<
    "profile" | "job" | "pay" | "bank" | "contacts" | "leave" | "compliance" | "documents"
  >("profile");
  const [current, setCurrent] = useState<Worker>(() => deepClone(worker));
  const original = useRef<Worker>(deepClone(worker));

  const dirty = hasChanges(current, original.current);

  useEffect(() => {
    setMode("view");
    setTab("profile");
    setCurrent(deepClone(worker));
    original.current = deepClone(worker);
  }, [worker]);

  function handleSave() {
    original.current = deepClone(current);
    setMode("view");
    toast.success("Worker saved.");
  }

  function handleCancelEdit() {
    setCurrent(deepClone(original.current));
    setMode("view");
  }

  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--background-alt)] shadow-sm">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {current.fullName}
            </h2>
            <div className="text-sm text-[var(--muted)]">
              #{current.personNumber} • {current.jobTitle ?? "—"} •{" "}
              {current.department ?? "—"}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <ViewerChips viewers={MOCK_VIEWERS} />
            <div className="flex items-center gap-2">
              {mode === "view" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("edit")}
                    className="inline-flex items-center rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-medium text-[var(--on-brand)] hover:bg-[var(--brand-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </button>
                  <Link href="/landing" className="inline-flex">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-[var(--brand)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--brand)] hover:bg-[var(--brand)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
                    >
                      <X className="mr-2 h-4 w-4" /> Close
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center rounded-lg border border-[var(--brand)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--brand)] hover:bg-[var(--brand)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
                  >
                    <X className="mr-2 h-4 w-4" /> Exit edit mode
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!dirty}
                    className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
                      ${
                        dirty
                          ? "bg-[var(--brand)] text-[var(--on-brand)] hover:bg-[var(--brand-strong)]"
                          : "bg-[var(--brand)]/60 text-[var(--on-brand)] cursor-not-allowed"
                      }`}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "profile", label: "Profile" },
            { key: "job", label: "Job" },
            { key: "pay", label: "Pay" },
            { key: "bank", label: "Bank" },
            { key: "contacts", label: "Contacts" },
            { key: "leave", label: "Leave" },
            { key: "compliance", label: "Compliance" },
            { key: "documents", label: "Documents" },
          ].map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() =>
                  setTab(
                    t.key as typeof tab
                  )
                }
                className={`rounded-md border px-3 py-1 text-xs font-medium transition
                  ${
                    active
                      ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]"
                      : "border-[var(--brand)] text-[var(--brand)] bg-transparent hover:bg-[var(--brand)]/10"
                  }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Profile */}
        {tab === "profile" && (
          <SectionCard title="Personal">
            <DetailsRow label="Given / Family Name">
              {mode === "view" ? (
                <ReadField
                  value={`${current.givenName} ${current.familyName}`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    value={current.givenName}
                    onChange={(v) =>
                      setCurrent({ ...current, givenName: v })
                    }
                  />
                  <TextInput
                    value={current.familyName}
                    onChange={(v) =>
                      setCurrent({ ...current, familyName: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Preferred Name">
              {mode === "view" ? (
                <ReadField value={current.preferredName} />
              ) : (
                <TextInput
                  value={current.preferredName}
                  onChange={(v) =>
                    setCurrent({ ...current, preferredName: v })
                  }
                />
              )}
            </DetailsRow>
            <DetailsRow label="Gender">
              {mode === "view" ? (
                <ReadField value={current.gender} />
              ) : (
                <SelectInput
                  value={current.gender}
                  onChange={(v) =>
                    setCurrent({
                      ...current,
                      gender: v as Worker["gender"],
                    })
                  }
                  options={["Male", "Female", "Other", "Unspecified"]}
                />
              )}
            </DetailsRow>
            <DetailsRow label="Date of Birth">
              {mode === "view" ? (
                <ReadField value={current.dateOfBirth} />
              ) : (
                <TextInput
                  type="date"
                  value={current.dateOfBirth}
                  onChange={(v) =>
                    setCurrent({ ...current, dateOfBirth: v })
                  }
                />
              )}
            </DetailsRow>
            <DetailsRow label="Nationality">
              {mode === "view" ? (
                <ReadField value={current.nationality} />
              ) : (
                <TextInput
                  value={current.nationality}
                  onChange={(v) =>
                    setCurrent({ ...current, nationality: v })
                  }
                />
              )}
            </DetailsRow>
            <DetailsRow label="Emirates ID / Passport">
              {mode === "view" ? (
                <ReadField
                  value={`${current.emiratesId ?? "—"} / ${
                    current.passport ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    value={current.emiratesId}
                    onChange={(v) =>
                      setCurrent({ ...current, emiratesId: v })
                    }
                  />
                  <TextInput
                    value={current.passport}
                    onChange={(v) =>
                      setCurrent({ ...current, passport: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Contact (Email / Phone)">
              {mode === "view" ? (
                <ReadField
                  value={`${current.email ?? "—"} / ${
                    current.phone ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    type="email"
                    value={current.email}
                    onChange={(v) =>
                      setCurrent({ ...current, email: v })
                    }
                  />
                  <TextInput
                    value={current.phone}
                    onChange={(v) =>
                      setCurrent({ ...current, phone: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Job */}
        {tab === "job" && (
          <SectionCard title="Employment">
            <DetailsRow label="Status / Type">
              {mode === "view" ? (
                <ReadField
                  value={`${current.employmentStatus} / ${current.workerType}`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectInput
                    value={current.employmentStatus}
                    onChange={(v) =>
                      setCurrent({
                        ...current,
                        employmentStatus:
                          v as Worker["employmentStatus"],
                      })
                    }
                    options={["Active", "On Leave", "Terminated"]}
                  />
                  <SelectInput
                    value={current.workerType}
                    onChange={(v) =>
                      setCurrent({
                        ...current,
                        workerType: v as Worker["workerType"],
                      })
                    }
                    options={["Employee", "Contractor", "Intern"]}
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Company / Location">
              {mode === "view" ? (
                <ReadField
                  value={`${current.company} / ${
                    current.location ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    value={current.company}
                    onChange={(v) =>
                      setCurrent({ ...current, company: v })
                    }
                  />
                  <TextInput
                    value={current.location}
                    onChange={(v) =>
                      setCurrent({ ...current, location: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Department / Title / Grade">
              {mode === "view" ? (
                <ReadField
                  value={`${current.department ?? "—"} / ${
                    current.jobTitle ?? "—"
                  } / ${current.grade ?? "—"}`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TextInput
                    value={current.department}
                    onChange={(v) =>
                      setCurrent({ ...current, department: v })
                    }
                  />
                  <TextInput
                    value={current.jobTitle}
                    onChange={(v) =>
                      setCurrent({ ...current, jobTitle: v })
                    }
                  />
                  <TextInput
                    value={current.grade}
                    onChange={(v) =>
                      setCurrent({ ...current, grade: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Manager">
              {mode === "view" ? (
                <ReadField value={current.manager} />
              ) : (
                <TextInput
                  value={current.manager}
                  onChange={(v) =>
                    setCurrent({ ...current, manager: v })
                  }
                />
              )}
            </DetailsRow>
            <DetailsRow label="Hire / Original Start">
              {mode === "view" ? (
                <ReadField
                  value={`${current.hireDate ?? "—"} / ${
                    current.originalStartDate ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    type="date"
                    value={current.hireDate}
                    onChange={(v) =>
                      setCurrent({ ...current, hireDate: v })
                    }
                  />
                  <TextInput
                    type="date"
                    value={current.originalStartDate}
                    onChange={(v) =>
                      setCurrent({
                        ...current,
                        originalStartDate: v,
                      })
                    }
                  />
                </div>
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Pay */}
        {tab === "pay" && (
          <SectionCard title="Compensation">
            <DetailsRow label="Pay Group / Frequency">
              {mode === "view" ? (
                <ReadField
                  value={`${current.payGroup ?? "—"} / ${
                    current.payFrequency ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    value={current.payGroup}
                    onChange={(v) =>
                      setCurrent({ ...current, payGroup: v })
                    }
                  />
                  <SelectInput
                    value={current.payFrequency}
                    onChange={(v) =>
                      setCurrent({
                        ...current,
                        payFrequency:
                          v as Worker["payFrequency"],
                      })
                    }
                    options={["Monthly", "Biweekly", "Weekly"]}
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Base Salary">
              {mode === "view" ? (
                <ReadField
                  value={`${formatMoney(
                    current.baseSalary,
                    current.currency
                  )} (${current.currency ?? ""})`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    type="number"
                    value={current.baseSalary}
                    onChange={(v) =>
                      setCurrent({
                        ...current,
                        baseSalary: Number(v),
                      })
                    }
                  />
                  <TextInput
                    value={current.currency}
                    onChange={(v) =>
                      setCurrent({ ...current, currency: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Bank */}
        {tab === "bank" && (
          <SectionCard title="Bank Details (WPS)">
            <DetailsRow label="Bank / SWIFT">
              {mode === "view" ? (
                <ReadField
                  value={`${current.bankName ?? "—"} / ${
                    current.bankSwift ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    value={current.bankName}
                    onChange={(v) =>
                      setCurrent({ ...current, bankName: v })
                    }
                  />
                  <TextInput
                    value={current.bankSwift}
                    onChange={(v) =>
                      setCurrent({ ...current, bankSwift: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
            <DetailsRow label="Account Name / IBAN">
              {mode === "view" ? (
                <ReadField
                  value={`${current.bankAccountName ?? "—"} / ${
                    current.bankIban ?? "—"
                  }`}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    value={current.bankAccountName}
                    onChange={(v) =>
                      setCurrent({
                        ...current,
                        bankAccountName: v,
                      })
                    }
                  />
                  <TextInput
                    value={current.bankIban}
                    onChange={(v) =>
                      setCurrent({ ...current, bankIban: v })
                    }
                  />
                </div>
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Contacts */}
        {tab === "contacts" && (
          <SectionCard title="Primary Contact">
            <DetailsRow label="Email">
              {mode === "view" ? (
                <ReadField value={current.email} />
              ) : (
                <TextInput
                  type="email"
                  value={current.email}
                  onChange={(v) =>
                    setCurrent({ ...current, email: v })
                  }
                />
              )}
            </DetailsRow>
            <DetailsRow label="Phone">
              {mode === "view" ? (
                <ReadField value={current.phone} />
              ) : (
                <TextInput
                  value={current.phone}
                  onChange={(v) =>
                    setCurrent({ ...current, phone: v })
                  }
                />
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Leave */}
        {tab === "leave" && (
          <SectionCard title="Leave Entitlements">
            <DetailsRow label="Annual Leave Balance (days)">
              {mode === "view" ? (
                <ReadField value={current.annualLeaveBalance} />
              ) : (
                <TextInput
                  type="number"
                  value={current.annualLeaveBalance}
                  onChange={(v) =>
                    setCurrent({
                      ...current,
                      annualLeaveBalance: Number(v),
                    })
                  }
                />
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Compliance */}
        {tab === "compliance" && (
          <SectionCard title="Right to Work / Visa">
            <DetailsRow label="Work Permit Valid Until">
              {mode === "view" ? (
                <ReadField value={current.workPermitValidUntil} />
              ) : (
                <TextInput
                  type="date"
                  value={current.workPermitValidUntil}
                  onChange={(v) =>
                    setCurrent({
                      ...current,
                      workPermitValidUntil: v,
                    })
                  }
                />
              )}
            </DetailsRow>
            <DetailsRow label="Visa Valid Until">
              {mode === "view" ? (
                <ReadField value={current.visaValidUntil} />
              ) : (
                <TextInput
                  type="date"
                  value={current.visaValidUntil}
                  onChange={(v) =>
                    setCurrent({
                      ...current,
                      visaValidUntil: v,
                    })
                  }
                />
              )}
            </DetailsRow>
          </SectionCard>
        )}

        {/* Documents */}
        {tab === "documents" && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-alt)]">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Documents
              </h3>
            </div>
            <div className="px-4 py-3">
              <div className="rounded-xl border border-[var(--border)]">
                <div className="grid grid-cols-12 border-b border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Expiry</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
                {[
                  {
                    name: "Passport.pdf",
                    type: "ID",
                    expiry: current.visaValidUntil,
                  },
                  {
                    name: "OfferLetter.pdf",
                    type: "Contract",
                    expiry: "—",
                  },
                ].map((d) => (
                  <div
                    key={d.name}
                    className="grid grid-cols-12 items-center px-3 py-2 text-sm text-[var(--foreground)]"
                  >
                    <div className="col-span-5 truncate">{d.name}</div>
                    <div className="col-span-3">{d.type}</div>
                    <div className="col-span-2">{d.expiry ?? "—"}</div>
                    <div className="col-span-2 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-lg px-2 py-1 text-xs text-[var(--brand)] hover:bg-[var(--brand)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky save bar (edit mode) */}
      {mode === "edit" && (
        <div className="sticky bottom-0 z-10 border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/75">
          <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-6 py-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center rounded-lg border border-[var(--brand)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--brand)] hover:bg-[var(--brand)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            >
              <X className="mr-2 h-4 w-4" /> Exit edit mode
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
                ${
                  dirty
                    ? "bg-[var(--brand)] text-[var(--on-brand)] hover:bg-[var(--brand-strong)]"
                    : "bg-[var(--brand)]/60 text-[var(--on-brand)] cursor-not-allowed"
                }`}
            >
              <Save className="mr-2 h-4 w-4" /> Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
