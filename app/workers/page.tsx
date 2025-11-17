// app/workers/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, X, Pencil } from "lucide-react";

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
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(val);
  } catch {
    return `${currency} ${val.toFixed(2)}`;
  }
}

/* --------------------------------- Page --------------------------------- */

export default function WorkerScreen() {
  const [workers] = useState<Worker[]>(MOCK_WORKERS);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(workers[0]?.id ?? null);

  const selectedWorker = useMemo(
    () => workers.find((w) => w.id === selectedId) ?? null,
    [workers, selectedId]
  );

  return (
    <div className="min-h-screen bg-white text-[#0a1a3a] flex flex-col">
      <HeaderBar />
      <main className="flex-1 grid grid-cols-12 gap-4 px-4 py-6 md:px-6 md:py-8">
        {/* Left pane: Worker selector */}
        <section className="col-span-12 lg:col-span-4 xl:col-span-3">
          <Card className="h-full border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Workers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search by name, number, dept…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white"
              />
              <Separator className="bg-slate-200" />
              <ScrollArea className="h-[70vh] pr-2">
                <div className="space-y-1">
                  {workers
                    .filter((w) =>
                      (w.fullName + " " + w.personNumber + " " + (w.department ?? ""))
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    )
                    .map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setSelectedId(w.id)}
                        className={`w-full text-left rounded-xl border p-3 transition
                                    hover:bg-slate-50 ${
                                      selectedId === w.id
                                        ? "border-[#335784] bg-[#335784]/5"
                                        : "border-slate-200"
                                    }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{w.fullName}</div>
                          <Badge
                            variant={w.employmentStatus === "Active" ? "default" : "secondary"}
                            className="bg-[#335784]/10 text-[#335784] border-[#335784]/20"
                          >
                            {w.employmentStatus}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600">
                          #{w.personNumber} • {w.jobTitle ?? "—"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {w.department ?? "—"} • {w.location ?? "—"}
                        </div>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>

        {/* Right pane: Details */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9">
          {selectedWorker ? (
            <WorkerDetails key={selectedWorker.id} worker={selectedWorker} />
          ) : (
            <Card className="h-full grid place-items-center border-slate-200">
              <CardContent>
                <p className="text-slate-600">Select a worker to view details.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
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
        <Badge
          key={v.id}
          variant="outline"
          className="gap-2 rounded-full px-3 py-1 border-slate-300 text-slate-700"
        >
          <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-[#335784]/15 text-[11px] font-semibold text-[#335784]">
            {v.name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span className="text-sm">{v.name}</span>
          {v.role ? <span className="text-xs text-slate-500">• {v.role}</span> : null}
        </Badge>
      ))}
    </div>
  );
}

function DetailsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b last:border-0 border-slate-200">
      <td className="w-[32%] p-3 align-top text-sm text-slate-600">{label}</td>
      <td className="p-3 align-top">{children}</td>
    </tr>
  );
}

function ReadField({ value }: { value?: string | number }) {
  return <div className="min-h-6 text-slate-900">{value != null && value !== "" ? String(value) : "—"}</div>;
}

function EditText({
  value,
  onChange,
  type = "text",
}: {
  value?: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <Input
      type={type}
      value={value == null ? "" : String(value)}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white"
    />
  );
}

function EditSelect({
  value,
  onChange,
  options,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <tbody>{children}</tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkerDetails({ worker }: { worker: Worker }) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [current, setCurrent] = useState<Worker>(() => deepClone(worker));
  const original = useRef<Worker>(deepClone(worker));

  const dirty = hasChanges(current, original.current);

  useEffect(() => {
    setMode("view");
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
    <Card className="relative border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{current.fullName}</CardTitle>
            <div className="text-sm text-slate-600">
              #{current.personNumber} • {current.jobTitle ?? "—"} • {current.department ?? "—"}
            </div>
          </div>

          {/* Presence & Actions */}
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <ViewerChips viewers={MOCK_VIEWERS} />
            <div className="flex items-center gap-2">
              {mode === "view" ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => setMode("edit")}
                    className="bg-[#335784] text-white hover:bg-[#2a466a]"
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Link href="/landing" className="inline-flex">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white border border-[#335784] text-[#335784] hover:bg-[#335784]/10"
                    >
                      <X className="mr-2 h-4 w-4" /> Close
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="bg-white border border-[#335784] text-[#335784] hover:bg-[#335784]/10"
                  >
                    <X className="mr-2 h-4 w-4" /> Exit edit mode
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!dirty}
                    className="bg-[#335784] text-white hover:bg-[#2a466a] disabled:bg-[#335784]/60 disabled:text-white"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="profile">
          {/* Tabs styled like buttons: inactive = outline blue; active = solid blue */}
          <TabsList className="flex w-full flex-wrap gap-2 bg-white p-0">
            {[
              { key: "profile", label: "Profile" },
              { key: "job", label: "Job" },
              { key: "pay", label: "Pay" },
              { key: "bank", label: "Bank" },
              { key: "contacts", label: "Contacts" },
              { key: "leave", label: "Leave" },
              { key: "compliance", label: "Compliance" },
              { key: "documents", label: "Documents" },
            ].map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="rounded-md border border-[#335784] px-3 py-1 text-sm font-medium
                           text-[#335784] hover:bg-[#335784]/10
                           data-[state=active]:bg-[#335784]
                           data-[state=active]:text-white
                           data-[state=active]:hover:bg-[#2a466a]"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-3">
            <SectionCard title="Personal">
              <DetailsRow label="Given / Family Name">
                {mode === "view" ? (
                  <ReadField value={`${current.givenName} ${current.familyName}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText value={current.givenName} onChange={(v) => setCurrent({ ...current, givenName: v })} />
                    <EditText value={current.familyName} onChange={(v) => setCurrent({ ...current, familyName: v })} />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Preferred Name">
                {mode === "view" ? (
                  <ReadField value={current.preferredName} />
                ) : (
                  <EditText value={current.preferredName} onChange={(v) => setCurrent({ ...current, preferredName: v })} />
                )}
              </DetailsRow>
              <DetailsRow label="Gender">
                {mode === "view" ? (
                  <ReadField value={current.gender} />
                ) : (
                  <EditSelect
                    value={current.gender}
                    onChange={(v) => setCurrent({ ...current, gender: v as Worker["gender"] })}
                    options={["Male", "Female", "Other", "Unspecified"]}
                  />
                )}
              </DetailsRow>
              <DetailsRow label="Date of Birth">
                {mode === "view" ? (
                  <ReadField value={current.dateOfBirth} />
                ) : (
                  <EditText type="date" value={current.dateOfBirth} onChange={(v) => setCurrent({ ...current, dateOfBirth: v })} />
                )}
              </DetailsRow>
              <DetailsRow label="Nationality">
                {mode === "view" ? <ReadField value={current.nationality} /> : <EditText value={current.nationality} onChange={(v) => setCurrent({ ...current, nationality: v })} />}
              </DetailsRow>
              <DetailsRow label="Emirates ID / Passport">
                {mode === "view" ? (
                  <ReadField value={`${current.emiratesId ?? "—"} / ${current.passport ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText value={current.emiratesId} onChange={(v) => setCurrent({ ...current, emiratesId: v })} />
                    <EditText value={current.passport} onChange={(v) => setCurrent({ ...current, passport: v })} />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Contact (Email / Phone)">
                {mode === "view" ? (
                  <ReadField value={`${current.email ?? "—"} / ${current.phone ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText type="email" value={current.email} onChange={(v) => setCurrent({ ...current, email: v })} />
                    <EditText value={current.phone} onChange={(v) => setCurrent({ ...current, phone: v })} />
                  </div>
                )}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Job */}
          <TabsContent value="job" className="space-y-3">
            <SectionCard title="Employment">
              <DetailsRow label="Status / Type">
                {mode === "view" ? (
                  <ReadField value={`${current.employmentStatus} / ${current.workerType}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditSelect
                      value={current.employmentStatus}
                      onChange={(v) => setCurrent({ ...current, employmentStatus: v as Worker["employmentStatus"] })}
                      options={["Active", "On Leave", "Terminated"]}
                    />
                    <EditSelect
                      value={current.workerType}
                      onChange={(v) => setCurrent({ ...current, workerType: v as Worker["workerType"] })}
                      options={["Employee", "Contractor", "Intern"]}
                    />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Company / Location">
                {mode === "view" ? (
                  <ReadField value={`${current.company} / ${current.location ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText value={current.company} onChange={(v) => setCurrent({ ...current, company: v })} />
                    <EditText value={current.location} onChange={(v) => setCurrent({ ...current, location: v })} />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Department / Title / Grade">
                {mode === "view" ? (
                  <ReadField value={`${current.department ?? "—"} / ${current.jobTitle ?? "—"} / ${current.grade ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <EditText value={current.department} onChange={(v) => setCurrent({ ...current, department: v })} />
                    <EditText value={current.jobTitle} onChange={(v) => setCurrent({ ...current, jobTitle: v })} />
                    <EditText value={current.grade} onChange={(v) => setCurrent({ ...current, grade: v })} />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Manager">
                {mode === "view" ? <ReadField value={current.manager} /> : <EditText value={current.manager} onChange={(v) => setCurrent({ ...current, manager: v })} />}
              </DetailsRow>
              <DetailsRow label="Hire / Original Start">
                {mode === "view" ? (
                  <ReadField value={`${current.hireDate ?? "—"} / ${current.originalStartDate ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText type="date" value={current.hireDate} onChange={(v) => setCurrent({ ...current, hireDate: v })} />
                    <EditText type="date" value={current.originalStartDate} onChange={(v) => setCurrent({ ...current, originalStartDate: v })} />
                  </div>
                )}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Pay */}
          <TabsContent value="pay" className="space-y-3">
            <SectionCard title="Compensation">
              <DetailsRow label="Pay Group / Frequency">
                {mode === "view" ? (
                  <ReadField value={`${current.payGroup ?? "—"} / ${current.payFrequency ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText value={current.payGroup} onChange={(v) => setCurrent({ ...current, payGroup: v })} />
                    <EditSelect
                      value={current.payFrequency}
                      onChange={(v) => setCurrent({ ...current, payFrequency: v as Worker["payFrequency"] })}
                      options={["Monthly", "Biweekly", "Weekly"]}
                    />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Base Salary">
                {mode === "view" ? (
                  <ReadField value={`${formatMoney(current.baseSalary, current.currency)} (${current.currency ?? ""})`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText type="number" value={current.baseSalary} onChange={(v) => setCurrent({ ...current, baseSalary: Number(v) })} />
                    <EditText value={current.currency} onChange={(v) => setCurrent({ ...current, currency: v })} />
                  </div>
                )}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Bank */}
          <TabsContent value="bank" className="space-y-3">
            <SectionCard title="Bank Details (WPS)">
              <DetailsRow label="Bank / SWIFT">
                {mode === "view" ? (
                  <ReadField value={`${current.bankName ?? "—"} / ${current.bankSwift ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText value={current.bankName} onChange={(v) => setCurrent({ ...current, bankName: v })} />
                    <EditText value={current.bankSwift} onChange={(v) => setCurrent({ ...current, bankSwift: v })} />
                  </div>
                )}
              </DetailsRow>
              <DetailsRow label="Account Name / IBAN">
                {mode === "view" ? (
                  <ReadField value={`${current.bankAccountName ?? "—"} / ${current.bankIban ?? "—"}`} />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <EditText value={current.bankAccountName} onChange={(v) => setCurrent({ ...current, bankAccountName: v })} />
                    <EditText value={current.bankIban} onChange={(v) => setCurrent({ ...current, bankIban: v })} />
                  </div>
                )}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts" className="space-y-3">
            <SectionCard title="Primary Contact">
              <DetailsRow label="Email">
                {mode === "view" ? <ReadField value={current.email} /> : <EditText type="email" value={current.email} onChange={(v) => setCurrent({ ...current, email: v })} />}
              </DetailsRow>
              <DetailsRow label="Phone">
                {mode === "view" ? <ReadField value={current.phone} /> : <EditText value={current.phone} onChange={(v) => setCurrent({ ...current, phone: v })} />}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Leave */}
          <TabsContent value="leave" className="space-y-3">
            <SectionCard title="Leave Entitlements">
              <DetailsRow label="Annual Leave Balance (days)">
                {mode === "view" ? (
                  <ReadField value={current.annualLeaveBalance} />
                ) : (
                  <EditText
                    type="number"
                    value={current.annualLeaveBalance}
                    onChange={(v) => setCurrent({ ...current, annualLeaveBalance: Number(v) })}
                  />
                )}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance" className="space-y-3">
            <SectionCard title="Right to Work / Visa">
              <DetailsRow label="Work Permit Valid Until">
                {mode === "view" ? (
                  <ReadField value={current.workPermitValidUntil} />
                ) : (
                  <EditText
                    type="date"
                    value={current.workPermitValidUntil}
                    onChange={(v) => setCurrent({ ...current, workPermitValidUntil: v })}
                  />
                )}
              </DetailsRow>
              <DetailsRow label="Visa Valid Until">
                {mode === "view" ? (
                  <ReadField value={current.visaValidUntil} />
                ) : (
                  <EditText type="date" value={current.visaValidUntil} onChange={(v) => setCurrent({ ...current, visaValidUntil: v })} />
                )}
              </DetailsRow>
            </SectionCard>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-3">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-xl border border-slate-200">
                  <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-2">Expiry</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>
                  {[{ name: "Passport.pdf", type: "ID", expiry: current.visaValidUntil }, { name: "OfferLetter.pdf", type: "Contract", expiry: "—" }].map(
                    (d) => (
                      <div key={d.name} className="grid grid-cols-12 items-center px-3 py-2 text-sm">
                        <div className="col-span-5 truncate">{d.name}</div>
                        <div className="col-span-3">{d.type}</div>
                        <div className="col-span-2">{d.expiry ?? "—"}</div>
                        <div className="col-span-2 text-right">
                          <Button size="sm" variant="ghost" className="text-[#335784] hover:bg-[#335784]/10">
                            View
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Sticky save bar (edit mode) */}
      {mode === "edit" && (
        <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-6 py-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              className="bg-white border border-[#335784] text-[#335784] hover:bg-[#335784]/10"
            >
              <X className="mr-2 h-4 w-4" /> Exit edit mode
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!dirty}
              className="bg-[#335784] text-white hover:bg-[#2a466a] disabled:bg-[#335784]/60 disabled:text-white"
            >
              <Save className="mr-2 h-4 w-4" /> Save changes
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
