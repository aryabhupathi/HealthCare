import { useEffect, useState } from "react";
type Patient = {
  _id: string;
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: { phone: string; email: string; address: string };
  bloodGroup: string;
  department: string;
  status: "Active" | "Discharged";
  insuranceProvider?: string;
  insuranceNumber?: string;
};
export default function PatientsAdmin() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const fetchPatients = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:1111/patient");
    const data = await res.json();
    setPatients(data.data || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchPatients();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing
      ? `http://localhost:1111/patient/${editing._id}`
      : "http://localhost:1111/patient";
    const method = editing ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setEditing(null);
    setFormData({});
    fetchPatients();
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    await fetch(`http://localhost:1111/patient/${id}`, { method: "DELETE" });
    fetchPatients();
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patients Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            setFormData({});
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Patient
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Patient ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Blood Group</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id} className="text-center">
                <td className="p-2 border">{p.patientId}</td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.age}</td>
                <td className="p-2 border">{p.gender}</td>
                <td className="p-2 border">{p.contact.phone}</td>
                <td className="p-2 border">{p.bloodGroup}</td>
                <td className="p-2 border">{p.department}</td>
                <td className="p-2 border">{p.status}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => {
                      setEditing(p);
                      setFormData(p);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td className="p-2 border text-center" colSpan={9}>
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Patient" : "Add Patient"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="patientId"
                placeholder="Patient ID"
                value={formData.patientId || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                name="bloodGroup"
                placeholder="Blood Group"
                value={formData.bloodGroup || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
              </select>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.contact?.phone || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.contact?.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.contact?.address || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, address: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
