import Sidebar from "../../components/common/Sidebar";
import EmployeeTable from "../../components/admin/EmployeeTable";
import { useState, useEffect } from "react";

export default function ViewEmployees() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listen to window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to sidebar collapsed state (example via localStorage)
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
        <div className="card shadow-sm h-100 d-flex flex-column">
          <div className="card-body flex-grow-1 overflow-auto">
            {/* Wrap EmployeeTable in a responsive div for mobile */}
            <div className="table-responsive">
              <EmployeeTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
