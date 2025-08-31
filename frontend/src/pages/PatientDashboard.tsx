import OverviewCards from "../components/patients/overview";
import Appointments from "../components/patients/appointments";
import Prescriptions from "../components/patients/prescriptions";
import LabReports from "../components/patients/labReports";
import Billing from "../components/patients/billing";
import Notifications from "../components/patients/notifications";
import { useAuth } from "../context/AuthContext";
export default function PatientDashboard() {
  const { user } = useAuth();
  const appointments = [
    { doctor: "Dr. Sarah Lee", date: "Sept 5, 10:00 AM", type: "Teleconsult" },
    { doctor: "Dr. James Roy", date: "Sept 10, 02:00 PM", type: "In-Person" },
  ];
  const prescriptions = [
    { name: "Amoxicillin 500mg – 2x daily", duration: "Till Sept 10" },
    { name: "Metformin 850mg – 1x daily", duration: "Ongoing" },
  ];
  const reports = [
    { name: "Blood Test Report - Aug 2025" },
    { name: "X-Ray - Chest Scan" },
  ];
  const bills = [
    {
      service: "Consultation with Dr. Lee",
      amount: "₹500",
      status: "pending" as const,
    },
  ];
  const notifications = [
    "💊 Time to take Amoxicillin (8:00 PM)",
    "📅 Appointment with Dr. Roy tomorrow at 2 PM",
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold text-gray-800">
          Welcome back, {user?.name ?? "Patient"} 👋
        </h1>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Book Appointment
          </button>
          <div className="flex items-center gap-2">
            <img
              src={user?.avatarUrl || "/avatar.png"}
              alt="Patient Avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div className="hidden md:block">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <OverviewCards appointmentsCount={appointments.length} />
      <Appointments appointments={appointments} />
      <Prescriptions prescriptions={prescriptions} />
      <LabReports reports={reports} />
      <Billing bills={bills} />
      <Notifications notifications={notifications} />
    </div>
  );
}
