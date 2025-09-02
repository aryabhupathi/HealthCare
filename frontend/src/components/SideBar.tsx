import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoHome, IoCalendar } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { LuSquareMenu } from "react-icons/lu";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import {
  FaUser,
  FaNotesMedical,
  FaPrescriptionBottleAlt,
  FaFileInvoiceDollar,
  FaHeartbeat,
  FaSyringe,
} from "react-icons/fa";
import {
  MdMedicalServices,
  MdOutlineNotificationsActive,
  MdMessage,
} from "react-icons/md";
import type { JSX } from "react";
export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
    else setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);
  if (!user) return null;
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const links: { to: string; label: string; icon: JSX.Element }[] = [];
  if (user.role === "patient") {
    links.push(
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <IoHome className="h-5 w-5" />,
      },
      {
        to: "/dashboard/profile",
        label: "Profile",
        icon: <FaUser className="h-5 w-5" />,
      },
      {
        to: "/dashboard/appointments",
        label: "Appointments",
        icon: <IoCalendar className="h-5 w-5" />,
      },
      {
        to: "/dashboard/doctors",
        label: "Doctors",
        icon: <MdMedicalServices className="h-5 w-5" />,
      },
      {
        to: "/dashboard/records",
        label: "Medical Records",
        icon: <FaNotesMedical className="h-5 w-5" />,
      },
      {
        to: "/dashboard/prescriptions",
        label: "Prescriptions",
        icon: <FaPrescriptionBottleAlt className="h-5 w-5" />,
      },
      {
        to: "/dashboard/billing",
        label: "Billing",
        icon: <FaFileInvoiceDollar className="h-5 w-5" />,
      },
      {
        to: "/dashboard/messages",
        label: "Messages",
        icon: <MdMessage className="h-5 w-5" />,
      },
      {
        to: "/dashboard/notifications",
        label: "Notifications",
        icon: <MdOutlineNotificationsActive className="h-5 w-5" />,
      }
    );
  }
  if (user.role === "doctor") {
    links.push(
      {
        to: "/dashboard/appointments",
        label: "My Appointments",
        icon: <IoCalendar className="h-5 w-5" />,
      },
      {
        to: "/dashboard/patients",
        label: "Patients",
        icon: <FaUserGroup className="h-5 w-5" />,
      }
    );
  }
  if (user.role === "admin") {
    links.push(
      {
        to: "/dashboard/admin",
        label: "Admin Panel",
        icon: <MdMedicalServices className="h-5 w-5" />,
      },
      {
        to: "/dashboard/users",
        label: "Manage Users",
        icon: <FaUserGroup className="h-5 w-5" />,
      }
    );
  }
  return (
    <div className="flex">
      {!open && (
        <button
          className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <LuSquareMenu className="h-6 w-6" />
        </button>
      )}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
  ${collapsed ? "md:w-20" : "md:w-64"}
  w-72 z-50 flex flex-col`}
      >
        <div className="flex items-center px-4 py-5 border-b">
          {!collapsed && (
            <h1 className="hidden md:block text-xl font-bold text-blue-600">
              HealthCare
            </h1>
          )}
          <button
            className="hidden md:ml-auto md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FiArrowRightCircle size={18} />
            ) : (
              <FiArrowLeftCircle size={18} />
            )}
          </button>
          <button
            className="md:hidden ml-auto text-gray-500 text-2xl"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={`block ${collapsed ? "md:hidden" : "md:block"}`}>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 transition
        ${collapsed ? "md:justify-center" : ""}`}
            >
              {link.icon}
              <span
                className={`inline ${collapsed ? "md:hidden" : "md:inline"}`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 text-red-600 transition
      ${collapsed ? "md:justify-center" : ""}`}
          >
            <BsFillArrowRightSquareFill className="h-5 w-5" />
            <span className={`inline ${collapsed ? "md:hidden" : "md:inline"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
      <div
        className={`flex-1 transition-all ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="h-14 md:hidden" />
      </div>
    </div>
  );
}
