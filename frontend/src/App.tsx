import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashBoardLayout";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import Patient from "./pages/Admin/Patient";
import Doctor from "./pages/Admin/Doctor";
import Appointment from "./pages/Admin/Appointment";
import Record from "./pages/Admin/Record";
import Bills from "./pages/Admin/Bills";
import Report from "./pages/Admin/Report";
import Settings from "./pages/Admin/Settings";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/*" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="patients" element={<Patient />} />
        <Route path="doctors" element={<Doctor />} />
        <Route path="appointments" element={<Appointment />} />
        <Route path="medical-records" element={<Record />} />
        <Route path="billing" element={<Bills />} />
        <Route path="reports" element={<Report />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
