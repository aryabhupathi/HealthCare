import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { IoBarChart, IoTime } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
type User = {
  name: string;
  role: "Doctor" | "Patient" | "Admin";
  email: string;
};
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    doctors: 0,
    patients: 0,
    admins: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [system, setSystem] = useState({
    uptime: "0%",
    dbStatus: "Loading...",
    updates: 0,
    lastBackup: "Loading...",
  });
  const [alerts, setAlerts] = useState<{ msg: string; level: string }[]>([]);
  const [activity, setActivity] = useState<{ msg: string; time: string }[]>([]);
  useEffect(() => {
    setStats({ totalUsers: 120, doctors: 15, patients: 95, admins: 3 });
    setUsers([
      { name: "Dr. Sarah Lee", role: "Doctor", email: "sarah@hc.com" },
      { name: "John Doe", role: "Patient", email: "john@hc.com" },
      { name: "Emily Davis", role: "Patient", email: "emily@hc.com" },
    ]);
    setSystem({
      uptime: "99.9%",
      dbStatus: "Healthy",
      updates: 2,
      lastBackup: "2 hrs ago",
    });
    setAlerts([
      { msg: "Multiple failed logins detected", level: "High" },
      { msg: "Doctor Sarah updated credentials", level: "Medium" },
    ]);
    setActivity([
      { msg: "New user Emily Davis registered", time: "1 hr ago" },
      { msg: "Admin John updated system settings", time: "3 hrs ago" },
      { msg: "Database backup completed", time: "Today 08:00 AM" },
    ]);
  }, []);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            color: "text-blue-600",
          },
          { label: "Doctors", value: stats.doctors, color: "text-green-600" },
          {
            label: "Patients",
            value: stats.patients,
            color: "text-purple-600",
          },
          { label: "Admins", value: stats.admins, color: "text-red-600" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-5 text-center hover:scale-[1.02] transition"
          >
            <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUsers className="text-blue-600" /> Manage Users
          </h2>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Email</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="p-2">{user.name}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2 text-gray-600">{user.email}</td>
                  <td className="p-2 text-right">
                    <button className="text-sm text-blue-600 hover:underline mr-3">
                      Edit
                    </button>
                    <button className="text-sm text-red-600 hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IoBarChart className="text-green-600" /> System Overview
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Server Uptime</span>
              <span className="font-medium text-green-600">
                {system.uptime}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Database Status</span>
              <span className="font-medium text-green-600">
                {system.dbStatus}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Pending Updates</span>
              <span className="font-medium text-red-500">{system.updates}</span>
            </li>
            <li className="flex justify-between">
              <span>Last Backup</span>
              <span className="font-medium text-gray-600">
                {system.lastBackup}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MdOutlineSecurity className="text-red-600" /> Security Alerts
          </h2>
          <ul className="space-y-3 text-sm">
            {alerts.map((a, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{a.msg}</span>
                <span
                  className={`text-xs font-semibold ${
                    a.level === "High"
                      ? "text-red-500"
                      : a.level === "Medium"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                >
                  {a.level}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IoTime className="text-purple-600" /> Recent Activity
          </h2>
          <ul className="space-y-3 text-sm">
            {activity.map((a, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{a.msg}</span>
                <span className="text-xs text-gray-500">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
