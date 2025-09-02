import { useEffect, useState } from "react";
type MedicalRecord = {
  _id: string;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
  };
  diagnoses: string[];
  allergies: string[];
  medications: { name: string; dosage: string; duration: string }[];
  documents: { type: string; url: string; verified: boolean }[];
  lastUpdated: string;
};
export default function Record() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/medical-records")
      .then((res) => res.json())
      .then((data) => setRecords(data));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📑 Medical Records</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by patient name"
          className="border rounded-lg px-3 py-2 w-1/3"
        />
        <select className="border rounded-lg px-3 py-2">
          <option>All</option>
          <option>Verified</option>
          <option>Unverified</option>
        </select>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Diagnoses</th>
              <th className="p-3 text-left">Medications</th>
              <th className="p-3 text-left">Documents</th>
              <th className="p-3 text-left">Last Updated</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {r.patient.name} ({r.patient.age}, {r.patient.gender})
                </td>
                <td className="p-3">{r.diagnoses.join(", ")}</td>
                <td className="p-3">
                  {r.medications.map((m) => (
                    <div key={m.name}>
                      {m.name} ({m.dosage})
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  {r.documents.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <a
                        href={d.url}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        {d.type}
                      </a>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          d.verified
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {d.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  {new Date(r.lastUpdated).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2">
                    Verify
                  </button>
                  <button className="px-3 py-1 bg-gray-500 text-white rounded-lg">
                    Upload
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
