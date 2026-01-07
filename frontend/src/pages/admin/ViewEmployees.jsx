import Sidebar from "../../components/common/Sidebar";
import EmployeeTable from "../../components/admin/EmployeeTable";
import { useState, useEffect } from "react";

export default function ViewEmployees() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleCollapsed = () => {
      const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(isCollapsed);
    };
    window.addEventListener("storage", handleCollapsed);
    return () => window.removeEventListener("storage", handleCollapsed);
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar
        links={[
          { label: "Add Employee", path: "/admin/add" },
          { label: "Employee List", path: "/admin/employees" },
        ]}
      />

      {/* Content */}
      <div
        className="flex-grow-1 overflow-auto p-4"
        style={{
          marginLeft: isMobile ? "0" : collapsed ? "60px" : "220px",
          transition: "margin-left 0.3s ease",
          height: "100vh",
        }}
      >
        <h2 className="text-center mb-3">Employee List</h2>
        <EmployeeTable />
      </div>
    </div>
  );
}
