import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Appointments from "./components/patients/appointments";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashBoardLayout";
import Profile from "./components/patients/profiile";
import MedicalRecords from "./components/patients/medicalRecords";
function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {user?.role === "patient" && (
          <Route index element={<PatientDashboard />} />
        )}
        {user?.role === "doctor" && (
          <Route index element={<DoctorDashboard />} />
        )}
        {user?.role === "admin" && <Route index element={<AdminDashboard />} />}
        <Route path="appointments" element={<Appointments />} />
        <Route path="records" element={<MedicalRecords />} />
        <Route path="admin" element={<Admin />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
export default App;
