import React, { useEffect, useMemo, useState } from "react";
type UserRef = { _id: string; name: string; email?: string };
type Appointment = {
  _id: string;
  patientId: UserRef | string;
  doctorId: UserRef | string;
  department: string;
  date: string;
  slot: { start: string; end: string };
  duration?: number;
  status:
    | "pending"
    | "confirmed"
    | "rescheduled"
    | "completed"
    | "cancelled"
    | "no-show";
  consultationType?: "online" | "in-person";
  paymentStatus?: "paid" | "pending" | "refunded";
  reasonForVisit?: string;
  notes?: string;
};
type Doctor = { _id: string; name: string; department: string };
type PaginatedResponse<T> = {
  data: T[];
  pagination: { total: number; page: number; pages: number; limit: number };
};
const statusColor: Record<Appointment["status"], string> = {
  pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  confirmed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  rescheduled: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
  completed: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  cancelled: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  "no-show": "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
};
const paymentColor: Record<
  NonNullable<Appointment["paymentStatus"]>,
  string
> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-purple-50 text-purple-700",
};
function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
export default function Appointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedResponse<Appointment>["pagination"] | null
  >(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Appointment["status"] | "all">("all");
  const [doctorId, setDoctorId] = useState<string>("all");
  const [date, setDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [openCreate, setOpenCreate] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [aRes, dRes] = await Promise.all([
          fetch(
            `http://localhost:1111/appointment?page=${page}&limit=${limit}`
          ).then((r) => (r.ok ? r.json() : Promise.reject(r.statusText))),
          fetch("http://localhost:1111/doctor").then((r) =>
            r.ok ? r.json() : Promise.reject(r.statusText)
          ),
        ]);
        const appointmentResponse = aRes as PaginatedResponse<Appointment>;
        const doctorsResponse = dRes as Doctor[];
        setAppointments(appointmentResponse.data || []);
        setPagination(appointmentResponse.pagination || null);
        setDoctors(doctorsResponse || []);
        setError(null);
      } catch (e) {
        console.warn("Falling back to demo data:", e);
        setError("Live data unavailable. Showing demo data.");
        const demoDoctors: Doctor[] = [
          { _id: "d1", name: "Dr. Ananya Rao", department: "Cardiology" },
          { _id: "d2", name: "Dr. Kiran Patel", department: "Pulmonology" },
        ];
        const today = new Date();
        const iso = (d: Date) => new Date(d).toISOString();
        const demoAppointments: Appointment[] = [
          {
            _id: "a1",
            patientId: { _id: "p1", name: "Arya Bhupathi" },
            doctorId: { _id: "d1", name: "Dr. Ananya Rao" },
            department: "Cardiology",
            date: iso(today),
            slot: { start: "10:00", end: "10:30" },
            status: "confirmed",
            consultationType: "in-person",
            paymentStatus: "paid",
            reasonForVisit: "BP follow-up",
          },
          {
            _id: "a2",
            patientId: { _id: "p2", name: "Priya Sharma" },
            doctorId: { _id: "d2", name: "Dr. Kiran Patel" },
            department: "Pulmonology",
            date: iso(new Date(today.getTime() + 86400000)),
            slot: { start: "16:00", end: "16:20" },
            status: "pending",
            consultationType: "online",
            paymentStatus: "pending",
            reasonForVisit: "Asthma check",
          },
        ];
        setDoctors(demoDoctors);
        setAppointments(demoAppointments);
        setPagination({ total: 2, page: 1, pages: 1, limit: 10 });
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);
  // ✅ Filtering logic
  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchStatus = status === "all" ? true : appt.status === status;
      const matchDoctor =
        doctorId === "all"
          ? true
          : typeof appt.doctorId === "string"
          ? appt.doctorId === doctorId
          : appt.doctorId?._id === doctorId;
      const matchDate = date
        ? new Date(appt.date).toDateString() === new Date(date).toDateString()
        : true;
      const hay = [
        typeof appt.patientId === "string"
          ? appt.patientId
          : appt.patientId?.name,
        typeof appt.doctorId === "string" ? appt.doctorId : appt.doctorId?.name,
        appt.department,
        appt.reasonForVisit,
      ]
        .join(" ")
        .toLowerCase();
      const matchQ = q ? hay.includes(q.toLowerCase()) : true;
      return matchStatus && matchDoctor && matchDate && matchQ;
    });
  }, [appointments, status, doctorId, date, q]);
  // ✅ Pagination
  const Pagination = () =>
    pagination ? (
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <div>
          Page {pagination.page} of {pagination.pages} (Total {pagination.total}
          )
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg bg-slate-100 px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            className="rounded-lg bg-slate-100 px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    ) : null;
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage bookings, statuses, and slot availability in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white font-semibold shadow-lg shadow-fuchsia-500/20 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-95 active:scale-[0.98]"
          >
            + New Appointment
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          {error}
        </div>
      )}
      <Pagination />
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Patient</th>
              <th className="px-4 py-2 text-left font-semibold">Doctor</th>
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-left font-semibold">Slot</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((appt) => (
              <tr key={appt._id}>
                <td className="px-4 py-2">
                  {typeof appt.patientId === "string"
                    ? appt.patientId
                    : appt.patientId?.name}
                </td>
                <td className="px-4 py-2">
                  {typeof appt.doctorId === "string"
                    ? appt.doctorId
                    : appt.doctorId?.name}
                </td>
                <td className="px-4 py-2">
                  {new Date(appt.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {appt.slot.start} – {appt.slot.end}
                </td>
                <td className="px-4 py-2">
                  <Badge className={statusColor[appt.status]}>
                    {appt.status}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  {appt.paymentStatus ? (
                    <Badge className={paymentColor[appt.paymentStatus]}>
                      {appt.paymentStatus}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
      {openCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p>Create Appointment Form (modal)...</p>
            <button
              onClick={() => setOpenCreate(false)}
              className="mt-4 rounded-lg bg-slate-100 px-3 py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
