import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd,
  FaCalendarAlt,
  FaFileMedical,
  FaVials,
  FaFileInvoiceDollar,
  FaPills,
  FaHospital,
  FaUsersCog,
  FaChartLine,
  FaBell,
  FaCog,
  FaClipboardList,
} from "react-icons/fa";
export default function AdminLayout() {
  const location = useLocation();
  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/admin/patients", label: "Patients", icon: <FaUserInjured /> },
    { to: "/admin/doctors", label: "Doctors", icon: <FaUserMd /> },
    {
      to: "/admin/appointments",
      label: "Appointments",
      icon: <FaCalendarAlt />,
    },
    {
      to: "/admin/medical-records",
      label: "Medical Records",
      icon: <FaFileMedical />,
    },
    { to: "/admin/labs", label: "Labs & Tests", icon: <FaVials /> },
    {
      to: "/admin/billing",
      label: "Billing & Payments",
      icon: <FaFileInvoiceDollar />,
    },
    { to: "/admin/pharmacy", label: "Pharmacy & Inventory", icon: <FaPills /> },
    { to: "/admin/departments", label: "Departments", icon: <FaHospital /> },
    { to: "/admin/staff", label: "Staff Management", icon: <FaUsersCog /> },
    {
      to: "/admin/reports",
      label: "Reports & Analytics",
      icon: <FaChartLine />,
    },
    {
      to: "/admin/messages",
      label: "Messages & Notifications",
      icon: <FaBell />,
    },
    { to: "/admin/settings", label: "System Settings", icon: <FaCog /> },
    { to: "/admin/audit", label: "Audit Logs", icon: <FaClipboardList /> },
  ];
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold border-b border-blue-700">
          🏥 MediAdmin
        </div>
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center w-full px-6 py-3 text-left hover:bg-blue-800 transition ${
                location.pathname === item.to ? "bg-blue-700" : ""
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
