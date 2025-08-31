import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
type Appointment = {
  _id: string;
  doctor: {
    name: string;
    email: string;
  };
  date: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
};
export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const { user } = useAuth();
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://localhost:1111/patient/${user.id}/appointments`
        );
        const data = await res.json();
        if (data.success) {
          setAppointments(data.data);
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };
    fetchAppointments();
  }, []);
  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Appointments</h2>
      <div className="flex gap-3 mb-6">
        {["all", "scheduled", "completed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${
                filter === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {filteredAppointments.length === 0 ? (
        <div className="text-center text-gray-500">No appointments found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {appt.doctor?.name || "Doctor"}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    appt.status === "scheduled"
                      ? "bg-yellow-100 text-yellow-700"
                      : appt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {new Date(appt.date).toLocaleDateString()} at{" "}
                {new Date(appt.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Reason:</span> {appt.reason}
              </p>
              <button className="w-full mt-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
