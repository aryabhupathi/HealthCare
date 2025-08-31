import { useEffect, useState } from "react";
type Patient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};
export default function Profile() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  useEffect(() => {
    fetch("http://localhost:5000/api/patients/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        setForm({
          name: data.name,
          phone: data.phone || "",
          address: data.address || "",
        });
      });
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/api/patients/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setPatient(updated.user);
      setEditing(false);
    }
  };
  // if (!patient) return <p>Loading...</p>;
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          {editing ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            // <p>{patient.name}</p>
            <p>aaa</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          {/* <p>{patient.email}</p> */}
          <p>bbb</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            // <p>{patient.phone || "Not provided"}</p>
            <p>ccc</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          {editing ? (
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          ) : (
            // <p>{patient.address || "Not provided"}</p>
            <p>dddd</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
