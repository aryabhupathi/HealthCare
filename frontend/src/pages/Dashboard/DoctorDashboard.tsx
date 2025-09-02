import { useEffect, useState } from "react";
import { IoCalendar, IoPersonCircle } from "react-icons/io5";
import { FaUserMd, FaNotesMedical } from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
type Appointment = {
  id: string;
  name: string;
  time: string;
  type: string;
};
type Patient = {
  id: string;
  name: string;
};
type Prescription = {
  id: string;
  patient: string;
};
type Notification = {
  id: string;
  message: string;
  status: "urgent" | "normal";
  time?: string;
};
export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `http://localhost:1111/doctor/dashboard/${user?.id}`
        );
        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments || []);
          setPatients(data.patients || []);
          setPrescriptions(data.prescriptions || []);
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Error fetching doctor dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchDashboard();
    }
  }, [user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        👨‍⚕️ Welcome, Dr. {user?.name}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          value={appointments.length}
          label="Appointments Today"
          color="blue"
        />
        <StatCard
          value={patients.length}
          label="Active Patients"
          color="green"
        />
        <StatCard
          value={prescriptions.length}
          label="Pending Prescriptions"
          color="purple"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IoCalendar className="text-blue-600" /> Upcoming Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming appointments</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {appointments.map((appt) => (
                <li
                  key={appt.id}
                  className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <IoPersonCircle className="text-gray-400 text-3xl" />
                    <div>
                      <p className="font-medium">{appt.name}</p>
                      <p className="text-sm text-gray-500">{appt.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {appt.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUserMd className="text-green-600" /> Recent Patients
          </h2>
          {patients.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent patients</p>
          ) : (
            <ul className="space-y-3">
              {patients.map((patient) => (
                <li
                  key={patient.id}
                  className="flex justify-between items-center py-2 border-b last:border-none"
                >
                  <span className="font-medium">{patient.name}</span>
                  <button className="text-sm text-blue-600 hover:underline">
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MdOutlineMedicalServices className="text-red-600" /> Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li key={n.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{n.message}</span>
                  {n.status === "urgent" ? (
                    <span className="text-xs text-red-500 font-semibold">
                      Urgent
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">{n.time}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaNotesMedical className="text-purple-600" /> Pending Prescriptions
          </h2>
          {prescriptions.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending prescriptions</p>
          ) : (
            <ul className="space-y-3">
              {prescriptions.map((p) => (
                <li key={p.id} className="flex justify-between items-center">
                  <span className="font-medium">{p.patient}</span>
                  <button className="text-sm text-purple-600 hover:underline">
                    Review
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
function StatCard({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl shadow p-5 text-center hover:scale-[1.02] transition">
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
