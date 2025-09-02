import { useEffect, useState } from "react";
type Slot = { start: string; end: string };
type Availability = { day: string; slots: Slot[] };
type DocumentType = { type: string; url: string; verified: boolean };
type Doctor = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  dateOfBirth?: string;
  specialization: string[];
  department?: string;
  experience?: number;
  licenseNumber?: string;
  licenseExpiry?: string;
  photo?: string;
  availability: Availability[];
  status?: "active" | "suspended" | "retired" | "pending";
  assignedPatients?: string[];
  documents: DocumentType[];
  rating?: number;
  averageRating?: number;
  isDeleted?: boolean;
  languages: string[];
  consultationFee?: number;
  hospitalAffiliation?: string;
  createdAt?: string;
  updatedAt?: string;
};
const defaultDoctor = (): Doctor => ({
  name: "",
  email: "",
  phone: "",
  gender: "male",
  dateOfBirth: "",
  specialization: [],
  department: "",
  experience: 0,
  licenseNumber: "",
  licenseExpiry: "",
  photo: "",
  availability: [],
  status: "pending",
  assignedPatients: [],
  documents: [],
  rating: 0,
  averageRating: 0,
  isDeleted: false,
  languages: [],
  consultationFee: 0,
  hospitalAffiliation: "",
});
export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [open, setOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Doctor>(defaultDoctor());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchDoctors();
  }, []);
  async function fetchDoctors() {
    try {
      const res = await fetch("http://localhost:1111/doctor");
      const data = await res.json();
      if (data.success) setDoctors(data.data || []);
      else setDoctors([]);
    } catch (e) {
      console.error("Fetch doctors failed", e);
    }
  }
  function openAddModal() {
    setEditingDoctor(null);
    setForm(defaultDoctor());
    setError(null);
    setOpen(true);
  }
  function openEditModal(d: Doctor) {
    const copy = JSON.parse(JSON.stringify(d)) as Doctor;
    copy.specialization = copy.specialization || [];
    copy.availability = copy.availability || [];
    copy.documents = copy.documents || [];
    copy.languages = copy.languages || [];
    setEditingDoctor(copy);
    setForm(copy);
    setError(null);
    setOpen(true);
  }
  const handleSimpleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "experience" || name === "consultationFee") {
      setForm((s) => ({ ...s, [name]: Number(value) }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };
  const handleSpecializationChange = (value: string) => {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((s) => ({ ...s, specialization: arr }));
  };
  const handleLanguagesChange = (value: string) => {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((s) => ({ ...s, languages: arr }));
  };
  function addAvailabilityDay() {
    setForm((s) => ({
      ...s,
      availability: [
        ...(s.availability || []),
        { day: "", slots: [{ start: "", end: "" }] },
      ],
    }));
  }
  function removeAvailabilityDay(idx: number) {
    setForm((s) => ({
      ...s,
      availability: s.availability.filter((_, i) => i !== idx),
    }));
  }
  function updateAvailabilityDay(idx: number, day: string) {
    setForm((s) => {
      const av = [...(s.availability || [])];
      av[idx] = { ...av[idx], day };
      return { ...s, availability: av };
    });
  }
  function addSlotToDay(dayIdx: number) {
    setForm((s) => {
      const av = [...(s.availability || [])];
      av[dayIdx] = {
        ...av[dayIdx],
        slots: [...(av[dayIdx].slots || []), { start: "", end: "" }],
      };
      return { ...s, availability: av };
    });
  }
  function removeSlotFromDay(dayIdx: number, slotIdx: number) {
    setForm((s) => {
      const av = [...(s.availability || [])];
      av[dayIdx] = {
        ...av[dayIdx],
        slots: av[dayIdx].slots.filter((_, i) => i !== slotIdx),
      };
      return { ...s, availability: av };
    });
  }
  function updateSlot(
    dayIdx: number,
    slotIdx: number,
    field: "start" | "end",
    value: string
  ) {
    setForm((s) => {
      const av = [...(s.availability || [])];
      const slots = [...(av[dayIdx].slots || [])];
      slots[slotIdx] = { ...slots[slotIdx], [field]: value };
      av[dayIdx] = { ...av[dayIdx], slots };
      return { ...s, availability: av };
    });
  }
  function validateForm(): string | null {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email";
    if (!form.licenseNumber?.trim()) return "License number is required";
    for (let i = 0; i < (form.availability || []).length; i++) {
      const a = form.availability[i];
      if (!a.day || !a.day.trim())
        return `Availability #${i + 1}: day is required`;
      for (let j = 0; j < (a.slots || []).length; j++) {
        const s = a.slots[j];
        if (!s.start || !s.end)
          return `Availability ${a.day || i + 1}, slot #${
            j + 1
          }: start and end required`;
        if (s.start >= s.end)
          return `Availability ${a.day}, slot #${
            j + 1
          }: start must be before end`;
      }
    }
    return null;
  }
  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      const url = editingDoctor
        ? `http://localhost:1111/doctor/${editingDoctor._id}`
        : "http://localhost:1111/doctor";
      const method = editingDoctor ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data?.success) {
        setError(data?.message || "Server error");
      } else {
        await fetchDoctors();
        setOpen(false);
        setEditingDoctor(null);
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm("Delete doctor? This will mark the record as deleted."))
      return;
    try {
      const res = await fetch(`http://localhost:1111/doctor/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deletedBy: "admin" }),
      });
      const data = await res.json();
      if (data.success) await fetchDoctors();
      else alert(data.message || "Delete failed");
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Doctor
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((d) => (
          <div
            key={d._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col"
          >
            <div className="flex items-center gap-4">
              <img
                src={d.photo || "https://via.placeholder.com/120"}
                alt={d.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-semibold">{d.name}</div>
                <div className="text-sm text-gray-500">
                  {d.department || "—"}
                </div>
                <div className="mt-1">
                  <span className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                    {d.status || "pending"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm space-y-1">
              <div>📧 {d.email}</div>
              <div>📞 {d.phone}</div>
              <div>⭐ {d.averageRating ?? d.rating ?? 0}</div>
              <div>🏥 {d.hospitalAffiliation || "—"}</div>
              <div>💬 {d.languages?.join(", ") || "—"}</div>
              <div>
                💸 Fee: {d.consultationFee ? `₹${d.consultationFee}` : "—"}
              </div>
              <div>
                🕒 Availability:{" "}
                {d.availability && d.availability.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {d.availability.map((a, i) => (
                      <li key={i} className="text-sm">
                        <strong>{a.day}:</strong>{" "}
                        {a.slots.map((s) => `${s.start}-${s.end}`).join(", ")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">Not set</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openEditModal(d)}
                className="flex-1 px-3 py-2 border rounded text-blue-700 border-blue-700 hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(d._id)}
                className="flex-1 px-3 py-2 border rounded text-red-700 border-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-6">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingDoctor ? "Edit Doctor" : "Add Doctor"}
              </h2>
              <div className="flex items-center gap-2">
                {loading && (
                  <div className="text-sm text-gray-500">Saving...</div>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    setEditingDoctor(null);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            </div>
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Email *
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleSimpleChange}
                  type="email"
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label className="block text-sm font-medium mt-3">
                  Date of Birth
                </label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Photo URL
                </label>
                <input
                  name="photo"
                  value={form.photo}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Languages (comma separated)
                </label>
                <input
                  name="languages"
                  value={form.languages.join(", ")}
                  onChange={(e) => handleLanguagesChange(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Specialization (comma separated)
                </label>
                <input
                  name="specialization"
                  value={form.specialization.join(", ")}
                  onChange={(e) => handleSpecializationChange(e.target.value)}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Experience (years)
                </label>
                <input
                  name="experience"
                  type="number"
                  value={form.experience}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Consultation Fee (₹)
                </label>
                <input
                  name="consultationFee"
                  type="number"
                  value={form.consultationFee}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  License Number *
                </label>
                <input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  License Expiry
                </label>
                <input
                  name="licenseExpiry"
                  type="date"
                  value={form.licenseExpiry}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">
                  Hospital Affiliation
                </label>
                <input
                  name="hospitalAffiliation"
                  value={form.hospitalAffiliation}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mt-3">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleSimpleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold">
                    Availability (day & slots)
                  </h3>
                  <div>
                    <button
                      type="button"
                      onClick={addAvailabilityDay}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      + Add day
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  {form.availability.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No availability set
                    </div>
                  )}
                  {form.availability.map((a, dayIdx) => (
                    <div key={dayIdx} className="border rounded p-3">
                      <div className="flex items-center gap-2">
                        <input
                          placeholder="Day (e.g. Monday)"
                          value={a.day}
                          onChange={(e) =>
                            updateAvailabilityDay(dayIdx, e.target.value)
                          }
                          className="border p-2 rounded flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeAvailabilityDay(dayIdx)}
                          className="px-2 py-1 text-red-600 border rounded"
                        >
                          Remove day
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {a.slots.map((s, slotIdx) => (
                          <div
                            key={slotIdx}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="time"
                              value={s.start}
                              onChange={(e) =>
                                updateSlot(
                                  dayIdx,
                                  slotIdx,
                                  "start",
                                  e.target.value
                                )
                              }
                              className="border p-2 rounded"
                            />
                            <span className="text-sm">to</span>
                            <input
                              type="time"
                              value={s.end}
                              onChange={(e) =>
                                updateSlot(
                                  dayIdx,
                                  slotIdx,
                                  "end",
                                  e.target.value
                                )
                              }
                              className="border p-2 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeSlotFromDay(dayIdx, slotIdx)}
                              className="px-2 py-1 text-red-600 border rounded"
                            >
                              Remove slot
                            </button>
                          </div>
                        ))}
                        <div>
                          <button
                            type="button"
                            onClick={() => addSlotToDay(dayIdx)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            + Add slot
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 mt-3">
                <h3 className="font-semibold">Documents</h3>
                <DocumentsEditor form={form} setForm={setForm} />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditingDoctor(null);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingDoctor ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
function DocumentsEditor({
  form,
  setForm,
}: {
  form: Doctor;
  setForm: (d: Doctor) => void;
}) {
  const addDoc = () => {
    setForm({
      ...form,
      documents: [
        ...(form.documents || []),
        { type: "", url: "", verified: false },
      ],
    });
  };
  const removeDoc = (i: number) => {
    setForm({
      ...form,
      documents: form.documents.filter((_, idx) => idx !== i),
    });
  };
  const updateDoc = (i: number, field: keyof DocumentType, value: any) => {
    const docs = [...(form.documents || [])];
    docs[i] = { ...docs[i], [field]: value };
    setForm({ ...form, documents: docs });
  };
  return (
    <div className="space-y-3 mt-2">
      {(form.documents || []).map((doc, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={doc.type}
            onChange={(e) => updateDoc(i, "type", e.target.value)}
            placeholder="Type (License, ID proof)"
            className="border p-2 rounded flex-1"
          />
          <input
            value={doc.url}
            onChange={(e) => updateDoc(i, "url", e.target.value)}
            placeholder="URL"
            className="border p-2 rounded flex-2"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={doc.verified}
              onChange={(e) => updateDoc(i, "verified", e.target.checked)}
            />
            <span className="text-sm">Verified</span>
          </label>
          <button
            type="button"
            onClick={() => removeDoc(i)}
            className="px-2 py-1 text-red-600 border rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={addDoc}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          + Add document
        </button>
      </div>
    </div>
  );
}
