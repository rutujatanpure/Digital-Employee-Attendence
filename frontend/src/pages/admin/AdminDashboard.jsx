import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

export default function AdminDashboard() {
  return (
    <>
      <Header title="Admin Dashboard" />

      {/* 🔴 FIX HERE */}
      <div className="d-flex" style={{ height: "calc(100vh - 56px)" }}>
   <Sidebar
  links={[
    { label: "Dashboard", path: "/admin", icon: "bi-speedometer2" },
    { label: "Create Employee ID", path: "/admin/add", icon: "bi-person-plus" },
    { label: "Employee List", path: "/admin/employees", icon: "bi-people" },
    { label: "Attendance", path: "/admin/attendance", icon: "bi-check2-square" },
    { label: "Attendance Report", path: "/admin/attendance-report", icon: "bi-file-earmark-text" }
  ]}
/>


        

        <div className="p-4 w-100 overflow-auto">
          <h4 className="fw-bold">Welcome Admin</h4>
          <p className="text-muted">
            Use the sidebar to manage employees and attendance.
          </p>
        </div>
      </div>
    </>
  );
}
