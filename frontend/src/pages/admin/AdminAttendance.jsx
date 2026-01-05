import Sidebar from "../../components/common/Sidebar";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Fetch attendance data
  useEffect(() => {
    API.get("/attendance")
      .then((res) => setAttendance(res.data))
      .catch(() => setError("Failed to load attendance"));
  }, []);

  // Listen to window resize for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to sidebar collapsed state
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
      <Sidebar />

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
          {/* Card Header */}
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Attendance Records</h5>
          </div>

          {/* Card Body */}
          <div className="card-body flex-grow-1 overflow-auto">
            {error && <p className="text-danger">{error}</p>}

            {/* Table (desktop + mobile) */}
            <div className="table-responsive h-100">
              <table className="table table-bordered table-hover text-center table-sm mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Day</th>
                    <th>Employee ID</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Saved Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No attendance found
                      </td>
                    </tr>
                  )}
                  {attendance.map((a, i) => {
                    const d = new Date(a.date);
                    return (
                      <tr key={i}>
                        <td>{d.getFullYear()}</td>
                        <td>{d.getMonth() + 1}</td>
                        <td>{d.getDate()}</td>
                        <td>{a.employeeId}</td>
                        <td>{a.inTime ? new Date(a.inTime).toLocaleTimeString() : "-"}</td>
                        <td>{a.outTime ? new Date(a.outTime).toLocaleTimeString() : "-"}</td>
                        <td>
                          {a.outTime ? (
                            <span className="badge bg-success">
                              Attendance Saved Successfully
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
