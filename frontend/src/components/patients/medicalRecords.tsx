import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
interface Record {
  _id: string;
  type: string;
  description: string;
  fileUrl?: string;
  date: string;
  doctorId?: { name: string; specialization: string };
}
export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    const fetchRecords = async () => {
      const res = await fetch(
        `http://localhost:1111/patient/${user.id}/records`
      );
      const data = await res.json();
      if (data.success) setRecords(data.data);
    };
    fetchRecords();
  }, [user?.id]);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📑 Medical Records</h2>
      {records.length === 0 ? (
        <p className="text-gray-500">No medical records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec._id}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg capitalize">{rec.type}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(rec.date).toDateString()}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{rec.description}</p>
              {rec.doctorId && (
                <p className="text-sm text-gray-500 mt-2">
                  👨‍⚕️ {rec.doctorId.name} ({rec.doctorId.specialization})
                </p>
              )}
              {rec.fileUrl && (
                <a
                  href={rec.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:underline"
                >
                  View File
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
