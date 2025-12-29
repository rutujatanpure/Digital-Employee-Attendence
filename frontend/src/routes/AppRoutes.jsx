import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddEmployee from "../pages/admin/AddEmployee";
import ViewEmployees from "../pages/admin/ViewEmployees";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeIDCard from "../pages/employee/EmployeeIDCard";
import AdminLogin from "../pages/admin/AdminLogin";
import EditEmployee from "../pages/admin/EditEmployee";
import AdminAttendance from "../pages/admin/AdminAttendance";
import AdminAttendanceReport from "../pages/admin/AdminAttendanceReport"; // ✅ ADD THIS

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add" element={<AddEmployee />} />
        <Route path="/admin/employees" element={<ViewEmployees />} />
        <Route path="/admin/edit/:id" element={<EditEmployee />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route
          path="/admin/attendance-report"
          element={<AdminAttendanceReport />}
        />

        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/:id" element={<EmployeeIDCard />} />
      </Routes>
    </BrowserRouter>
  );
}
